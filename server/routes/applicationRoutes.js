const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  createApplication,
  getApplicationsByListing,
  updateApplicationStatus
} = require('../controllers/applicationController');
router.patch('/:id/status', verifyToken, updateApplicationStatus); 


router.post('/', verifyToken, createApplication);
router.get('/listing/:id', verifyToken, getApplicationsByListing);

module.exports = router;
