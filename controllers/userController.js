const jwt = require('jsonwebtoken');
const config = require('../config/config');

const userAuthService = require('../services/user/userAuthService');
const userActionsService = require('../services/user/userActionsService');
const userPropertiesService = require('../services/user/userPropertiesService');

const userSignUp = async (req, res, next) => {
    try {
        const { name, email, phone, aadhar } = req.body;
        if(!name || !email || !phone || !aadhar){
            res.status(403).json({ success: false, error: 'Missing params. name, email, phone and aadhar are required fields' });
        }

        const response = userAuthService.checkAndSignUpUser({ name, email, phone, aadhar });
        if(!response.success){

        }

        return res.status(200).json({ success: true, data: newUser });
    } catch (err) {
        console.error(err)
        return res.status(500);
    }
}

const checkAndSendOtp = async (req, res, next) => {
    try {
        const { phone } = req.body;
        if(!phone) return res.status(400).json({ success: false, error: 'Phone required' });
        
        const response = await userAuthService.checkForUserWithPhoneAndSetOTP(phone);
        if(!response.success){
            return res.status(404).json({ success: false, error: 'User with this phone not found' });
        }

        return res.status(200).json(response);
    } catch (err) {
        return next(err);
    }
}

const verifyOtpAndLogin = async (req, res, next) => {
    try {
        const { otp } = req.body;

        const response = await userAuthService.checkAndLoginUser(otp);
        if(!response.success){
            return res.status(401).send(response);
        }

        const token = jwt.sign({ id: response.data._id }, config.jwt.userSecret);
        if (token) res.cookie('token', token, { httpOnly: true });
        
        return res.status(200).json({ success: true, data: { token, user: response.data } });
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

const userLogout = (req, res, next) => {
    try {
        res.cookie('token', null, {  httpOnly: true });
        return res.status(200).send({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

const getAllPropertiesForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const response = await userPropertiesService.getAllUserProperties(userId);
        if(!response.success){
            return res.status(400).json({ response })
        }

        return res.status(200).json(response)
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

const getPropertyDetails = async (req, res, next) => {
    try {
        const { propertyId } = req.params;
        const userId = req.user.id;
        const response = await userPropertiesService.getPropertyDetails(userId, propertyId);
        if(!response.success){
            return res.status(400).json(response);
        }

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

const initiatePropertySale = async (req, res, next) => {
    try {
        const { propertyId, buyerAadhar, buyerName, buyerDob } = req.body;
        const userId = req.user.id;
        const response = await userPropertiesService.checkAndInitiatePropertySale({
            userId, propertyId, buyerName, buyerDob, buyerAadhar
        });
        if(!response.success){
            return res.status(400).json(response);
        }

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

const getAllActionsForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const response = await userActionsService.getUserActions(userId);
        if(!response.success){
            return res.status(400).json(response);
        }

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

module.exports = {
    userSignUp,
    checkAndSendOtp,
    verifyOtpAndLogin,
    userLogout,
    getAllPropertiesForUser,
    getPropertyDetails,
    initiatePropertySale,
    getAllActionsForUser,
}