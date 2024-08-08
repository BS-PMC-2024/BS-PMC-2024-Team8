const textflow = require("textflow.js");

const sendSMS = async (messageData) => {
    if (messageData.phone[0] !== '+') {
        if (messageData.phone.startsWith('05')) {
            messageData.phone = '+972' + messageData.phone.substring(1);
        } else {
            console.error('Invalid phone number format');
            return;
        }
    }
    
    const apiKey = "UDonJFVVylovUuGB1yG5ECUIQecvka2PZlPkEzAxv1X3GcUpiiPrXYm2rsGqcvhN";
    textflow.useKey(apiKey);
    console.log(messageData.phone, messageData.message);
    textflow.sendSMS(messageData.phone, messageData.message);
    console.log('SMS sent to:', messageData.name);
}

module.exports = sendSMS;
