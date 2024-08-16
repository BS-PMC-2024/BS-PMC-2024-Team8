const CryptoJS = require("crypto-js");

const secretKey = "vlsProduct#2024";

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };
