import usercontroller from '../controller/user.controller';
import wrapAsyncController from '../middleware/error';
import verifyController from '../middleware/verifyuser';

const express = require('express');
const router = express.Router();

router.post('/signup', wrapAsyncController(usercontroller.signUp));
router.post('/check-email', wrapAsyncController(usercontroller.checkUserEmail));
router.post(
    '/signin',
    wrapAsyncController(verifyController.checkUser),
    wrapAsyncController(usercontroller.signIn)
);

export default router;
