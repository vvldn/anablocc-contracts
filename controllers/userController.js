const jwt = require('jsonwebtoken');
const config = require('../config/config');

const userAuthService = require('../services/user/userAuthService');
const ownershipService = require('../services/ownershipService');

const userSignUp = async (req, res, next) => {
    try {
        const { name, email, phone, aadhar } = req.body;
        if(!name || !email || !phone || !aadhar){
            res.status(403).json({ success: false, error: 'Missing params. name, email, phone and aadhar are required fields' });
        }

        const response = await userAuthService.checkAndSignUpUser({ name, email, phone, aadhar });
        if(!response.success){
            return res.status(400).json(response);
        }

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
    }
}

const checkAndSendOtp = async (req, res, next) => {
    try {
        const { phone } = req.body;
        if(!phone) return res.status(400).json({ success: false, error: 'Phone required' });

        if(phone === config.adminPhone){
            return res.status(200).json({ success: true, otp: config.testOtp });
        }
        
        const response = await userAuthService.checkForUserWithPhoneAndSetOTP(phone);
        if(!response.success){
            return res.status(404).json(response);
        }

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
    }
}

const verifyOtpAndLogin = async (req, res, next) => {
    try {
        const { phone, otp } = req.body;

        if(phone === config.adminPhone){
            const token = jwt.sign({ role: 'ADMIN' }, config.jwt.adminSecret);
            if (token) res.cookie('token', token, { httpOnly: true });
        
            return res.status(200).json({ success: true, data: { token , role: 'ADMIN' } });
        }

        const response = await userAuthService.checkAndLoginUser(phone, otp);
        if(!response.success){
            return res.status(401).send(response);
        }

        const token = jwt.sign({ id: response.data._id, role: 'USER' }, config.jwt.userSecret);
        if (token) res.cookie('token', token, { httpOnly: true });
        
        return res.status(200).json({ success: true, data: { token, user: response.data, role: 'USER' } });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
    }
}

const userLogout = (req, res, next) => {
    try {
        res.cookie('token', null, {  httpOnly: true });
        return res.status(200).send({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
    }
}

const getAllPropertiesForUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const response = await ownershipService.getPropertyListForUser(userId);
        if(!response.success){
            return res.status(400).json(response)
        }
        return res.status(200).json(response)
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
    }
}

const getPropertyDetails = async (req, res, next) => {
    try {
        const { ownershipId, userId } = req.params;
        const response = await ownershipService.getPropertyDetails(userId, ownershipId);
        if(!response.success){
            return res.status(400).json(response);
        }

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
    }
}

const initiatePropertySale = async (req, res, next) => {
    try {
        const { ownershipId, buyerAadhar, transactionHash } = req.body;
        const { userId } = req.params
        const response = await ownershipService.checkAndInitiatePropertySale({
            userId, ownershipId, buyerAadhar, transactionHash
        });
        if(!response.success){
            return res.status(400).json(response);
        }

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
    }
}

const getAllActionsForUser = async (req, res, next) => {
    try {
        const { userId } = req.params
        const response = await ownershipService.getUserActions(userId);
        if(!response.success){
            return res.status(400).json(response);
        }

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
    }
}

const setWalletForUser = async (req, res, next) => {
    try { 
        const { userId } = req.params
        const walletAddress = req.body.address

        const response = await userAuthService.setAddressForUser(walletAddress, userId);
        
        return res.status(200).send(response);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
    }
}

const getUserDetailsById = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const response = userAuthService.getUserDetails(userId);

        return res.status(200).send(response);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
    }
}

const getUserDetailsByAadhar = async (req, res, next) => {
    try {
        const { aadhar } = req.params;

        const response = userAuthService.getUserDetailsByAadhar(aadhar);

        return res.status(200).send(response);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
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
    setWalletForUser,
    getUserDetailsById,
    getUserDetailsByAadhar
}