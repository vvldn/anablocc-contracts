const userModel = require('../../models/userModel');
const actionModel = require('../../models/actionModel');
const { ownershipStatusEnum } = require('../../enums');

const initiatePropertySaleAction = async (model) => {
    const { sellerId, buyerId, propertyId, transactionHash } = model;
    if(!sellerId) return { success: false, error: 'sellerId is required' };
    if(!buyerId) return { success: false, error: 'buyerId is required' };
    if(!propertyId) return { success: false, error: 'propertyId is required' };
    if(!transactionHash) return { success: false, error: 'transactionHash is required' };
    const transactionModel = { hash:  transactionHash, status: ownershipStatusEnum.SALE_INITIATED };
    const newAction  = actionModel.create({ sellerId, buyerId, propertyId, transactionHashes: [transactionModel] });

    return { success: true, data: newAction };
}

const getUserActionsListDto = (actions) => {
    return actions;
}

const getUserActions = async (userId) => {
    if(!userId) return { success: false, error: 'userId is required' };
    const user = userModel.findById(userId).lean();
    if(!user){
        return { success: false, error: 'User not found' };
    }
    const actions = await actionModel.find({ $or: [ { sellerId: userId }, { buyerId: userId } ] })

    const userActionsListDto = getUserActionsListDto(actions)

    return { success: true, data: userActionsListDto }
}

module.exports = {
    initiatePropertySaleAction,
    getUserActions,
}