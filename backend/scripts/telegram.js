//  const fetch = require('node-fetch');

// const token = '6997161845:AAHec8KX9-OnQ1FKBCWjckWU-9mSSuWky9s';
// const chatId = 'NicerDebtbot'; 

// const sendTelegramMessage = async (message) => {
//   const url = `https://api.telegram.org/bot${token}/sendMessage`;
//   const response = await fetch(url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       chat_id: chatId,
//       text: message,
//     }),
//   });

//   const data = await response.json();
//   if (!data.ok) {
//     throw new Error(data.description);
//   }

//   console.log('Message sent:', data.result.text);
// };

// module.exports = sendTelegramMessage;
