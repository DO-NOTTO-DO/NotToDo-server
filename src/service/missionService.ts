import { PrismaClient } from '@prisma/client';
import { DailyMissionDTO } from '../DTO/missionDTO';
const prisma = new PrismaClient();
import convertSnakeToCamel from '../modules/convertSnakeToCamel';

const getDailyMission = async (userId: number, date: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return null;
  }

  if (isNaN(Date.parse(date))) {
    return 400;
  }
  if (date.length != 10) {
    throw 400;
  } else {
    const dateStrings = date.split('-');
    if (dateStrings[0].length != 4) {
      throw 400;
    } else if (dateStrings[1].length != 2) {
      throw 400;
    } else if (dateStrings[2].length != 2) {
      throw 400;
    }
  }

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

export default {
  getDailyMission,
};
