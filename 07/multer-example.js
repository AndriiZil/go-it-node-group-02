const express = require('express');
const multer = require('multer');
const logger = require('morgan');
const path = require('path');
const { promises: fsPromises } = require('fs');

const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

const googleUpload = require('./google_upload_example');

// const upload = multer({ dest: 'static' });
const storage = multer.diskStorage({
    destination: 'static',
    filename: function (req, file, cb) {
        const fileExt = path.parse(file.originalname).ext;
        // console.log('EXT', fileExt);
        cb(null, file.fieldname + '-' + Date.now() + fileExt);
    }
});

const BUCKET = 'example-goit';

const upload = multer({ storage });

const app = express();

app.use(logger('dev'));

app.use(express.static('images'));

const PORT = 3000;

app.post('/form-data', upload.single('file_example'), minifyImage, async (req, res, next) => {
    console.log('req.body', req.body);
    console.log('req.file', req.file);

    await googleUpload(BUCKET, req.file.path);

    return res.send(req.file);
});

/**
 * {
        fieldname: 'file_example',
        originalname: 'pexels-photo-1402787.jpeg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'static',
        filename: '367438c025de53c2ef1d72bd2d4ed500',
        path: 'static/367438c025de53c2ef1d72bd2d4ed500',
        size: 567002
  }
 */

app.listen(PORT, () => {
    console.log('Server was started.');
});

async function minifyImage(req, res, next) {

    try {
        console.log('start processing file...');

        const MINIFIED_DIR = 'images';

        const files = await imagemin([req.file.path], {
            destination: MINIFIED_DIR,
            plugins: [
                imageminJpegtran(),
                imageminPngquant({
                    quality: [0.6, 0.8]
                })
            ]
        });

        const { path: pathFoDelete, filename } = req.file;

        await fsPromises.unlink(pathFoDelete); // delete file

        console.log(path);

        req.file = {
            ...req.file,
            path: path.join(MINIFIED_DIR, filename),
            destination: MINIFIED_DIR
        };

        console.log('end processing file!');

        next();

    } catch(err) {
        console.log(err);
    }

}
