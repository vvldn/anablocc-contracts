const router = require('express').Router();

const ownershipController = require('./../../controllers/ownershipController');

router.get('/:ownershipId', ownershipController.getOwnershipDetails);

module.exports = router;