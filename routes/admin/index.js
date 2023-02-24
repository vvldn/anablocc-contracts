const router = require('express').Router();
const config = require('../../config/config');

const actionModel = require('../../models/actionModel');

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(email === config.admin.email && password === config.admin.password){
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ success: false });
        }
    } catch (err) {
        return next(err);
    }
});

router.get('/actions', async (req, res, next) => {
    try {
        const allActions = actionModel.find({});

        res.status(200).json({ actions: allActions })
    } catch (err) {
        return next(err);
    }
})

module.exports = router;