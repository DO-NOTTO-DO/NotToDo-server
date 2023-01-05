import { PrismaClient } from '@prisma/client';
import { DailyMissionDTO, MissionCreateDTO } from '../DTO/missionDTO';
const prisma = new PrismaClient();
import convertSnakeToCamel from '../modules/convertSnakeToCamel';
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

const getMissionCount = async (userId: number, startDate: Date, lastDate: Date) => {
  const count = await prisma.mission.groupBy({
    by: ['action_date'],
    where: {
      user_id: userId,
      action_date: {
        gt: startDate,
        lte: lastDate,
      },
    },
    _count: {
      action_date: true,
    },
    orderBy: {
      action_date: 'asc',
    },
  });

  const data = await Promise.all(
    count.map(async (x) => {
      let date = moment(x.action_date).format('YYYY-MM-DD');
      date = date.split('-').join('.');
      const result = {
        actionDate: date,
        count: x._count.action_date,
      };
      return result;
    }),
  );

  return convertSnakeToCamel.keysToCamel(data);
};

const getDailyMission = async (userId: number, date: string) => {
  const actionDate: Date = new Date(date);
  const dailyMissions = await prisma.mission.findMany({
    where: {
      user_id: userId,
      action_date: actionDate,
    },
    select: {
      id: true,
      not_todo: {
        select: {
          title: true,
        }
      },
      situation: {
        select: {
          name: true,
        }
      },
      completion_status: true,
      goal: true,
      actions: {
        select: {
          name: true
        }
      }
    },
  });

  const data = await Promise.all(
    dailyMissions.map(async (dailyMission) => {
      const result: DailyMissionDTO = {
        id: dailyMission.id,
        title: dailyMission.not_todo.title,
        situation: dailyMission.situation?.name,
        completionStatus: dailyMission.completion_status!!,
        goal: dailyMission.goal,
        actions: dailyMission.actions
      };
      return result;
    }),
  );
  return data;
};

const getWeeklyMissionCount = async (userId: number, date: string) => {
  const startDate: Date = new Date(date);
  const lastDate: Date = new Date(startDate);
  lastDate.setDate(lastDate.getDate() + 7);
  console.log(startDate, lastDate);
  const count = await prisma.mission.groupBy({
    by: ['action_date'],
    where: {
      user_id: userId,
      action_date: {
        gt: startDate,
        lte: lastDate,
      },
    },
    _count: {
      action_date: true,
    },
    orderBy: {
      action_date: 'asc',
    },
  });
  
  const data = await Promise.all(
    count.map(async (x) => {
      let date = moment(x.action_date).format('YYYY-MM-DD');
      date = date.split('-').join('.');
      const result = {
        actionDate: date,
        count: x._count.action_date,
      };
      return result;
    }),
  );
  return data;
}
const createMission = async (userId: number, newMission: MissionCreateDTO) => {
  const date = newMission.actionDate.split('.').join('.');
  let actionDate = moment(date);
  const dailyMissionCount = await getDailyMission(userId, date);

  // 해당날짜 낫투두가 이미 3개 이상인경우
  if (dailyMissionCount.length >= 3) {
    throw 4003;
  }

  // 낫투두 중복체크 (날짜 같고, 낫투두명, 상황, 목표가 같음)
  const equalMissions = await prisma.mission.findMany({
    include: {
      situation: {
        select: {
          name: true,
        },
      },
      not_todo: {
        select: {
          title: true,
        },
      },
    },
    where: {
      not_todo: {
        title: newMission.title,
      },
      situation: {
        name: newMission.situation,
      },
      goal: newMission.goal,
      user_id: userId,
    },
  });

  console.log('isEqualDateMission', equalMissions);
  const filteredMission = equalMissions.filter((item) => {
    console.log(moment(item.action_date).format('YYYY-MM-DD'), actionDate.format('YYYY-MM-DD'));
    return moment(item.action_date).format('YYYY-MM-DD') == actionDate.format('YYYY-MM-DD');
  });

  console.log(filteredMission);

  if (filteredMission.length > 0) {
    throw 4002;
  }

  const situationId = await prisma.situation.upsert({
    where: {
      name: newMission.situation,
    },
    update: {},
    create: {
      name: newMission.situation,
    },
    select: {
      id: true,
    },
  });

  const title = await prisma.not_todo.upsert({
    where: {
      title: newMission.title,
    },
    update: {},
    create: {
      title: newMission.title,
    },
    select: {
      id: true,
    },
  });

  const response = await prisma.mission.create({
    data: {
      not_todo_id: title.id,
      situation_id: situationId.id,
      action_date: new Date(actionDate),
      goal: newMission.goal,
      user_id: userId,
      completion_status: 'NOTYET',
    },
  });

  return response;
};

export default {
  getMissionCount,
  getDailyMission,
  getWeeklyMissionCount,
  createMission,
};
