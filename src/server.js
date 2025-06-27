const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const { URLSearchParams } = require('url');

const publicDir = path.join(__dirname, '..', 'public');
const dataFile = path.join(__dirname, '..', 'docs', 'donations.json');

// XSS-Schutz: Eingaben bereinigen
function sanitize(input) {
    return input.replace(/[&<>"'/]/g, function (char) {
        const escapeChars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        return escapeChars[char];
    });
}

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

        // Pflichtfelder prüfen
        if (!data.name || data.name.length < 2 || !data.email || !data.items || !data.region || !data.mode) {
            res.writeHead(400);
            res.end('Bitte alle Pflichtfelder korrekt ausfüllen.');
            return;
        }

        // Einfache E-Mail-Prüfung
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            res.writeHead(400);
            res.end('Ungültige E-Mail-Adresse.');
            return;
        }

        // PLZ-Validierung bei Abholung
        if (data.mode === 'abholung') {
            if (!data.plz || !data.plz.startsWith('39')) {
                res.writeHead(400);
                res.end('Ungültige PLZ: Abholadresse liegt außerhalb des Einzugsgebiets.');
                return;
            }
        }

        // Daten vorbereiten und bereinigen
        const donation = {
            name: sanitize(data.name),
            email: sanitize(data.email),
            items: sanitize(data.items),
            region: sanitize(data.region),
            mode: sanitize(data.mode),
            timestamp: new Date().toISOString()
        };

        if (data.mode === 'abholung') {
            donation.address = {
                street: sanitize(data.street || ''),
                plz: sanitize(data.plz || ''),
                city: sanitize(data.city || '')
            };
        }

        fs.readFile(dataFile, (err, content) => {
            let donations = [];
            if (!err && content.toString().trim() !== '') {
                try {
                    donations = JSON.parse(content);
                } catch (e) {
                    console.error('Fehler beim Parsen von donations.json:', e.message);
                }
            }

            donations.push(donation);
            fs.writeFile(dataFile, JSON.stringify(donations, null, 2), (err) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Fehler beim Speichern.');
                } else {
                    // Weiterleitung mit Parametern
                    const params = new URLSearchParams(donation);
                    if (donation.address) {
                        params.set('street', donation.address.street);
                        params.set('plz', donation.address.plz);
                        params.set('city', donation.address.city);
                    }

                    res.writeHead(302, { 'Location': '/success.html?' + params.toString() });
                    res.end();
                }
            });
        });
    });
}

// Server starten
http.createServer((req, res) => {
    const method = req.method;
    const url = req.url;

    if (method === 'POST' && url === '/register') {
        handleFormSubmission(req, res);
    } else {
        // Dateipfad bestimmen
        const filePath = path.join(publicDir, url === '/' ? 'index.html' : url);
        const ext = path.extname(filePath).toLowerCase();

        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.jpg': 'image/jpeg',
            '.webp': 'image/webp'
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';
        serveStatic(res, filePath, contentType);
    }
}).listen(3000, () => {
    console.log('Server läuft auf http://localhost:3000');
});