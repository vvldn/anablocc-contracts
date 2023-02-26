const ownershipService = require('./../services/ownershipService');

const getOwnershipDetails = async (req, res, next) => {
    try {
        const ownership = await ownershipService.getOwnershipDetails(req.params.ownershipId);
        return res.status(200).send({ ownership });
    } catch(err) {
        console.error(err);
        return res.status(500).send('Something went wrong. Try again later.');
    }
}

const getOwnershipHistory = async (req, res, next) => {
    try {
        const { ownershipId } = req.params;
        const response = await ownershipService.getOwnershipHistoryForProperty(ownershipId);
        return res.status(200).send(response);
    } catch(err) {
        console.error(err);
        return res.status(500).send('Something went wrong. Try again later.');
    }
}

const registerTransaction = async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { ownershipId, action } = req.params;
        const data = { userId, ...req.body};
        const ownership = await ownershipService.checkAndRegisterTransaction(ownershipId, action, data);
        return res.status(200).send({ ownership });
    } catch(err) {
        console.error(err);
        return res.status(500).send('Something went wrong. Try again later.');
    }
}

module.exports = {
    getOwnershipDetails,
    getOwnershipHistory,
    registerTransaction,
};
