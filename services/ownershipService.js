const _ = require('underscore');
const { ownershipStatusEnum } = require('../enums');

const userModel = require('../models/userModel');
const ownershipModel = require('../models/ownershipModel');

const getPropertyListDto = (ownerships) => {
    const propertyList = _.map(ownerships, ownership => ownership.property);

    return propertyList;
}

const getAllPropertiesForAdmin = async (status) => {
    if(!status) status = ownershipStatusEnum.SALE_INITIATED;

    const ownerships = await ownershipModel.find({ status }).populate('ownerId');

    const propertyList = getPropertyListDto(ownerships);

    return { success: true, data: propertyList };
}

const getActionsListDto = (ownerships) => {
    const actionList = _.map(ownerships, ownership => {
        const { ownerId: owner, status, ownershipId, documents } = ownership;
        return { owner, status, ownershipId, documents }
    });

    return actionList;
}

const getAllActionsForAdmin = async (status) => {
    if(!status) status = ownershipStatusEnum.SALE_INITIATED;

    const ownerships = await ownershipModel.find({ status }).populate('ownerId');

    const propertyList = getActionsListDto(ownerships);

    return { success: true, data: propertyList };
}

const getOwnershipHistoryDto = (ownerships) => {
    const history = _.map(ownerships, ownership => {
        const { ownerId: owner, lastOwnerId: lastOwner, ownershipId, documents, transactions } = ownership;
        return { owner: owner.name, lastOwner: lastOwner.name, ownershipId, documents, transactions }
    });

    return history;
}

// TODO: discuss the findQuery for this
const getOwnershipHistoryForProperty = async (mapLayout) => {
    if(!mapLayout) return { success: false, error: 'mapLayout is required' };

    const findQuery = { mapLayout };
    const ownerships = await ownershipModel.find(findQuery).populate('ownerId lastOwnerId');

    const ownershipHistory = getOwnershipHistoryDto(ownerships);

    return { success: true, data: ownershipHistory };
}

const getPropertyListForUserDto = (ownerships) => {
    const propertyList = _.map(ownerships, ownership => {
        const { ownerId: owner, ownershipId, property } = ownership;
        return { owner: owner.name, property, ownershipId }
    });

    return propertyList;
}

const getPropertyListForUser = async (userId) => {
    if(!userId) return { success: false, error: 'userId is required' };

    const ownerships = await ownershipModel.find({ ownerId: userId, status: { $ne: ownershipStatusEnum.CLOSED } }).populate('ownerId');

    const propertyList = getPropertyListForUserDto(ownerships);

    return { success: true, data: propertyList };
}

const getPropertyDetailsDto = (ownership) => {
    const { ownerId: owner, ownershipId, property } = ownership;
    return { owner: owner.name, property, ownershipId, ...property };
}

const getPropertyDetails = async (userId, ownershipId) => {
    if(!ownershipId) return { success: false, error: 'ownershipId is required' };

    const ownership = await ownershipModel.findOne({ ownerId: userId, ownershipId, status: { $ne: ownershipStatusEnum.CLOSED } }).populate('ownerId');

    const propertyDto = getPropertyDetailsDto(ownership);

    return { success: true, data: propertyDto };
}

const checkAndInitiatePropertySale = async (model) => {
    const { userId, ownershipId, buyerAadhar, transactionHash } = model;
    
    const ownership = await ownershipModel.findOne({ ownerId: userId, ownershipId, status: ownershipStatusEnum.BASE }).lean();
    if(!ownership) return { success: false, error: 'Invalid request for sale' };

    const buyer = await userModel.findOne({ aadhar: buyerAadhar }).lean();
    if(!buyer) return { success: false, error: 'Buyer with given aadhar no not found' };

    const updatedOwnership = await ownershipModel.findByIdAndUpdate(
        ownership._id,
        { $set: { 
            buyerId: buyer._id, 
            status: ownershipStatusEnum.SALE_INITIATED, 
            transactions: { 
                $addToSet: { hash: transactionHash, status: ownershipStatusEnum.SALE_INITIATED } 
            } 
        } },
        { new: true }
    );

    return { success: true, data: updatedOwnership };
}

module.exports = {
    getAllPropertiesForAdmin,
    getAllActionsForAdmin,
    getOwnershipHistoryForProperty,
    getPropertyListForUser,
    getPropertyDetails,
    checkAndInitiatePropertySale,
}