const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: 'tomixdperez@gmail.com',
    pass: 'vwnb rtwn uhcy njpc'
  }
});

module.exports = transporter