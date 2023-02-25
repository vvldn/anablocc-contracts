const router = require('express').Router();

const userAuthMiddleware = require('../../middlewares/userAuth')
const userController = require('../../controllers/userController');

router.post('/signup', userController.userSignUp);

router.post('/login', userController.checkAndSendOtp);

router.post('/verify-otp', userController.verifyOtpAndLogin);

router.post('/logout', userController.userLogout);

router.get('/properties', userAuthMiddleware, userController.getAllPropertiesForUser);

router.get('/actions', userAuthMiddleware, userController.getAllActionsForUser);

router.post('/actions/accept-sale', userAuthMiddleware, userController.verifyAadharOtpAndAcceptSale);

module.exports = router;