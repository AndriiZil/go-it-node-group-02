const nodemailer = require('nodemailer');

const { error } = require('dotenv').config();

if (error) {
    throw new Error(error);
}


async function sendEmailWithNodemailer() {
    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to: 'andrii.zilnyk@gmail.com', // ['test@gmail.com', 'example@gmail.com']
            subject: 'Email sending with Nodemailer',
            text: 'Example Text'
        };

        const result = await transporter.sendMail(mailOptions);

        console.log('RESULT', result);
    } catch(err) {
        console.log(err);
    }
}

sendEmailWithNodemailer();
