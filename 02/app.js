const express = require('express');
const middleware = require('./middleware');

const app = express();

// app.use((req, res, next) => {
//     console.log(new Date().toISOString());
//     next();
// });
app.use(middleware);

app.use(express.json());

app.use(express.static('static'));

// app.get('/', (req, res, next) => {
//     res.set('Set-Cookie', 'asd=asdasd');
//     next();
// }, (req, res) => {
//     res.send({ message: 'success' });
// });

app.get('/express', (req, res) => {
    // console.log(req.method);
    // console.log(req.url);
    // console.log(req.headers);
    return res.send('Hello GET Express !!!!!!');
});


app.post('/express', (req, res) => {
    console.log('DATA BODY', req.body);
    return res.send('Hello POST Express !!!!');
});

app.listen(3000, () => console.log('Server was started on port 3000'));
