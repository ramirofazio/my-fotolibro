const nodemailer = require("nodemailer");
require('dotenv').config();
const { EMAIL_PASSWORD, EMAIL_USER } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
   
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

module.exports = transporter