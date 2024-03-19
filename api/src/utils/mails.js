const transporter = require("../node_mailer");
const { env } = require("./env");


module.exports = {
  sendConfirmationMail: async function ({ name, id, photos_length }) {
    const response = await transporter.sendMail({
      from: `"myfotolibro 📷" <${env.mail.USER}>`,
      to: env.mail.ADMIN,
      subject: "Se cargó nuevo book",
      text: "Hello world?",
      html: `
        <h1>El cliente ${name}</h1>
        <h3>ID: ${id}</h3>
        <hr/>
        <h2>Termino su book con ${photos_length} fotos</h1>
        `,
    });
    return response;
  },
};
