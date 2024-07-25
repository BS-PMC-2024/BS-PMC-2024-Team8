const cron = require('node-cron');
const mongoose = require('mongoose');
const sendEmail = require('./email');
const { sendTelegramMessage } = require('./telegram'); 
const People = require('../models/People');
const Process = require('../models/Process');

function applyStrategy(people, strategy) {
  let sortedPeople = [];
  switch (strategy) {
    case '0': // Focus on the bigger debt
      sortedPeople = people.sort((a, b) => b.Debt - a.Debt);
      break;
    case '1': // Focus on the latest debts
      sortedPeople = people.sort((a, b) => new Date(b.Date) - new Date(a.Date));
      break;
    case '2': // Focus on the youngest debtors
      sortedPeople = people.sort((a, b) => a.Age - b.Age);
      break;
    case '3': // Focus on the oldest debtors
      sortedPeople = people.sort((a, b) => b.Age - a.Age);
      break;
    default:
      sortedPeople = people;
      break;
  }
  return sortedPeople;
}

async function sendMessages(people) {
  for (const person of people) {
    let messageData = {};
    const process = await Process.find({ file: person.file }).exec();
    const company = process.cname;
    const discount = parseInt(person.Discount) - parseInt(person.Messages) * 5;
    const messageContent = `Dear ${person.Name}, This is your ${parseInt(person.Messages) + 1} notice of debt you have to ${person.Company} of ${person.Debt} ILS.`;
    const paymentData = {
      name: person.Name,
      phone: person.Phone,
      mail: person.Mail,
      debt: person.Debt,
      age: person.Age,
      city: person.City,
      cname: company,
      discount: person.Discount,
      via: '',
    };
    const queryString = new URLSearchParams(paymentData).toString();
    const paymentUrl = `http://localhost:3000/payment?${queryString}`;
    console.log('Payment URL:', paymentUrl);
    if (person.Messages === '0') {
      messageData = {
        name: person.Name,
        message: `${messageContent} For a limited time, you have the option to get a ${person.Discount}% discount! You can choose your payment plan to arrange your debt in the best way for you. If you have any questions, please contact ${person.Company}. Note that if you do not pay your debt, the company will take legal action against you. Click here to arrange your debt`,
        email: person.Mail,
        phone: person.Phone,
        company: person.Company,
        link: paymentUrl
      };
    } else if (person.Messages === '1') {
      messageData = {
        name: person.Name,
        message: `${messageContent} For a limited time, you have the option to get a ${discount}% discount! You can choose your payment plan to arrange your debt in the best way for you. If you have any questions, please contact ${person.Company}. Note that if you do not pay your debt, the company will take legal action against you. Click here to arrange your debt`,
        email: person.Mail,
        phone: person.Phone,
        company: person.Company,
        link: paymentUrl
      };
    } else if (person.Messages === '2') {
      if (discount <= 0) {
        messageData = {
          name: person.Name,
          message: `${messageContent} You can choose your payment plan to arrange your debt in the best way for you. If you have any questions, please contact ${person.Company}. Note that if you do not pay your debt, the company will take legal action against you. Click here to arrange your debt `,
          email: person.Mail,
          phone: person.Phone,
          company: person.Company,
          link: paymentUrl
        };
      } else {
        messageData = {
          name: person.Name,
          message: `${messageContent} For a limited time, you have the option to get a ${discount}% discount! You can choose your payment plan to arrange your debt in the best way for you. If you have any questions, please contact ${person.Company}. Note that if you do not pay your debt, the company will take legal action against you. Click here to arrange your debt`,
          email: person.Mail,
          phone: person.Phone,
          company: person.Company,
          link: paymentUrl
        };
      }
    }

    person.Messages = (parseInt(person.Messages) + 1).toString();
    await person.save();
    if (person.Communication.email && person.Mail) {
      paymentData.via = 'email';
      await sendEmail(messageData);
    }
    if (person.Communication.whatsapp && person.Phone) {
      console.log('Sending message to:', person.Name);
      console.log('Data:',messageData );
      //paymentData.via = 'whatsapp';
      // await sendTelegramMessage(messageData.message); 
    }
  }
}

async function processCommunications(process) {
  const people = await People.find({ file: process.file }).exec();
  const sortedPeople = await applyStrategy(people, process.strategy);

  // Split people into top 10% and the rest
  const top10PercentCount = Math.ceil(sortedPeople.length * 0.1);
  const top10Percent = sortedPeople.slice(0, top10PercentCount);
  const rest = sortedPeople.slice(top10PercentCount);
  console.log(top10Percent);
  // Schedule sending messages to the top 10% every 2 minutes
   cron.schedule('*/2 * * * *', async () => {
     console.log(`Sending messages to top 10% for strategy ${process.strategy}`);
     await sendMessages(top10Percent);
   });

  // Schedule sending messages to the rest every 10 minutes
   cron.schedule('*/10 * * * *', async () => {
     console.log(`Sending messages to the rest for strategy ${process.strategy}`);
     await sendMessages(rest);
   });
}

async function sendCommunications() {
  try {
    const processes = await Process.find({ status: 'opened' });

    // Map each process to a call to processCommunications and collect promises
    const communicationPromises = processes.map(process => processCommunications(process));

    // Wait for all promises to resolve simultaneously
    await Promise.all(communicationPromises);
  } catch (error) {
    console.error('Error fetching people:', error);
  }
}


function startScheduler() {
  cron.schedule('* * * * *', async () => {
    await sendCommunications();
  });
}

module.exports = { startScheduler };
