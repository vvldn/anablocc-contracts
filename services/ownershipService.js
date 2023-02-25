const _ = require('underscore');
const hre = require("hardhat");
const config = require('../config/config');
const { ownershipStatusEnum } = require('../enums');
const actionsService = require('./actionsService');
const ownershipModel = require('../models/ownershipModel');

const getOwnershipHistoryWithPixelHash = async (pixelHash) => {
    const loContractFactory = await hre.ethers.getContractFactory("LandOwnership");
    const loContract = loContractFactory.attach(config.contractAddress);
    const result = await loContract.getPixelHistory(pixelHash);
    return result;
}

const getOwnershipDetails = async (ownershipId) => {
    const ownership = await ownershipModel.findById(ownershipId).lean();
    return ownership;
}

const getPropertyListDto = (ownerships) => {
    const propertyList = _.map(ownerships, ownership => {
        const { ownerId: owner, status, ownershipId, property } = ownership;
        return { owner: owner.name, ...property, ownershipId, status };
    });

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

const getOwnershipHistoryDto = (historyFromChain) => {
    const history = _.map(historyFromChain, ownership => {
        const { ownerId: owner, lastOwnerId: lastOwner, ownershipId, documents, transactions } = ownership;
        return { owner: owner.name, lastOwner: lastOwner.name, ownershipId, documents, transactions }
    });

    return history;
}

// TODO: discuss the findQuery for this
const getOwnershipHistoryForProperty = async (userId, ownershipId) => {
    if(!ownershipId) return { success: false, error: 'ownershipId is required' };

    const findQuery = { ownerId: userId, ownershipId };
    const ownership = await ownershipModel.findOne(findQuery).populate('ownerId lastOwnerId');
    const pixelHash = ownership.property.pixels[0].hash;
    
    const historyFromChain = await getOwnershipHistoryWithPixelHash(pixelHash);
    const ownershipHistory = getOwnershipHistoryDto(historyFromChain.data);

    return { success: true, data: ownershipHistory };
}

const getPropertyListForUserDto = (ownerships) => {
    const propertyList = _.map(ownerships, ownership => {
        const { ownerId: owner, ownershipId, property } = ownership;
        return { owner: owner.name, ...property, ownershipId };
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
    getPropertyDetails,
    checkAndRegisterTransaction,
}