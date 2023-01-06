import { Request, Response } from 'express';
import { message, statusCode } from '../constants';
import { fail, success } from '../constants/response';

import { slackMessage } from '../modules/slackMessage';
import { sendMessageToSlack } from '../modules/slackAPI';
import bannerService from '../service/bannerService';
import dateValidator from '../modules/dateValidator';

/**
 *  @route GET /mission/banner
 *  @desc Get banner
 *  @access Public
 */
const getBanner = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  try {
    const date = req.params.startDate;
    await dateValidator.validateDate(date);
    const data = await bannerService.getBanner(userId, date);
    return res.status(statusCode.OK).send(success(statusCode.OK, message.READ_BANNER_SUCCESS, data));
  } catch (error) {
    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

export default {
  getBanner,
}