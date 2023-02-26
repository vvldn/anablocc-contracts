const router = require('express').Router();

const adminController = require('../../controllers/adminController');

router.post('/login', adminController.adminLogin);

router.post('/logout', adminController.adminLogout);

router.get('/properties', adminController.getAllProperties);

router.get('/actions', adminController.getAllActions);

// router.post('/add-property', adminController.addPropertyFromAdmin);

module.exports = router;