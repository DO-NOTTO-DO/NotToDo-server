import { PrismaClient } from '@prisma/client';
import { DailyMissionDTO } from '../DTO/missionDTO';
const prisma = new PrismaClient();
import convertSnakeToCamel from '../modules/convertSnakeToCamel';
import moment from 'moment';

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
  console.log(count);
  
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

export default {
  getMissionCount,
  getDailyMission,
  getWeeklyMissionCount,
};
