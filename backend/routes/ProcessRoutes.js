const express = require('express');
const Process = require('../models/Process');
const router = express.Router();

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
  
  module.exports = router;