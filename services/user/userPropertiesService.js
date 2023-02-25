const userModel = require('../../models/userModel');
const propertyModel = require('../../models/propertyModel');
const { propertyStateEnum } = require('../../enums');

const userActionsService = require('./userActionsService');

const userPropertyListDto = (properties) => {
    return properties;
}

const propertyDetailsDto = (property) => {
    return property;
}

const getAllUserProperties = async (userId) => {
    const user = userModel.findById(userId).lean();
    if(!user){
        return { success: false, error: 'User not found' };
    }

    const properties = propertyModel.find({ ownerId: userId });

    const propertyList = userPropertyListDto(properties);

    return { success: true, data: propertyList };
}

const getPropertyDetails = async (userId, propertyId) => {
    const user = userModel.findById(userId).lean();
    if(!user){
        return { success: false, error: 'User not found' };
    }

    const property = propertyModel.findOne({ _id: propertyId, ownerId: userId }).lean();
    if(!property){
        return { success: false, error: 'property not found' };
    }

    const propertyDto = propertyDetailsDto(property);

    return { success: true, data: propertyDto };
}

const checkAndInitiatePropertySale = async (model) => {
    const { userId, propertyId, buyerName, buyerDob, buyerAadhar } = model;
    if(!propertyId) return { success: false, error: 'propertyId is required' };
    if(!buyerName) return { success: false, error: 'buyerName is required' };
    if(!buyerDob) return { success: false, error: 'buyerDob is required' };
    if(!buyerAadhar) return { success: false, error: 'buyerAadhar is required' };
    
    const seller = userModel.findById(userId).lean();
    if(!seller){
        return { success: false, error: 'User not found' };
    }

    const buyer = userModel.findOne({ aadhar: buyerAadhar }).lean();
    if(!buyer){
        return { success: false, error: 'No user found for this aadhar number' };
    }
    // phone and dob verification from aadhar service can be implement here as well.

    const property = propertyModel.findOne({ _id: propertyId, ownerId: userId }).lean();
    if(!property){
        return { success: false, error: 'property not found' };
    }
    if(!property.state === propertyStateEnum.BASE){
        return { success: false, error: 'Only properties in BASE state can be SOLD' };
    }

    const response = await userActionsService.initiatePropertySaleAction({ 
        sellerId: seller._id,
        buyerId: buyer._id,
        propertyId: property._id,
     });
     if(!response.success){
        return response;
     }

     const updatedProperty = await propertyModel.findByIdAndUpdate(propertyId, { $set: { state: propertyStateEnum.SALE_IN_PROGRESS } }, { runValidators: true, new: true });

    const propertyDto = propertyDetailsDto(updatedProperty);

    return { success: true, data: propertyDto };
}

module.exports = {
    getAllUserProperties,
    getPropertyDetails,
    checkAndInitiatePropertySale,
}