const _ = require('underscore');
const hre = require("hardhat");
const config = require('../config/config');
const { ownershipStatusEnum } = require('../enums');
const actionsService = require('./actionsService');
const ownershipModel = require('../models/ownershipModel');

const getOwnershipDetails = async (ownershipId) => {
    const ownership = await ownershipModel.findOne({ ownershipId }).lean();
    return ownership;
}

const getPropertyListDto = (ownerships) => {
    const propertyList = _.map(ownerships, ownership => {
        const { ownerId: owner, buyerId: buyer, status, ownershipId, property } = ownership;
        return { owner, buyer, ...property, ownershipId, status };
    });

    return propertyList;
}

const getAllPropertiesForAdmin = async (status) => {
    if(!status) status = ownershipStatusEnum.SALE_INITIATED;

    const ownerships = await ownershipModel.find({ status }).populate('ownerId buyerId');

    const propertyList = getPropertyListDto(ownerships);

    return { success: true, data: propertyList };
}

const getActionsListDto = (ownerships) => {
    const actionList = _.map(ownerships, ownership => {
        const { ownerId: owner, buyerId: buyer, status, ownershipId, documents } = ownership;
        return { owner, buyer, status, ownershipId, documents }
    });

    return actionList;
}

const getAllActionsForAdmin = async (status) => {
    if(!status) status = ownershipStatusEnum.SALE_INITIATED;

    const ownerships = await ownershipModel.find({ status }).populate('ownerId buyerId');

    const actionList = getActionsListDto(ownerships);

    return { success: true, data: actionList };
}

const getOwnershipHistoryDto = (historyFromChain) => {
    const history = _.map(historyFromChain, ownership => {
        const { owner, buyer, ownershipId, transactions, amount } = ownership;
        const soldTx = _.find(transactions, tx => tx.status === ownershipStatusEnum.CLOSED);
        let buyerName = '';
        let ownerName = '';
        if (owner) ownerName = owner.name;
        if (buyer) buyerName = buyer.name;
        let link = '';
        if (soldTx) link = `https://mumbai.polygonscan.com/tx/${soldTx.hash}`;
        return { owner: ownerName, buyer: buyerName, ownershipId, amount, link }
    });

    return history;
}

// TODO: discuss the findQuery for this
const getOwnershipHistoryForProperty = async (ownershipId) => {
    if(!ownershipId) return { success: false, error: 'ownershipId is required' };

    const ownership = await ownershipModel.findOne({ ownershipId }).lean();
    const pixelHash = ownership.property.pixels[0].hash;
    const ownerships = await ownershipModel.aggregate([
        { $addFields: { pixels: '$property.pixels' } },
        { $unwind: { path: '$pixels' } },
        { $match: { 'pixels.hash': pixelHash } },
        { $lookup: { from: 'users', localField: 'ownerId', foreignField: '_id', as: 'owner' } },
        { $lookup: { from: 'users', localField: 'buyerId', foreignField: '_id', as: 'buyer' } }

    ]);
    const ownershipHistory = getOwnershipHistoryDto(ownerships);

    return { success: true, data: ownershipHistory };
}

const getPropertyListForUserDto = (ownerships) => {
    const propertyList = _.map(ownerships, ownership => {
        const { ownerId: owner, ownershipId, property } = ownership;
        return { owner, ...property, ownershipId };
    });

    return propertyList;
}

const getPropertyListForUser = async (userId) => {
    if(!userId) return { success: false, error: 'userId is required' };

    const ownerships = await ownershipModel.find({ ownerId: userId, status: { $ne: ownershipStatusEnum.CLOSED } }).populate('ownerId');

    const propertyList = getPropertyListForUserDto(ownerships);

    return { success: true, data: propertyList };
}

const getUserActions = async (userId) => {
    if(!userId) return { success: false, error: 'userId is required' };

    const ownerships = await ownershipModel.find({ $or: [ { ownerId: userId }, { buyerId: userId } ] }).populate('ownerId buyerId');

    const actionList = getActionsListDto(ownerships);

    return { success: true, data: actionList };
}

const getPropertyDetailsDto = (ownership) => {
    const { ownerId: owner, ownershipId, property } = ownership;
    return { owner, property, ownershipId, ...property };
}

const getPropertyDetails = async (userId, ownershipId) => {
    if(!ownershipId) return { success: false, error: 'ownershipId is required' };

    const ownership = await ownershipModel.findOne({ ownerId: userId, ownershipId, status: { $ne: ownershipStatusEnum.CLOSED } }).populate('ownerId');

    const propertyDto = getPropertyDetailsDto(ownership);

    return { success: true, data: propertyDto };
}

const checkAndRegisterTransaction = async (ownershipId, action, data) => {
    let response;
    switch (action) {
        case ownershipStatusEnum.SALE_INITIATED:
            response = await actionsService.initiateSale(ownershipId, data);
            break;
        case ownershipStatusEnum.SALE_ACCEPTED:
            response = await actionsService.acceptSale(ownershipId, data);
            break;
        case ownershipStatusEnum.DOC_UPLOADED:
            response = await actionsService.uploadDocuments(ownershipId, data);
            break;
        case 'DOC_REJECT':
            response = await actionsService.rejectDocuments(ownershipId, data);
            break;
        case ownershipStatusEnum.DOC_APPROVED:
            response = await actionsService.approveDocuments(ownershipId, data);
            break;
        case ownershipStatusEnum.TX_INITIATED:
            response = await actionsService.initiatePayment(ownershipId, data);
            break;
        case ownershipStatusEnum.TX_ACKNOWLEDGED:
            response = await actionsService.acknowledgePayment(ownershipId, data);
            break;
        case ownershipStatusEnum.CLOSED:
            response = await actionsService.closeSale(ownershipId, data);
            break;
        case 'CANCEL_SALE':
            response = await actionsService.cancelSale(ownershipId, data);
            break;
        default:
            response = { success: false, error: 'Invalid Action' }
            break;
    }

    return response;
}

module.exports = {
    getOwnershipDetails,
    getAllPropertiesForAdmin,
    getAllActionsForAdmin,
    getOwnershipHistoryForProperty,
    getPropertyListForUser,
    getUserActions,
    getPropertyDetails,
    checkAndRegisterTransaction,
}