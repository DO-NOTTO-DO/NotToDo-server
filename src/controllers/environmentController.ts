import { Request, Response } from 'express';
import { message, statusCode } from '../constants';
import { fail, success } from '../constants/response';

import { slackMessage } from '../modules/slackMessage';
import { sendMessageToSlack } from '../modules/slackAPI';
import environmentService from '../service/environmentService';

/**
 *  @route GET /environment/category
 *  @desc Get category
 *  @access Public
 */
const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await environmentService.getCategory();
    return res.status(statusCode.OK).send(success(statusCode.OK, message.READ_CATEGORY_SUCCESS, category));
  } catch (error) {
    console.log(error);
    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

/**
 *  @route GET /environment/:categoryId
 *  @desc Get category
 *  @access Public
 */
const getCategoryDetail = async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;
  console.log(categoryId);
  try {
    const category = await environmentService.getCategoryDetail(+categoryId);
    return res.status(statusCode.OK).send(success(statusCode.OK, message.READ_CATEGORY_SUCCESS, category));
  } catch (error) {
    console.log(error);
    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

export default {
  getCategory,
  getCategoryDetail,
};
