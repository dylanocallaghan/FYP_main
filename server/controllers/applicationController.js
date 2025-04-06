// server/controllers/applicationController.js
const Application = require('../models/Application');

// Create a new application
const createApplication = async (req, res) => {
    try {
      const { groupId, listingId, message } = req.body;
  
      const newApp = new Application({
        groupId,
        listingId,
        message,
        status: 'pending',
      });
  
      await newApp.save();
      res.status(201).json(newApp);
    } catch (error) {
      console.error('Error creating application:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

// Get all applications for a listing
const getApplicationsByListing = async (req, res) => {
    try {
      const listingId = req.params.id;
      const applications = await Application.find({ listingId }).populate('groupId');
      res.json(applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

const updateApplicationStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
  
      const updated = await Application.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ message: 'Application not found' });
      }
  
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating application status' });
    }
  };


  module.exports = {
    createApplication,
    getApplicationsByListing,
    updateApplicationStatus,
  };