const People = require('../models/People');
const XLSX = require('xlsx');
const moment = require('moment');

const expectedHeaders = ['Name', 'Debt', 'Age', 'City', 'Mail', 'Phone', 'Date'];

function reorderHeaders(headers) {
  const headerMap = new Map(headers.map((header, index) => [header, index]));
  return expectedHeaders.map(header => headerMap.get(header));
}

function reorderRow(row, order) {
  return order.map(index => row[index]);
}

function isValidHeader(headers) {
  const headerSet = new Set(headers);
  return expectedHeaders.every(header => headerSet.has(header));
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
  if (typeof row['Phone'] !== 'string' || row['Phone'].length !== 10 || !row['Phone'].startsWith('05')) {
    console.log('Phone');
    return false;
  }
  if (!moment(row['Date'], 'DD/MM/YYYY', true).isValid()) {
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

  const headerOrder = reorderHeaders(headers);
  const rows = data.slice(1).map(row => reorderRow(row, headerOrder));

  for (const rowArray of rows) {
    const rowObject = Object.fromEntries(expectedHeaders.map((header, index) => [header, rowArray[index]]));

    if (!isValidRow(rowObject)) {
      return { valid: false, message: 'Invalid row data', row: rowObject };
    }
    
    if (!moment(rowObject['Date'], 'DD/MM/YYYY', true).isValid()) {
      rowObject['Date'] = moment(rowObject['Date']).format('DD/MM/YYYY');
    }
    
    const isDuplicate = await checkForDuplicates(rowObject);
    if (isDuplicate) {
      return { valid: false, message: 'Duplicate entry found', row: rowObject };
    }
  }

  return { valid: true, message: 'File is valid' };
}

module.exports = validateXlsx;
