const router = require('express').Router();

const adminController = require('../../controllers/adminController');

router.post('/login', adminController.adminLogin);

router.post('/logout', adminController.adminLogout);

router.post('/properties', adminController.getAllProperties);

router.post('/actions', adminController.getAllActions);

module.exports = router;