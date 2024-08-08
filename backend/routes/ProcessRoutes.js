const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const Process = require('../models/Process');
const People = require('../models/People');
const validateXlsx = require('../scripts/valid');
const XLSX = require('xlsx');
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/allprocesses', async (req, res) => {
    try {
      const processes = await Process.find();
      res.status(200).json({ success: true, processes });
    } catch (error) {
      console.error('Error fetching processes:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
  );

router.get('/allprocesses/:company', async (req, res) => {
    try {
      const processes = await Process.find();
      filteredProcesses = processes.filter(process => process.cname === req.params.company);
      res.status(200).json({ success: true, filteredProcesses });
    } catch (error) {
      console.error('Error fetching processes:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  router.delete("/deleteprocess/:id", async (req, res) => {
    try {
      const processId = req.params.id;
  
      const result = await Process.findOneAndDelete({ _id: processId });
      if (result) {
        res.status(200).json({ message: "Process deleted successfully" });
      } else {
        res.status(404).json({ message: "Process not found" });
      }
    } catch (error) {
      console.error("Error deleting process:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  });
  
  router.put("/Proceses/:_id", async (req, res) => {
    const _id = req.params._id;
    const updatedData = req.body;
  
    try {
      const updatedProcess = await Process.findByIdAndUpdate(_id, updatedData, { new: true });
      if (!updatedProcess) {
        return res.status(404).json({ success: false, message: "Process not found" });
      }
      res.status(200).json({ success: true, process: updatedProcess });
    } catch (error) {
      console.error("Error updating process:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });


  router.post('/addprocess', upload.single('file'), async (req, res) => {
    try {
      const db = mongoose.connection.db;
      const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
      const fileBuffer = req.file.buffer;
  
      const validation = await validateXlsx(fileBuffer);
      if (!validation.valid) {
        return res.status(400).json({ success: false, message: `File validation failed: ${validation.message}` });
      }
  
      const uploadStream = bucket.openUploadStream(req.file.originalname);
      uploadStream.end(fileBuffer);
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      const { discount, communication, strategy, cname, status, moneyC, peopleC, peopleR, date, sector } = req.body;
      const process = new Process({
        cname,
        status,
        file: uploadStream.id.toString(),
        moneyC,
        peopleC,
        peopleR: data.length,
        date,
        discount,
        communication: JSON.parse(communication),
        strategy,
        sector,
      });
  
      await process.save();
  
      const peopleData = data.map(row => ({
        Name: row['Name'],
        Mail: row['Mail'],
        Debt: row['Debt'],
        Age: row['Age'],
        City: row['City'],
        Date: row['Date'],
        Phone: row['Phone'],
        Discount : discount,
        Messages: '0',
        Communication: JSON.parse(communication),
        file: uploadStream.id
      }));
  
      await People.insertMany(peopleData);
  
      res.status(200).send('Process added and file uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ success: false, message: 'File upload failed' });
    }
  });
  module.exports = router;