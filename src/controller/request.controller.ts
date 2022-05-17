import { Response } from 'express';
import { IGetUserAuthInfoRequest } from '../definition';

class RequestControl {
    async send(req: IGetUserAuthInfoRequest, res: Response) {
        const ID = req.messageId;
        const influencerID = req.influencerId;
        const instagramID = req.instagramId;
        const message = req.message;
        const brand = req.userBrandName;
        return res.status(200).send({
            messageID: ID,
            influencerID: influencerID,
            instagramID: instagramID,
            message_content: message,
            brand: brand,
        });
    }
    async change(req: IGetUserAuthInfoRequest, res: Response) {
        const status = req.statusId;
        if (status === 2) {
            return res
                .status(200)
                .send({ Message: 'Influencer has accepted your request.' });
        }

        if (status === 3) {
            return res
                .status(200)
                .send({ Message: 'Influencer has declined your request.' });
        }
    }
}

const requestControl = new RequestControl();
export default requestControl;
