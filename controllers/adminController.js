const jwt = require('jsonwebtoken');
const config = require('../config/config');

const adminAuthService = require('../services/admin/adminAuthService');
const ownershipService = require('../services/ownershipService');

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
        return res.status(500).send('Something went wrong.Try again later.');
    }
}

const adminLogout = (req, res, next) => {
    try {
        res.cookie('token', null, {  httpOnly: true });
        return res.status(200).send({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
    }
}

const getAllProperties = async (req, res, next) => {
    try {
        const { status } = req.params;
        const response = await ownershipService.getAllPropertiesForAdmin(status);

        return res.status(200).json({ actions: response.data })
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
    }
}

const getAllActions = async (req, res, next) => {
    try {
        const { status } = req.body;

        const response = await ownershipService.getAllActionsForAdmin(status);

        return res.status(200).json({ actions: response.data })
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.Try again later.');
    }
}

// const addPropertyFromAdmin = async (req, res, next) => {
//     try {
//         const model = req.body;

//         const response = await adminPropertiesService.addNewProperty(model);

//         return res.status(200).json(response);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send('Something went wrong.Try again later.');
//     }
// }

module.exports = {
    adminLogin,
    adminLogout,
    getAllProperties,
    getAllActions,
    // addPropertyFromAdmin,
}