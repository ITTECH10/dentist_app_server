const nodemailer = require('nodemailer');

module.exports = class Email {
    constructor(recipient, url) {
        this.to = recipient.email;
        this.firstName = recipient.firstName
        this.url = url;
        this.from = `hDental admin team <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        // Sendgrid
        return nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD
            }
        });

        // return nodemailer.createTransport({
        //   host: process.env.EMAIL_HOST,
        //   port: process.env.EMAIL_PORT,
        //   auth: {
        //     user: process.env.EMAIL_USERNAME,
        //     pass: process.env.EMAIL_PASSWORD
        //   }
        // });
    }

    // Send the actual email
    async send(subject, text) {
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text
        };

        await this.newTransport().sendMail(mailOptions);
    }

    async resetPassword() {
        const subject = 'Zaboravili ste šifru?'
        const body = `Da biste promijenili lozinku, molimo vas kliknite na link ispod.
        ${this.url}
        Napomena: imate 10 minuta da promjenite lozinku od trenutka kada ste dobili ovaj email.
        Ovaj email je automatski generisan, molimo vas ne odgovarajte na njega.`

        await this.send(subject, body);
    }
};
