const router = require('express').Router();

const ownershipController = require('./../../controllers/ownershipController');

router.get('/:ownershipId', ownershipController.getOwnershipDetails);

router.post('/:ownershipId/ack-txn', ownershipController.acknowledgeTransaction);

module.exports = router;