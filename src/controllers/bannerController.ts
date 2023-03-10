import { Request, Response } from 'express';
import { message, statusCode } from '../constants';
import { fail, success } from '../constants/response';

import { slackMessage } from '../modules/slackMessage';
import { sendMessageToSlack } from '../modules/slackAPI';
import bannerService from '../service/bannerService';

/**
 *  @route GET /mission/banner
 *  @desc Get banner
 *  @access Public
 */
const getBanner = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  try {
    const data = await bannerService.getBanner(userId);
    return res.status(statusCode.OK).send(success(statusCode.OK, message.READ_BANNER_SUCCESS, data));
  } catch (error) {
    if (error === 400) {
      res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.INVALID_DATE_TYPE));
      return;
    }
    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

export default {
  getBanner,
}
