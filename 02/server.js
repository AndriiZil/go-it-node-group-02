const http = require('http');

const server = http.createServer((req, res) => {

    console.log('METHOD', req.method);
    console.log('URL', req.url);
    console.log('headers', req.headers);

    switch(req.url) {
        case '/user':
            return res.end('Hello User');
            break;
        case '/post':
            return res.end('Hello Post');
            break
    }

    let body = '';

    req.on('data', chunk => {
        console.log('CHUNK', chunk);
        body += chunk.toString();
    });

    req.on('end', () => {
        console.log('Body received.');
    });

    res.writeHead(201, {
       'Content-Type': 'text/plain' 
    });

    // res.end('NodeJS!');
});

server.listen(3000, () => console.log('Server was started.'));