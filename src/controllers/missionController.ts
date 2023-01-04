import { Request, Response } from 'express';
import { message, statusCode } from '../constants';
import { fail, success } from '../constants/response';
import { slackMessage } from '../modules/slackMessage';
import { sendMessageToSlack } from '../modules/slackAPI';
import missionService from '../service/missionService';
import moment from 'moment';
const getMissionCount = async (req: Request, res: Response) => {
  const inputMonth: string = req.params.month;
  const userId: number = req.body.userId;
  try {
    const months = inputMonth.split('-');
    const year = Number(months[0]);
    const month = Number(months[1]);
    const startDate = new Date(year, month - 1, 0);
    const lastDate = new Date(year, month, 0);

    const mission = await missionService.getMissionCount(userId, startDate, lastDate);
    return res.status(statusCode.OK).send(success(statusCode.OK, message.SUCCEESS, mission));
  } catch (error) {
    console.log(error);
    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

export default {
  getMissionCount,
};
