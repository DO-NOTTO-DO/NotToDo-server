import { statusCode, message } from '../constants';
import situationService from '../service/situationService';
import { Request, Response } from 'express';
import { fail, success } from '../constants/response';
import { slackMessage } from '../modules/slackMessage';
import { sendMessageToSlack } from '../modules/slackAPI';

const getSituation = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const data = await situationService.filterSituations(userId);
    return res.status(statusCode.OK).send(success(statusCode.OK, message.SITUATIONS_GET_SUCCESS, data));
  } catch (error) {
    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

const situationController = {
  getSituation,
};

export default situationController;
