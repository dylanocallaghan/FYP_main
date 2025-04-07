// server/controllers/applicationController.js
const Application = require("../models/Application");
const Listing = require("../models/Listing");


// Create a new application
const createApplication = async (req, res) => {
  try {
    const { listingId, groupId, applicantId, message } = req.body;

    if (!listingId) {
      return res.status(400).json({ error: "Listing ID is required." });
    }

    if (!groupId && !applicantId) {
      return res.status(400).json({ error: "Either groupId or applicantId must be provided." });
    }

    const newApplication = new Application({
      listingId,
      groupId: groupId || undefined,
      applicantId: applicantId || undefined,
      message,
      status: "pending"
    });

    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ error: "Server error while creating application." });
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

  const getApplicationsForLandlord = async (req, res) => {
    try {
      const landlordEmail = req.user.email;

        console.log("LANDLORD EMAIL:", landlordEmail);

        const listings = await Listing.find({ landlordEmail });
        const listingIds = listings.map(listing => listing._id);

        console.log("FOUND LISTINGS:", listingIds);

        const applications = await Application.find({ listingId: { $in: listingIds } })
        .populate("groupId");

        console.log("APPLICATIONS FOUND:", applications);

        res.json(applications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch applications." });
    }
  };

  const deleteApplication = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Application.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: "Application not found" });
      res.json({ message: "Application deleted" });
    } catch (err) {
      console.error("Delete error:", err);
      res.status(500).json({ error: "Failed to delete application" });
    }
  };
  

  module.exports = {
    createApplication,
    getApplicationsByListing,
    updateApplicationStatus,
    getApplicationsForLandlord,
    deleteApplication
  };