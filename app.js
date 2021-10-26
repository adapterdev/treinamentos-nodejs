const http = require('http');
const fs = require('fs');
const url = require('url');

const { parse } = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(function (req, res) {
    if (req.method === 'GET') {
        if (req.url === '/') {
            res.setHeader('Content-Type', 'text/html; charset=utf-8;');
            
            fs.readFile('public/index.html', function (err, data) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    return;
                }
                
                res.statusCode = 200;
                res.end(data);
            });
        } else if (req.url === '/adicionar') {
            res.setHeader('Content-Type', 'text/html; charset=utf-8;');
            
            fs.readFile('public/form.html', function (err, data) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    return;
                }
                
                res.statusCode = 200;
                res.end(data);
            });
        } else if (req.url === '/dados') {
            res.setHeader('Content-Type', 'application/json; charset=utf-8;');
            
            fs.readFile('db.json', function (err, data) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    return;
                }
                
                res.statusCode = 200;
                res.end(data);
            });
        } else if (req.url == '/styles/app.css') {
            res.setHeader('Content-Type', 'text/css; charset=utf-8;');
            
            fs.readFile('public/styles/app.css', function (err, data) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    return;
                }
                
                res.statusCode = 200;
                res.end(data);
            });
        } else {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8;')
            res.statusCode = 404;
            res.end('Página não encontrada');
        }
    }

    if (req.method === 'POST') {
        if (req.url === '/adicionar') {
            let body = '';

            req.on('data', function (chunk) {
                body += chunk.toString();
            });

            req.on('end', function () {
                const item = parse(body);
                const db = JSON.parse(fs.readFileSync('db.json'));
                
                item.id = Math.random().toString(36).slice(2);
                db.produtos.push(item);

                fs.writeFileSync('db.json', JSON.stringify(db));

                res.statusCode = 200;
                res.end();
            });
        } else if (req.url === '/limpar') {
            fs.readFile('db.json', function (err, data) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    return;
                }

                const db = JSON.parse(data);
                db.produtos = [];

                fs.writeFileSync('db.json', JSON.stringify(db));

                res.statusCode = 200;
                res.end();
            });
        } else {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8;')
            res.statusCode = 404;
            res.end('Página não encontrada');
        }
    }

    if (req.method === 'DELETE') {
        const urlObj = url.parse(req.url);

        if (urlObj.pathname === '/delete') {
            const query = parse(urlObj.query);

            fs.readFile('db.json', function (err, data) {
                if (err) {
                    console.error(err);
                    return;
                }

                const db = JSON.parse(data);
                const idx = db.produtos.findIndex(x => x.id === query.id);

                if (idx >= 0) {
                    db.produtos.splice(idx, 1);
                    fs.writeFileSync('db.json', JSON.stringify(db));
                }

                res.statusCode = 200;
                res.end();
            });
        } else {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8;')
            res.statusCode = 404;
            res.end('Página não encontrada');
        }
    }
});

server.listen(port, hostname,
    () => console.log(`Server listening on http://${hostname}:${port}`)
);