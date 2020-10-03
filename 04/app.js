const express = require('express');

const app = express();

app.use(express.json());

app.get('/example/:id/add', modifiedRequest, (req, res, next) => {

    console.log('params', req.params);
    console.log('query', req.query);
    console.log('params', req.params);
    console.log('url', req.url);
    console.log('body', req.body);
    console.log('modifiedRequest', req.userdata);

    res.status(201).json('OK');
});

function modifiedRequest(req, res, next) {
    req.userdata = { id: 10 };
    next();
}

app.listen(3000);