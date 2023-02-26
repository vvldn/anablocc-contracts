const router = require('express').Router();

const userAuthMiddleware = require('../../middlewares/userAuth')
const userController = require('../../controllers/userController');

router.post('/signup', userController.userSignUp);

router.post('/login', userController.checkAndSendOtp);

router.post('/verify-otp', userController.verifyOtpAndLogin);

router.post('/logout', userController.userLogout);

router.get('/:userId', userController.getUserDetailsById);

router.get('/aadhar/:aadhar', userController.getUserDetailsByAadhar);

router.get('/:userId/properties', userController.getAllPropertiesForUser);

router.get('/:userId/actions', userController.getAllActionsForUser);

router.post('/:userId/wallet', userController.setWalletForUser);

module.exports = router;