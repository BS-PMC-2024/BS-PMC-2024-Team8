// const CryptoJS = require("crypto-js");

// const secretKey = "vlsProduct#2024";

// const encrypt = (text) => {
//   return CryptoJS.AES.encrypt(text, secretKey).toString();
// };

// const decrypt = (cipherText) => {
//   const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
//   return bytes.toString(CryptoJS.enc.Utf8);
// };

// module.exports = { encrypt, decrypt };

const bcrypt = require("bcrypt");

const saltRounds = 10; // Number of salt rounds for hashing

// Hash the text (typically the password)
const encrypt = async (text) => {
  try {
    const hashedText = await bcrypt.hash(text, saltRounds);
    return hashedText;
  } catch (error) {
    throw new Error("Error hashing the password");
  }
};

// Compare a plaintext password with a hashed password
const decrypt = async (plainText, hashedText) => {
  try {
    const match = await bcrypt.compare(plainText, hashedText);
    return match;
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

module.exports = { encrypt, decrypt };
