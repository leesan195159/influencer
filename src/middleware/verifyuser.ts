import { NextFunction, Response } from 'express';
import { User } from '../entity/User';
import { IGetUserAuthInfoRequest } from '../definition';
import * as bcrypt from 'bcrypt';
class VerifyController {
    async checkUser(
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                user_email: email,
            },
        });
        if (!user) {
            return res.status(404).send({ message: 'Invalid email' });
        }
        const decoded_password = bcrypt.compareSync(
            password,
            user.user_password
        );
        if (!decoded_password) {
            return res.status(401).send({ message: 'Invalid password' });
        }
        req.user = user;
        next();
    }
}

const verifyController = new VerifyController();
export default verifyController;
