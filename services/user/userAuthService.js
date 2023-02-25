const config = require('../../config/config');
const userModel = require('../../models/userModel');

const checkAndSignUpUser = async ({ name, email, phone, aadhar }) => {
    console.log(`Creating new user: ${JSON.stringify(req.body)}`);
        const newUser = await userModel.create({ name, email, phone, aadhar }, { runValidators: true });
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

module.exports = {
    checkAndSignUpUser,
    checkForUserWithPhoneAndSetOTP,
    checkAndLoginUser,
}