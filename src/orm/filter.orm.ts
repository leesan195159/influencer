import { NextFunction, Response } from 'express';
import { In } from 'typeorm';
import { IGetUserAuthInfoRequest } from '../definition';
import { Campaign } from '../entity/Campaign';
import { Category } from '../entity/Category';
import { Image } from '../entity/Image';
import { Influencer } from '../entity/Influencer';
import { Influencer_Category } from '../entity/Influencer_category';
import { Influencer_Image } from '../entity/Influencer_image';

class FilterOrmController {
    async findUserCampaignList(
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) {
        const userId = req.userId;
        const limit = req.query.limit as string;
        const limitNumber = parseInt(limit);
        const offset = req.query.offset as string;
        const offsetNumber = parseInt(offset);
        const userCampaignList = await Campaign.find({
            where: { userID: userId.id },
            select: ['id', 'campaign_name', 'created_at'],
            order: { created_at: 'DESC' },
            skip: offsetNumber,
            take: limitNumber,
        });
        req.campaign = userCampaignList;
        return next();
    }

    async findCampaignStatusInfluencerList(
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) {
        const userId = req.userId;
        const limit = req.query.limit as string;
        const limitNumber = parseInt(limit);
        const offset = req.query.offset as string;
        const offsetNumber = parseInt(offset);
        const campaign = req.query.campaignId as string;
        const campaignId = parseInt(campaign);
        const sortBy = req.query.sort_by as string;
        const sortOption = req.query.sort_option as string;
        const sortStatusBy = req.query.sort_status_by as string;
        const sortStatus = parseInt(sortStatusBy);
        const influencerListDown = await Influencer.find({
            relations: {
                messages: { status: true, campaign: true },
                influencer_categories: { category: true },
                influencer_hashtags: { hashtag: true },
            },
            where: {
                messages: {
                    campaignID: campaignId,
                    statusID: sortStatus,
                    campaign: { userID: userId.id },
                },
            },
            select: {
                messages: {
                    statusID: true,
                    status: { status_name: true },
                },
            },
            order: { [sortBy]: 'DESC' },
            skip: offsetNumber,
            take: limitNumber,
        });
        const influencerListUp = await Influencer.find({
            relations: {
                messages: { status: true },
                influencer_categories: { category: true },
                influencer_hashtags: { hashtag: true },
            },
            where: {
                messages: {
                    campaignID: campaignId,
                    statusID: sortStatus,
                    campaign: { userID: userId.id },
                },
            },
            select: {
                messages: {
                    statusID: true,
                    status: { status_name: true },
                },
            },
            order: { [sortBy]: 'ASC' },
            skip: offsetNumber,
            take: limitNumber,
        });
        req.influencerListDown = influencerListDown;
        req.influencerListUp = influencerListUp;
        req.sortOption = sortOption;
        return next();
    }

    async findCampaignTotalStatusInfluencerList(
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) {
        const userId = req.userId;
        const limit = req.query.limit as string;
        const limitNumber = parseInt(limit);
        const offset = req.query.offset as string;
        const offsetNumber = parseInt(offset);
        const campaign = req.query.campaignId as string;
        const campaignId = parseInt(campaign);
        const sortBy = req.query.sort_by as string;
        const sortOption = req.query.sort_option as string;
        const influencerlistdown = await Influencer.find({
            relations: {
                messages: { status: true, campaign: true },
                influencer_categories: { category: true },
                influencer_hashtags: { hashtag: true },
            },
            where: {
                messages: {
                    campaignID: campaignId,
                    campaign: { userID: userId.id },
                },
            },
            select: {
                messages: {
                    statusID: true,
                    status: { status_name: true },
                },
            },
            order: { [sortBy]: 'DESC' },
            skip: offsetNumber,
            take: limitNumber,
        });
        const influencerListup = await Influencer.find({
            relations: {
                messages: { status: true, campaign: true },
                influencer_categories: { category: true },
                influencer_hashtags: { hashtag: true },
            },
            where: {
                messages: {
                    campaignID: campaignId,
                    campaign: { userID: userId.id },
                },
            },
            select: {
                messages: {
                    statusID: true,
                    status: { status_name: true },
                },
            },
            order: { [sortBy]: 'ASC' },
            skip: offsetNumber,
            take: limitNumber,
        });
        req.influencerListDown = influencerlistdown;
        req.influencerListUp = influencerListup;
        req.sortOption = sortOption;
        return next();
    }

    async findCategoryList(
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) {
        const categoryList = await Category.find({
            select: ['id', 'category_name'],
        });
        req.categoryList = categoryList;
        return next();
    }

    async findAndCountCategoryInfluencerList(
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) {
        const category = req.query.categoryId as string;
        const categoryId = parseInt(category);
        const sortBy = req.query.sort_by as string;
        const sortOption = req.query.sort_option as string;
        const limit = req.query.limit as string;
        const limitNumber = parseInt(limit);
        const offset = req.query.offset as string;
        const offsetNumber = parseInt(offset);
        const influencerList = await Influencer_Category.find({
            relations: { influencer: true },
            where: {
                category: { id: categoryId },
            },
            select: {
                categoryID: true,
                influencer: { id: true },
            },
        });
        const influencerIdList = influencerList.map(item => item.influencer.id);
        const influencerListDown =
            influencerList &&
            (await Influencer.findAndCount({
                relations: {
                    influencer_categories: { category: true },
                    influencer_hashtags: { hashtag: true },
                },
                where: { id: In(influencerIdList) },
                order: { [sortBy]: 'DESC' },
                skip: offsetNumber,
                take: limitNumber,
            }));
        const influencerListUp =
            influencerList &&
            (await Influencer.findAndCount({
                relations: {
                    influencer_categories: { category: true },
                    influencer_hashtags: { hashtag: true },
                },
                where: { id: In(influencerIdList) },
                order: { [sortBy]: 'ASC' },
                skip: offsetNumber,
                take: limitNumber,
            }));
        req.influencerListUp = influencerListUp;
        req.influencerListDown = influencerListDown;
        req.influencerList = influencerList;
        req.sortOption = sortOption;
        req.categoryId = categoryId;
        req.sortBy = sortBy;
        req.limitNumber = limitNumber;
        req.offsetNumber = offsetNumber;
        return next();
    }

    async mainInfluencerList(
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) {
        const influencerList = await Influencer_Category.find({
            relations: { influencer: true },
            where: {
                category: { id: 1 },
            },
            select: {
                categoryID: true,
                influencer: { id: true },
            },
        });
        const influencerIdList = influencerList.map(item => item.influencer.id);
        const influencerListDown =
            influencerList &&
            (await Influencer.findAndCount({
                relations: {
                    influencer_categories: { category: true },
                    influencer_hashtags: { hashtag: true },
                },
                where: { id: In(influencerIdList) },
                order: { influencer_follower: 'DESC' },
                skip: 0,
                take: 5,
            }));
        req.influencerList = influencerList;
        req.influencerIdList = influencerIdList;
        req.influencerListDown = influencerListDown;
        return next();
    }
    async findInfluencerImageList(
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) {
        const influencerId = parseInt(req.params.influencerId);
        const imageList = await Image.find({
            relations: { influencer_images: true },
            where: {
                influencer_images: { influencerID: influencerId },
            },
            select: ['image_url'],
        });
        const influencer = await Influencer.find({
            where: { id: influencerId },
            select: [
                'influencer_follower',
                'influencer_images',
                'influencer_instagram_id',
                'influencer_posting',
                'influencer_average_like',
                'influencer_average_comment',
            ],
        });
        req.imageList = imageList;
        req.influencer = influencer;
        return next();
    }
}

const filterOrmController = new FilterOrmController();
export default filterOrmController;
