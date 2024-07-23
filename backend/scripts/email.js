const emailjs = require('@emailjs/nodejs');
const { link } = require('../routes/UserRoutes');

const sendEmail = (data) => {
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

  emailjs.send(serviceID, templateID, templateParams, {
    publicKey: publicKey,
    privateKey: privateKey, 
  })
  .then(
    (response) => {
      console.log('SUCCESS!', response.status, response.text);
    },
    (err) => {
      console.log('FAILED...', err);
    }
  );
};

module.exports = sendEmail;
