const express = require("express");
const User = require("../models/User");
const router = express.Router();
const People = require('../models/People');
const Process = require('../models/Process');
const { Admin } = require('mongodb');

//validate boy by ajv
//split it to controller
router.get("/allusers", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }});

  router.get('/allusers/Admin', async (req, res) => {
    try {
      const admin = await User.find({premission : 'admin'});
      res.status(200).json({ success: true, admin });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
});
router.get("/clients", async (req, res) => {
  try {
    const processes = await Process.find();
    const clients = await People.find();
    const fileToCompanyMap = {};
    processes.forEach((process) => {
      fileToCompanyMap[process.file] = process.cname;
    });
    const clientsWithCompanies = clients.map((client) => {
      const company = fileToCompanyMap[client.file] || "Unknown Company";
      return { ...client._doc, company };
    });
    res.status(200).json({ success: true, clients: clientsWithCompanies });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.get("/clients/:company", async (req, res) => {
  const company = req.params.company;
  try {
    const processes = await Process.find({ cname: company });
    const files = processes.map((p) => p.file);
    const clients = await People.find({ file: { $in: files } });
    res.status(200).json({ success: true, clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//endpoint to upadte company's client
router.put("/person/:_id", async (req, res) => {
  const _id = req.params._id;
  const updatedData = req.body;

  try {
    const updatedPerson = await People.findByIdAndUpdate(_id, updatedData, {
      new: true,
    });
    if (!updatedPerson) {
      return res
        .status(404)
        .json({ success: false, message: "client not found" });
    }
    res.status(200).json({ success: true, process: updatedPerson });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.delete("/person/:_id", async (req, res) => {
  const _id = req.params._id;

  try {
    const deletedPerson = await People.findByIdAndDelete(_id);
    if (!deletedPerson) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }
    res.status(200).json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
