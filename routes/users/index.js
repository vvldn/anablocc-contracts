const router = require('express').Router();

const userAuthMiddleware = require('../../middlewares/userAuth')
const userController = require('../../controllers/userController');

router.post('/signup', userController.userSignUp);

router.post('/login', userController.checkAndSendOtp);

router.post('/verify-otp', userController.verifyOtpAndLogin);

router.post('/logout', userController.userLogout);

router.get('/:userId', userController.getUserDetails);

router.post('/properties', userAuthMiddleware, userController.getAllPropertiesForUser);

router.post('/actions', userAuthMiddleware, userController.getAllActionsForUser);

router.post('/wallet', userAuthMiddleware, userController.setWalletForUser);

module.exports = router;