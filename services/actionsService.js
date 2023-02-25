const _ = require('underscore');
const { ownershipStatusEnum, documentsStatusEnum } = require('../enums');
const ownershipModel = require('../models/ownershipModel');

const initiateSale = async (ownershipId, data) => {
    const { userId: ownerId, buyerId, transactionHash } = data;
    
    const updatedOwnership = await ownershipModel.findOneAndUpdate(
        { ownerId, ownershipId },
        { $set: { 
            buyerId, 
            status: ownershipStatusEnum.SALE_INITIATED,
            transactions: [{ hash: transactionHash, status: ownershipStatusEnum.SALE_INITIATED }]
        } },
        { new: true }
    ).lean();

    return { success: true, data: updatedOwnership };
}

const acceptSale = async (ownershipId, data) => {
    const { userId: buyerId, transactionHash } = data;
    
    const updatedOwnership = await ownershipModel.findOneAndUpdate(
        { buyerId, ownershipId },
        { $set: {
            status: ownershipStatusEnum.SALE_ACCEPTED,
            transactions: {
                $addToSet: { hash: transactionHash, status: ownershipStatusEnum.SALE_ACCEPTED }
            }
        } },
        { new: true }
    ).lean();

    return { success: true, data: updatedOwnership };
}

const uploadDocuments = async (ownershipId, data) => {
    const { userId: buyerId, transactionHash, documents } = data;

    // const documentsArr = _.map(documents, doc => ({
    //     ipfsAddress: doc.address,// or `${ifsBaseUrl}/${doc.address}`
    // }))
    
    const updatedOwnership = await ownershipModel.findOneAndUpdate(
        { buyerId, ownershipId },
        { $set: {
            documents,
            status: ownershipStatusEnum.DOC_UPLOADED,
            transactions: {
                $addToSet: { hash: transactionHash, status: ownershipStatusEnum.DOC_UPLOADED }
            }
        } },
        { new: true }
    ).lean();

    return { success: true, data: updatedOwnership };
}

const rejectDocuments = async (ownershipId, data) => {
    const { transactionHash } = data;

    const updatedOwnership = await ownershipModel.findOneAndUpdate(
        { ownershipId, status: ownershipStatusEnum.DOC_UPLOADED },
        { 
            $set: { status: ownershipStatusEnum.SALE_ACCEPTED }, 
            $unset: { documents: 1 } 
        }, { new: true }
    ).lean();

    return { success: true, data: updatedOwnership };
}

const approveDocuments = async (ownershipId, data) => {
    const { transactionHash } = data;
    const { _id, documents } = await ownershipModel.findOne({ ownershipId, status: ownershipStatusEnum.DOC_UPLOADED });

    const documentsArr = _.map(documents, doc => ({
        ipfsAddress: doc.ipfsAddress,
        status: documentsStatusEnum.VERIFIED,
    }))
    
    const updatedOwnership = await ownershipModel.findByIdAndUpdate(
        _id,
        { $set: {
            documents: documentsArr,
            status: ownershipStatusEnum.DOC_APPROVED,
            transactions: {
                $addToSet: { hash: transactionHash, status: ownershipStatusEnum.DOC_APPROVED }
            }
        } },
        { new: true }
    ).lean();

    return { success: true, data: updatedOwnership };
}

const initiatePayment = async (ownershipId, data) => {
    const { userId: buyerId, transactionHash } = data;
    
    const updatedOwnership = await ownershipModel.findOneAndUpdate(
        { buyerId, ownershipId },
        { $set: {
            status: ownershipStatusEnum.TX_INITIATED,
            transactions: {
                $addToSet: { hash: transactionHash, status: ownershipStatusEnum.TX_INITIATED }
            }
        } },
        { new: true }
    ).lean();

    return { success: true, data: updatedOwnership };
}

const acknowledgePayment = async (ownershipId, data) => {
    const { userId: ownerId, transactionHash } = data;
    
    const updatedOwnership = await ownershipModel.findOneAndUpdate(
        { ownerId, ownershipId },
        { $set: {
            status: ownershipStatusEnum.TX_ACKNOWLEDGED,
            transactions: {
                $addToSet: { hash: transactionHash, status: ownershipStatusEnum.TX_ACKNOWLEDGED }
            }
        } },
        { new: true }
    ).lean();

    return { success: true, data: updatedOwnership };
}

const closeSale = async (ownershipId, data) => {
    const { transactionHash, newOwnershipId } = data;
    
    const updatedOwnership = await ownershipModel.findOneAndUpdate(
        { ownershipId, status: ownershipStatusEnum.TX_ACKNOWLEDGED },
        { $set: {
            status: ownershipStatusEnum.CLOSED,
            transactions: {
                $addToSet: { hash: transactionHash, status: ownershipStatusEnum.CLOSED }
            }
        } },
        { new: true }
    ).lean();

    const newOwnership = await ownershipModel.create({
        ownershipId: newOwnershipId,
        ownerId: updatedOwnership.buyerId,
        lastOwnerId: updatedOwnership.ownerId,
        property: updatedOwnership.property,
        status: ownershipStatusEnum.BASE,
    });

    return { success: true, data: newOwnership };
}

const cancelSale = async (ownershipId, data) => {
    const { transactionHash } = data;

    const updatedOwnership = await ownershipModel.findOneAndUpdate(
        { ownershipId },
        { 
            $set: { status: ownershipStatusEnum.BASE }, 
            $unset: { documents: 1, transactions: 1, buyerId: 1 } 
        }, { new: true }
    ).lean();

    return { success: true, data: updatedOwnership };
}

module.exports = {
    initiateSale,
    acceptSale,
    uploadDocuments,
    rejectDocuments,
    approveDocuments,
    initiatePayment,
    acknowledgePayment,
    closeSale,
    cancelSale,
}