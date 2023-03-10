import { Request, Response } from 'express';
import { message, statusCode } from '../constants';
import { fail, success } from '../constants/response';
import { slackMessage } from '../modules/slackMessage';
import { sendMessageToSlack } from '../modules/slackAPI';
import missionService from '../service/missionService';
import dateValidator from '../modules/dateValidator';
import moment from 'moment';
import missionValidator from '../modules/missionValidator';
import { MissionCreateDTO } from '../DTO/missionDTO';

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
    const startDate = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 1);
    const mission = await missionService.getMissionCount(userId, startDate, lastDate);
    return res.status(statusCode.OK).send(success(statusCode.OK, message.READ_MISSION_COUNT_SUCCESS, mission));
  } catch (error) {
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
      return;
    } else if (error == 4001) {
      res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.IS_NOT_MONDAY));
      return;
    }
    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

/**
 *  @route GET /mission/recent
 *  @desc Get recent mission
 *  @access Public
 */
const getRecentMissions = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const data = await missionService.getRecentMissions(userId);
    return res.status(statusCode.OK).send(success(statusCode.OK, message.RECENT_MISSION_SUCCESS, data));
  } catch (error) {
    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

/**
 *  @route PATCH /mission/:missionId/check
 *  @desc Patch mission status
 *  @access Public
 */
const changeCompletionStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    await missionValidator.validateMissionId(req.params.missionId);
    const missionId = Number(req.params.missionId);
    await missionValidator.validateUsersMission(userId, missionId);
    const completionStatus = req.body.completionStatus;
    await missionValidator.validateCompletionStatus(completionStatus);
    const data = await missionService.changeCompletionStatus(missionId, completionStatus);
    return res.status(statusCode.CREATED).send(success(statusCode.CREATED, message.CHANGE_COMPLETION_STATUS_SUCCESS, data));
  } catch (error) {
    if (error === 400) {
      res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.INVALID_MISSION_ID));
      return;
    } else if (error == 4001) {
      res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.NOT_USERS_MISSION));
      return;
    } else if (error === 4002) {
      res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.INVALID_COMPLETION_STATUS_TYPE));
      return;
    }
    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

/**
 *  @route DELETE /mission/:missionId
 *  @desc Delete mission
 *  @access Public
 */
const deleteMission = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    await missionValidator.validateMissionId(req.params.missionId);
    const missionId = Number(req.params.missionId);
    await missionValidator.validateUsersMission(userId, missionId);
    await missionService.deleteMission(missionId);
    return res.status(statusCode.OK).send(success(statusCode.OK, message.DELETE_MISSION_SUCCESS));
  } catch (error) {
    if (error === 400) {
      res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.INVALID_MISSION_ID));
      return;
    } else if (error == 4001) {
      res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.NOT_USERS_MISSION));
      return;
    }
  }
};

const getNotTodoStat = async (req: Request, res: Response) => {
  const userId: number = req.body.userId;
  try {
    const notTodo = await missionService.getNotTodoStat(userId);
    return res.status(statusCode.OK).send(success(statusCode.OK, message.READ_NOTTODO_STAT_SUCCESS, notTodo));
  } catch (error) {
    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

const getSituationStat = async (req: Request, res: Response) => {
  const userId: number = req.body.userId;
  try {
    const situation = await missionService.getSituationStat(userId);
    const notTodo = await missionService.getMissionStat(userId, situation);

    return res.status(statusCode.OK).send(success(statusCode.OK, message.READ_SITUATION_STAT_SUCCESS, notTodo));
  } catch (error) {
    console.log(error);
    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

const postMissionOtherDates = async (req: Request, res: Response) => {
  const userId: number = req.body.userId;
  const missionId = req.params.missionId;
  const dates: string[] = req.body.dates;

  try {
    if (!missionId) {
      throw 4001;
    }

    if (!dates) {
      throw 4002;
    }

    const newDates = await Promise.all(
      dates.map(async (date) => {
        await dateValidator.validateDotDate(date);
        return date.split('.').join('-');
      }),
    );

    const data = await missionService.addMissionToOtherDates(userId, +missionId, newDates);
    return res.status(statusCode.CREATED).send(success(statusCode.CREATED, message.COPY_OTHERDATES_MISSION_SUCCESS, data));
  } catch (error) {
    if (error == 4001) {
      // ????????? ?????? ????????????. (id)
      return res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.EMPTY_MISSION_ID));
    } else if (error == 4002) {
      // ????????? ?????? ????????????. (??????)
      return res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.EMPTY_MISSION_DATES));
    } else if (error == 400) {
      // ?????? ????????? ?????????
      return res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.INVALID_DATE_TYPE));
    } else if (error == 4004) {
      // ?????? ????????? ?????? 3??? ????????? ?????????
      return res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.ALREADY_THREE_MISSIONS));
    } else if (error == 4005) {
      // ?????? ????????? ?????? ?????? ????????? ??????
      return res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.ALREADY_SAME_MISSIONS));
    } else if (error == 404) {
      // ?????? id??? ???????????? ???????????? ?????? ??? ??????
      return res.status(statusCode.NOT_FOUND).send(fail(statusCode.NOT_FOUND, message.MISSION_NOT_FOUND));
    }

    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

const postMission = async (req: Request, res: Response) => {
  try {
    const userId: number = req.body.userId;
    const requestData: MissionCreateDTO = req.body;

    if (requestData.actions.length > 2) {
      throw 4005;
    }

    if (requestData.actionDate != null || requestData.actionDate != '') {
      await dateValidator.validateDotDate(requestData.actionDate);
    }

    const data = await missionService.createMission(userId, requestData);
    return res.status(statusCode.CREATED).send(success(statusCode.CREATED, message.CREATE_MISSION_SUCCESS, data));
  } catch (error) {
    if (error == 4001) {
      // ??????????????? ????????????.
      return res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    } else if (error == 4002) {
      // ???????????? ????????? 3????????? ????????? ??? ??????
      return res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.LIMITED_MISSION_COUNT));
    } else if (error == 4003) {
      // ?????? ????????? ?????? ???????????? ?????????
      return res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.ALREADY_EXIST_MISSION));
    } else if (error == 400) {
      // ?????? ?????? ??????
      return res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.INVALID_DATE_TYPE));
    } else if (error == 4005) {
      return res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.LIMITED_ACTION_COUNT));
    }

    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

export default {
  getMissionCount,
  getDailyMission,
  getWeeklyMissionCount,
  getNotTodoStat,
  changeCompletionStatus,
  deleteMission,
  getRecentMissions,
  getSituationStat,
  postMissionOtherDates,
  postMission,
};
