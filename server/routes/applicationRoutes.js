const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

const {
  createApplication,
  getApplicationsByListing,
  updateApplicationStatus,
  getApplicationsForLandlord,
  deleteApplication
} = require('../controllers/applicationController');


router.post('/', verifyToken, createApplication);
router.get('/listing/:id', verifyToken, getApplicationsByListing);
router.patch('/:id/status', verifyToken, updateApplicationStatus);
router.get('/landlord', verifyToken, getApplicationsForLandlord);
router.delete('/:id', verifyToken, deleteApplication);

module.exports = router;
