const Application = require("../models/Application");
const Listing = require("../models/Listing");

// Create a new application
const createApplication = async (req, res) => {
  try {
    const { listingId, groupId, applicantId, message, leaseLength } = req.body;

    if (!listingId) {
      return res.status(400).json({ error: "Listing ID is required." });
    }

    if (!groupId && !applicantId) {
      return res.status(400).json({ error: "Either groupId or applicantId must be provided." });
    }

    if (![3, 6, 9, 12].includes(Number(leaseLength))) {
      return res.status(400).json({ error: "Lease length must be 3, 6, 9, or 12." });
    }

    const newApplication = new Application({
      listingId,
      groupId: groupId || undefined,
      applicantId: applicantId || undefined,
      message,
      leaseLength,
      status: "pending"
    });

    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ error: "Server error while creating application." });
  }
};

// Now populates both groupId AND applicantId
const getApplicationsByListing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const applications = await Application.find({ listingId })
      .populate('groupId')
      .populate('applicantId'); // ✅ Add this

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update application depending on listing owner input
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

// Fetch all applications for Listing owner
const getApplicationsForLandlord = async (req, res) => {
  try {
    const landlordEmail = req.user.email;

    const listings = await Listing.find({ landlordEmail });
    const listingIds = listings.map(listing => listing._id);

    const applications = await Application.find({ listingId: { $in: listingIds } })
      .populate("applicantId")
      .populate({ path: "groupId", populate: { path: "creator", model: "User" } });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch applications." });
  }
};

// Delete applcation function
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

// Aproval applicaton by owner
const getApprovedApplicationsByOwner = async (req, res) => {
  try {
    const landlordEmail = req.user.email;
    const listings = await Listing.find({ landlordEmail });
    const listingIds = listings.map(listing => listing._id);

    const approvedApps = await Application.find({
      status: "approved",
      listingId: { $in: listingIds }
    });

    res.json(approvedApps);
  } catch (err) {
    console.error("Error fetching approved applications:", err);
    res.status(500).json({ error: "Failed to fetch approved applications" });
  }
};

const getApprovedApplicationByListing = async (req, res) => {
  try {
    const listingId = req.params.id;

    const approvedApp = await Application.findOne({
      listingId,
      status: "approved"
    });

    res.json({ isFilled: !!approvedApp });
  } catch (err) {
    console.error("Error checking approved app:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createApplication,
  getApplicationsByListing,
  updateApplicationStatus,
  getApplicationsForLandlord,
  deleteApplication,
  getApprovedApplicationsByOwner,
  getApprovedApplicationByListing
};

