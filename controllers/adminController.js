const jwt = require('jsonwebtoken');
const config = require('../config/config');

const adminAuthService = require('../services/admin/adminAuthService');
const adminPropertiesService = require('../services/admin/adminPropertiesService');
const adminActionService = require('../services/admin/adminActionsService');

const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const response = adminAuthService.checkAndLoginAdmin(email, password);
        if(!response.success){
            return res.status(401).send({ success: false });
        }

        const token = jwt.sign({ email: email }, config.jwt.adminSecret);
        if (token) res.cookie('token', token, { httpOnly: true });
        
        return res.status(200).json({ success: true, token: token });
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

const adminLogout = (req, res, next) => {
    try {
        res.cookie('token', null, {  httpOnly: true });
        return res.status(200).send({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

const getAllProperties = async (req, res, next) => {
    try {
        const response = await adminActionService.getAllActionsForAdmin(state);

        return res.status(200).json({ actions: response.data })
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

const getAllActions = async (req, res, next) => {
    try {
        const { state } = req.body;

        const response = await adminActionService.getAllActionsForAdmin(state);

        return res.status(200).json({ actions: response.data })
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

module.exports = {
    adminLogin,
    adminLogout,
    getAllProperties,
    getAllActions,
}