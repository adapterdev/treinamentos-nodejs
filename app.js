const http = require('http');
const fs = require('fs');

const { parse } = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method === 'GET') {
        if (url == '/styles/app.css') {
            res.setHeader('Content-Type', 'text/css');
            
            fs.readFile('public/styles/app.css', (err, data) => {
                if (err) {
                    console.log(err);
                    res.statusCode = 500;
                    return;
                }
                
                res.statusCode = 200;
                res.end(data);
            });
        }

        if (url === '/') {
            res.setHeader('Content-Type', 'text/html');
            
            fs.readFile('public/index.html', (err, data) => {
                if (err) {
                    console.log(err);
                    res.statusCode = 500;
                    return;
                }
                
                res.statusCode = 200;
                res.end(data);
            });
        }
        
        if (url === '/adicionar') {
            res.setHeader('Content-Type', 'text/html');
            
            fs.readFile('public/form.html', (err, data) => {
                if (err) {
                    console.log(err);
                    res.statusCode = 500;
                    return;
                }
                
                res.statusCode = 200;
                res.end(data);
            });
        }

        if (url === '/dados') {
            res.setHeader('Content-Type', 'application/json');
            
            fs.readFile('db.json', (err, data) => {
                if (err) {
                    console.log(err);
                    res.statusCode = 500;
                    return;
                }
                
                res.statusCode = 200;
                res.end(data);
            });
        }
    }

    if (method === 'POST') {
        if (url === '/adicionar') {
            let body = '';

            req.on('data', function (chunk) {
                body += chunk.toString();
            });

            req.on('end', function () {
                const item = parse(body);
                const db = JSON.parse(fs.readFileSync('db.json'));
                
                db.produtos.push(item);
                fs.writeFileSync('db.json', JSON.stringify(db));
                
                fs.readFile('public/index.html', (err, data) => {
                    if (err) {
                        console.log(err);
                        res.statusCode = 500;
                        return;
                    }
                    
                    res.setHeader('Content-Type', 'text/html');
                    res.statusCode = 200;

                    res.end(data);
                });
            });

        }
    }
});

server.listen(port, hostname,
    () => console.log(`Server listening on http://${hostname}:${port}`)
);