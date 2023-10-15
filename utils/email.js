const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    (this.to = user.email),
      (this.firstName = user.name.split(' ')[0]),
      (this.url = url);
    this.from = `Barhouma <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: process.env.PROD_MAIL_SERVICE,
        auth: {
          user: process.env.BREVO_EMAIL,
          pass: process.env.BREVO_PASS,
        },
      });
    }

    return nodemailer.createTransport({
      //create transporter
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        pass: process.env.EMAIL_PASS,
        user: process.env.EMAIL_USER,
      },
    });
  }
  //send the actual email

  async send(template, subject) {
    //1) RENDER THE PUG TEMPPLATE INTO HTML
    const html = pug.renderFile(`${__dirname}/../view/emails/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    //2) DEFINE THE EMAIL OPTIONS
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };
    //3) CREATE TRANSPORT AND SEND THE EMAIL

    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to our natours family!');
  }
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'your password reset token valid for only 10 minutes',
    );
  }
};
