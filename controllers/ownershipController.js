const ownershipService = require('./../services/ownership/ownershipService');

const getOwnershipDetails = async (req, res, next) => {
    try {
        const ownership = await ownershipService.getOwnershipDetails(req.params.ownershipId);
        return res.status(200).send({ ownership });
    } catch(err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
    }
}

module.exports = {
    getOwnershipDetails,
};
