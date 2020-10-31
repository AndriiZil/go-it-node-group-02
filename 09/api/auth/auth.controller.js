const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const UserModel = require('./auth.model');


class AuthController {


    async signUp(req, res, next) {
        try {

            const existingUser = await UserModel.findOne({ email: req.body.email });

            if (existingUser) {
                return res.send({ message: 'Such user already exists' });
            }

            const user = await UserModel.create(req.body);

            await AuthController.sendVerificationEmail(user);

            return res.send({ email: user.email });

        } catch(err) {
            next(err);
        }
    }

    async singIn(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await UserModel.findOne({ email });

            if (!user) {
                return res.status(404).send({ message: 'User was not found' });
            }

            if (user.password !== password) {
                return res.status(422).send({ message: 'Password is not valid' });
            }

            if (user.status !== 'verified') {
                return res.status(401).send({ message: 'User was not verified' });
            }

            return res.send({ token: '$f5ew4d87fg4er5f1.7fs5df1d5f4s9dg74d.fgd98f4gfs8g4' });
        } catch(err) {
            next(err);
        }
    }

    async verifyEmail(req, res, next) {
        try {
            const verificationToken = req.params.token;

            if (!verificationToken) {
                return res.status(422).send({ message: 'Verification token should be specified' });
            }

            const userToVerify = await UserModel.findOne({ verificationToken });

            if (!userToVerify) {
                return res.status(404).send({ message: 'User was not found' });
            }

            await AuthController.verifyUser(userToVerify._id);

            return res.send({ message: 'User was verified' });
        } catch(err) {
            next(err);
        }
    }

    static async verifyUser(userId) {
        await UserModel.findByIdAndUpdate(userId, {
            status: 'verified',
            verificationToken: null,
        });

        return 'success';
    }

    static async sendVerificationEmail(user) {
        const varificationToken = await AuthController.savaVerificationToken(user._id);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASSWORD
            }
        });

        const veriificationUrl = `http://localhost:3000/auth/verify/${varificationToken}`;

        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to: user.email, // ['test@gmail.com', 'example@gmail.com']
            subject: 'Verification Email',
            html: `<a href='${veriificationUrl}'>click here for verification</a>`
        };

        await transporter.sendMail(mailOptions);
    }

    static async savaVerificationToken(userId) {
        const token = uuidv4();

        const { verificationToken } = await UserModel.findByIdAndUpdate(userId, {
            verificationToken: token
        }, { new: true });

        return verificationToken;
    }

}

module.exports = new AuthController();