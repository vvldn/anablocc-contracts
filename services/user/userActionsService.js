const config = require('../../config/config');
const userModel = require('../../models/userModel');
const actionModel = require('../../models/actionModel');
const propertyModel = require('../../models/propertyModel');

const { ownershipStatusEnum, documentsStatusEnum, propertyStateEnum } = require('../../enums');

const initiatePropertySaleAction = async (model) => {
    const { sellerId, buyerId, propertyId } = model;
    if(!sellerId) return { success: false, error: 'sellerId is required' };
    if(!buyerId) return { success: false, error: 'buyerId is required' };
    if(!propertyId) return { success: false, error: 'propertyId is required' };

    const newAction  = await actionModel.create({ sellerId, buyerId, propertyId });
    await propertyModel.findByIdAndUpdate(propertyId, { $set: { state: propertyStateEnum.SALE_IN_PROGRESS } });

    return { success: true, data: newAction };
}

const getUserActionsListDto = (actions) => {
    return actions;
}

const getUserActions = async (userId) => {
    if(!userId) return { success: false, error: 'userId is required' };
    const user = await userModel.findById(userId).lean();
    if(!user){
        return { success: false, error: 'User not found' };
    }
    const actions = await actionModel.find({ $or: [ { sellerId: userId }, { buyerId: userId } ] }).populate('sellerId buyerId propertyId')

    const userActionsListDto = getUserActionsListDto(actions)

    return { success: true, data: userActionsListDto }
}

const getActionDto = (action) => {
    return action;
}

const updateActionToSaleAccepted = async (actionId) => {
    const action = await actionModel.findById(actionId).populate('buyerId sellerId propertyId');
    if(!action){
        return { success: false, error: 'action not found' };
    }

    const updatedAction = await actionModel.findByIdAndUpdate(actionId,
        { $set: { status: ownershipStatusEnum.SALE_ACCEPTED } },
        { new: true },
    );
    
    const actionDto = getActionDto(updatedAction);

    return { success: true, data: actionDto };
}

module.exports = {
    initiatePropertySaleAction,
    getUserActions,
    updateActionToSaleAccepted,
}