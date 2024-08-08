const People = require('../models/People');
const XLSX = require('xlsx');

const expectedHeaders = ['Name', 'Debt', 'Age', 'City', 'Mail', 'Phone', 'Date'];

function isValidHeader(headers) {
  if (headers.length !== expectedHeaders.length) {
    return false;
  }
  for (let i = 0; i < headers.length; i++) {
    if (headers[i] !== expectedHeaders[i]) {
      return false;
    }
  }
  return true;
}

function isValidRow(row) {
  if (typeof row['Name'] !== 'string' || row['Name'].trim() === '') {
    console.log('Name');
    return false;
  }
  if (typeof row['Age'] !== 'number' || row['Age'] <= 0) {
    console.log('Age'); 
    return false;
  }
  if (typeof row['City'] !== 'string' || row['City'].trim() === '') {
    console.log('City');  
    return false;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof row['Mail'] !== 'string' || !emailPattern.test(row['Mail'])) {
    console.log('Mail');
    return false;
  }
  if (typeof row['Phone'] !== 'string' || row['Phone'].length !== 10 ||!row['Phone'].startsWith('05')) {
    console.log('Phone');
    return false;
  }
  if (typeof row['Date'] !== 'string' || new Date(row['Date']).toString() === 'Invalid Date') {
    console.log('Date');
    return false;
  }
  return true;
}

async function checkForDuplicates(row) {
  const existingPerson = await People.findOne({ 
    Name: row['Name'], 
    Mail: row['Mail'], 
    Phone: row['Phone']
  }).exec();
  return existingPerson !== null;
}

async function validateXlsx(fileBuffer) {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const headers = data[0];
  if (!isValidHeader(headers)) {
    return { valid: false, message: 'Invalid headers' };
  }

  const rows = XLSX.utils.sheet_to_json(sheet);
  for (const row of rows) {
    if (!isValidRow(row)) {
      return { valid: false, message: 'Invalid row data', row };
    }
    const isDuplicate = await checkForDuplicates(row);
    if (isDuplicate) {
      return { valid: false, message: 'Duplicate entry found', row };
    }
  }

  return { valid: true, message: 'File is valid' };
}

module.exports = validateXlsx;
