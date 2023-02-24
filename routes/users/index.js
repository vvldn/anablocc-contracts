const router = require('express').Router();
const config = require('../../config/config');
const jwt = require('jsonwebtoken');

const userModel = require('../../models/userModel');

router.post('/signup', async (req, res, next) => {
    try {
        const { name, email, phone, aadhar } = req.body;
        if(!name || !email || !phone || !aadhar){
            res.status(403).json({ success: false, error: 'Missing params. name, email, phone and aadhar are required fields' });
        }

        console.log(`Creating new user: ${JSON.stringify(req.body)}`);
        const newUser = await userModel.create({ name, email, phone, aadhar }, { runValidators: true });

        return res.status(200).json({ success: true, data: newUser });
    } catch (err) {
        return next(err);
    }
});

router.post('/login/verify-otp', async (req, res, next) => {
    try {
        const { phone, otp } = req.body;
        if(otp === config.testOtp){
            const user = userModel.findOne({ phone }).lean();
            if(user){
                const token = jwt.sign({ id: user._id }, config.jwt.userSecret);
                return res.status(200).json({ success: true, token: token });
            } else {
                return res.status(404).json({ success: false, error: 'user not found.' });
            }
        } else {
            return res.status(401).json({ success: false, error: 'Invalid OTP' });
        }
    } catch (err) {
        return next(err);
    }
});

module.exports = router;