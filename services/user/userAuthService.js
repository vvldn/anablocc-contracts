const config = require('../../config/config');
const userModel = require('../../models/userModel');

const checkAndSignUpUser = async (model) => {
    console.log(`Creating new user: ${JSON.stringify(model)}`);
    const { email, phone, aadhar } = model;
    const existingUser = await userModel.findOne({ $or: [{email}, {phone}, {aadhar}] }).lean();
    if(existingUser){
        return { success: false, error: 'user exists with these details' };
    }
    const response = await userModel.create(model)
        .then(newUser => ({ success: true, data: newUser }))
        .catch(err => {
            throw new Error(`User creation failed. Err: ${JSON.stringify(err)}`)
        });

    return response;
}

const checkForUserWithPhoneAndSetOTP = async (phone) => {
    const user = await userModel.find({ phone }).lean();
    if(!user){
        return { success: false };
    }

    await userModel.findOneAndUpdate({ phone }, { $set: { otp: config.testOtp } });

    return { success: true, otp: config.testOtp };
}

const checkAndLoginUser = async (otp) => {
    const user = await userModel.findOneAndUpdate({ otp }, { $unset: { otp: 1 } }, { new: true }).lean();
    if(!user){
        return { success: false, error: 'Invalid OTP' };
    }

    return { success: true, data: user };
}

const setAddressForUser = async (walletAddress, userId) => {
    const user = await userModel.findById(userId);
    if (user.walletAddress) return;
    await userModel.findByIdAndUpdate(userId, { $set: { walletAddress } });
}

const getUserDetailsByAadhar = async (aadhar) => {
    const user = await userModel.findOne({ aadhar }).lean();
    if(!user){
        return { success: false, error: 'User not found' };
    }
    return { success: true, data: user };;
}

const getUserDetails = async (userId) => {
    const user = await userModel.findById(userId).lean();
    if(!user){
        return { success: false, error: 'User not found' };
    }
    return { success: true, data: user };;
}

module.exports = {
    checkAndSignUpUser,
    checkForUserWithPhoneAndSetOTP,
    checkAndLoginUser,
    setAddressForUser,
    getUserDetailsByAadhar,
    getUserDetails,
}