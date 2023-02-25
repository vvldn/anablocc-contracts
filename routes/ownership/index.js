const router = require('express').Router();

const ownershipController = require('./../../controllers/ownershipController');

router.get('/:ownershipId', ownershipController.getOwnershipDetails);

router.post('/:ownershipId/action/:action', ownershipController.registerTransaction);

module.exports = router;