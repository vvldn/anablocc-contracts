const router = require('express').Router();

router.post('/login', async (req, res, next) => {
    try {
        const { phone } = req.body;

    } catch (err) {
        return next(err);
    }
});

module.exports = router;