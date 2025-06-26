const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const { URLSearchParams } = require('url');

const publicDir = path.join(__dirname, '..', 'public');
const dataFile = path.join(__dirname, '..', 'docs', 'donations.json');

// Statische Datei ausliefern
function serveStatic(res, filePath, contentType, statusCode = 200) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal Server Error');
        } else {
            res.writeHead(statusCode, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

// Formular verarbeiten
function handleFormSubmission(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        const data = querystring.parse(body);

        // PLZ-Validierung bei Abholung (z.B. 39xxx)
        if (data.mode === 'abholung' && (!data.plz || !data.plz.startsWith('39'))) {
            res.writeHead(400);
            res.end('Ungültige PLZ: Abholadresse liegt außerhalb des Einzugsgebiets.');
            return;
        }

        fs.readFile(dataFile, (err, content) => {
            let donations = [];

            // Robustes Einlesen
            if (!err && content.toString().trim() !== '') {
                try {
                    donations = JSON.parse(content);
                } catch (e) {
                    console.error('Fehler beim Parsen von donations.json:', e.message);
                    donations = [];
                }
            }

            // Neue Spende anlegen
            const donation = {
                name: data.name || '',
                email: data.email || '',
                items: data.items || '',
                region: data.region || '',
                mode: data.mode || '',
                timestamp: new Date().toISOString()
            };
            if (data.mode === 'abholung') {
                donation.address = {
                    street: data.street,
                    plz: data.plz,
                    city: data.city
                };
            }

            donations.push(donation);

            fs.writeFile(dataFile, JSON.stringify(donations, null, 2), err2 => {
                if (err2) {
                    res.writeHead(500);
                    res.end('Could not save donation');
                    return;
                }

                // URL-Parameter sauber aufbauen
                const params = new URLSearchParams();
                params.append('items', donation.items);
                params.append('region', donation.region);
                params.append('timestamp', donation.timestamp);
                params.append('mode', donation.mode);
                if (donation.mode === 'abholung') {
                    params.append('street', donation.address.street);
                    params.append('plz', donation.address.plz);
                    params.append('city', donation.address.city);
                }

                // Weiterleitung zur Bestätigungsseite mit Daten
                res.writeHead(302, { Location: `/success.html?${params.toString()}` });
                res.end();
            });
        });
    });
}

// HTTP-Server erstellen
const server = http.createServer((req, res) => {
    // 1) Favicon-Requests abfangen
    if (req.method === 'GET' && req.url === '/favicon.ico') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 2) Formular-Submission
    if (req.method === 'POST' && req.url === '/register') {
        return handleFormSubmission(req, res);
    }

    // 3) API: Spendenliste
    if (req.method === 'GET' && req.url === '/donations') {
        return fs.readFile(dataFile, (err, content) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(err ? '[]' : content);
        });
    }

    // 4) Statische Dateien (inkl. success.html ohne Query)
    const [urlPath] = req.url.split('?');
    const relPath = urlPath === '/' ? 'index.html' : urlPath.slice(1);
    const filePath = path.join(publicDir, relPath);
    const ext = path.extname(filePath);
    const type =
        ext === '.css' ? 'text/css' :
            ext === '.js' ? 'text/javascript' :
                ext === '.json' ? 'application/json' :
                    'text/html';

    serveStatic(res, filePath, type);
});

// Server starten
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});