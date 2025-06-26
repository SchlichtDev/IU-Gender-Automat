const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const publicDir = path.join(__dirname, '..', 'public');
const dataFile = path.join(__dirname, '..', 'docs', 'donations.json');

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

function handleFormSubmission(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const data = querystring.parse(body);
    fs.readFile(dataFile, (err, content) => {
      const donations = err ? [] : JSON.parse(content);
      donations.push({
        name: data.name || '',
        email: data.email || '',
        items: data.items || '',
        region: data.region || '',
        timestamp: new Date().toISOString()
      });
      fs.writeFile(dataFile, JSON.stringify(donations, null, 2), err2 => {
        if (err2) {
          res.writeHead(500);
          res.end('Could not save donation');
        } else {
          res.writeHead(302, { Location: '/success.html' });
          res.end();
        }
      });
    });
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/register') {
    handleFormSubmission(req, res);
  } else if (req.method === 'GET' && req.url === '/donations') {
    fs.readFile(dataFile, (err, content) => {
      if (err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('[]');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(content);
      }
    });
  } else {
    let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const type = ext === '.css' ? 'text/css' : ext === '.js' ? 'text/javascript' : 'text/html';
    serveStatic(res, filePath, type);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
