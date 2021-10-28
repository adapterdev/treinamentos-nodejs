const http = require('http');
const fs = require('fs');
const url = require('url');

const { parse } = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(function (req, res) {
    const urlObj = url.parse(req.url);
    
    if (req.method === 'GET') {
        if (urlObj.pathname === '/') {
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
        } else if (urlObj.pathname === '/adicionar' || urlObj.pathname === '/editar') {
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
        } else if (urlObj.pathname === '/dados') {
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
        } else if (urlObj.pathname === '/getProdutoById') {
            res.setHeader('Content-Type', 'application/json; charset=utf-8;');
            const query = parse(urlObj.query);

            if (query.id === null && query.id === undefined) {
                res.statusCode = 500;
                res.end();
            } else {
                fs.readFile('db.json', function (err, data) {
                    if (err) {
                        console.error(err);
                        res.statusCode = 500;
                        return;
                    }

                    const db = JSON.parse(data);
                    const item = db.produtos.find(p => p.id === query.id);
                    
                    res.statusCode = 200;
                    res.end(JSON.stringify(item));
                });
            }
            
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
        if (urlObj.pathname === '/adicionar') {
            let body = '';

            req.on('data', function (chunk) {
                body += chunk.toString();
            });

            req.on('end', function () {
                const item = parse(body);
                const db = JSON.parse(fs.readFileSync('db.json'));

                if (item.id !== null && item.id !== undefined && item.id.trim() !== '') {
                    const idx = db.produtos.findIndex(p => p.id === item.id);

                    if (idx >= 0) {
                        db.produtos[idx].nome = item.nome;
                        db.produtos[idx].quantidade = item.quantidade;
                    }
                } else {
                    item.id = Math.random().toString(36).slice(2);
                    db.produtos.push(item);
                }

                fs.writeFileSync('db.json', JSON.stringify(db));

                res.statusCode = 200;
                res.end();
            });
        } else if (urlObj.pathname === '/limpar') {
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