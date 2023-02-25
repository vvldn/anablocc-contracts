const ownershipModel = require('./../../models/ownershipModel');

async function getOwnershipDetails(ownershipId) {
    const ownership = await ownershipModel.findById(ownershipId).lean();
    return ownership;
}

module.exports = {
    getOwnershipDetails,
};
