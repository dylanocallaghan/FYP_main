const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');


const {
  createApplication,
  getApplicationsByListing,
  updateApplicationStatus,
  getApplicationsForLandlord,
  deleteApplication,
  getApprovedApplicationsByOwner, 
  getApprovedApplicationByListing,
} = require("../controllers/applicationController");



router.post('/', verifyToken, createApplication);
router.get('/listing/:id', verifyToken, getApplicationsByListing);
router.patch('/:id/status', verifyToken, updateApplicationStatus);
router.get('/landlord', verifyToken, getApplicationsForLandlord); 
router.delete('/:id', verifyToken, deleteApplication);
router.get("/approved/by-owner", verifyToken, getApprovedApplicationsByOwner);
router.get("/approved-apps", verifyToken, getApprovedApplicationsByOwner);
router.get("/approved/listing/:id", verifyToken, getApprovedApplicationByListing);


module.exports = router;
