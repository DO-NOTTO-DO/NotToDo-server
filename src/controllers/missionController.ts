import { Request, Response } from 'express';
import { message, statusCode } from '../constants';
import { fail, success } from '../constants/response';
import { slackMessage } from '../modules/slackMessage';
import { sendMessageToSlack } from '../modules/slackAPI';
import missionService from '../service/missionService';
import dateValidator from '../modules/dateValidator';
import moment from 'moment';

/**
 *  @route GET /mission/daily/:date
 *  @desc Get daily mission
 *  @access Public
 */
 const getDailyMission = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const actionDate = req.params.date;
    await dateValidator.validateDate(actionDate);
    const data = await missionService.getDailyMission(userId, actionDate);
    return res.status(statusCode.OK).send(success(statusCode.OK, message.READ_DAILY_MISSION_SUCCESS, data));
  } catch (error) {
    if (error === 400) {
      res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.INVALID_DATE_TYPE));
    }
    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
 };


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

/**
 *  @route GET /mission/week/:startDate
 *  @desc Get weekly mission count
 *  @access Public
 */
const getWeeklyMissionCount = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const startDate = req.params.startDate;
    await dateValidator.validateDate(startDate);
    await dateValidator.validateMonday(startDate);
    const data = await missionService.getWeeklyMissionCount(userId, startDate);
    return res.status(statusCode.OK).send(success(statusCode.OK, message.READ_WEEKLY_MISSION_COUNT_SUCCESS, data));
  } catch (error) {
    if (error === 400) {
      res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.INVALID_DATE_TYPE));
    } else if (error == 4001) {
      res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.IS_NOT_MONDAY));
    }
    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
}

export default {
  getMissionCount,
  getDailyMission,
  getWeeklyMissionCount,
};
