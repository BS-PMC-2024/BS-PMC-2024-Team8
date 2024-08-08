const emailjs = require('@emailjs/nodejs');
const { link } = require('../routes/UserRoutes');

const sendEmail = async (data) => {
  const serviceID = 'order_conformation';
  const templateID = 'order_c';
  const publicKey = 'bVId8LXlgw6L9ZnIt';
  const privateKey = 'veJj2qF7bntsBeb-F4xGM';

  const templateParams = {
    name: data.name,
    message: data.message,
    email: data.email,
    company: data.company,
    link: data.link
  };

  try {
    const response = await emailjs.send(serviceID, templateID, templateParams, {
      publicKey: publicKey,
      privateKey: privateKey,
    });
    console.log('SUCCESS!', response.status, response.text);
  } catch (err) {
    console.error('FAILED...', err);
  }
};

module.exports = sendEmail;
