import { Prisma, PrismaClient } from '@prisma/client';
import { DailyMissionDTO, MissionCreateDTO, NotTodoStatDTO, SituationStatDTO } from '../DTO/missionDTO';
const prisma = new PrismaClient();
import convertSnakeToCamel from '../modules/convertSnakeToCamel';
import moment from 'moment';
import { slackMessage } from '../modules/slackMessage';

const getMissionCount = async (userId: number, startDate: Date, lastDate: Date) => {
  const count = await prisma.mission.groupBy({
    by: ['action_date'],
    where: {
      user_id: userId,
      completion_status: {
        not: 'NOTYET',
      },
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
        },
      },
      situation: {
        select: {
          name: true,
        },
      },
      completion_status: true,
      goal: true,
      actions: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      created_at: 'asc',
    },
  });
  let count = 0;
  const data = await Promise.all(
    dailyMissions.map(async (dailyMission) => {
      if (dailyMission.completion_status === 'FINISH') {
        count += 1;
      } else if (dailyMission.completion_status === 'AMBIGUOUS') {
        count += 0.5;
      }
      const result: DailyMissionDTO = {
        id: dailyMission.id,
        title: dailyMission.not_todo.title,
        situation: dailyMission.situation?.name,
        completionStatus: dailyMission.completion_status!!,
        goal: dailyMission.goal,
        actions: dailyMission.actions,
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
  const missions = await prisma.mission.findMany({
    where: {
      user_id: userId,
      action_date: {
        gte: startDate,
        lt: lastDate,
      },
    },
    select: {
      action_date: true,
      completion_status: true,
    },
    orderBy: {
      action_date: 'asc',
    },
  });

  let data: { actionDate: string; percentage: number; }[] = [];
  if (missions.length === 0) {
    return data;
  }
  let missionDate = missions[0].action_date;
  let point = 0;
  let missionCount = 0;
  for (var i in missions) {
    if (missionDate.toDateString() != missions[i].action_date.toDateString()) {
      let date = moment(missionDate).format('YYYY-MM-DD');
      date = date.split('-').join('.');
      const result = {
        actionDate: date,
        percentage: point / missionCount,
      };
      missionDate = missions[i].action_date;
      point = 0;
      missionCount = 0;
      data.push(result);
    }
    missionCount += 1;
    if (missions[i].completion_status === 'FINISH') {
      point += 1;
    } else if (missions[i].completion_status === 'AMBIGUOUS') {
      point += 0.5;
    }

    if (missions.length === parseInt(i) + 1) {
      let date = moment(missionDate).format('YYYY-MM-DD');
      date = date.split('-').join('.');
      const result = {
        actionDate: date,
        percentage: point / missionCount,
      };
      data.push(result);
    }
  }
  return data;
};

const getNotTodoStat = async (userId: number) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const lastDate = new Date(currentYear, 12, 1);

  const notTodo = await prisma.mission.groupBy({
    where: {
      user_id: userId,
      action_date: {
        gt: startDate,
        lte: lastDate,
      },
      OR: [{ completion_status: 'FINISH' }, { completion_status: 'AMBIGUOUS' }],
    },
    by: ['not_todo_id'],
    _count: {
      not_todo_id: true,
    },
    orderBy: {
      _count: { not_todo_id: 'desc' },
    },
    take: 5,
  });

  const result = await Promise.all(
    notTodo.map(async (x) => {
      const notTodoId = x.not_todo_id;

      const notTodo = await prisma.not_todo.findFirst({
        where: {
          id: notTodoId,
        },
        select: {
          title: true,
        },
      });

      const data = {
        count: x._count.not_todo_id,
        title: notTodo?.title,
      };

      return data;
    }),
  );
  return convertSnakeToCamel.keysToCamel(result);
};

const changeCompletionStatus = async (missionId: number, completionStatus: string) => {
  const mission = await prisma.mission.update({
    where: {
      id: missionId,
    },
    data: {
      completion_status: completionStatus,
    },
    select: {
      id: true,
      completion_status: true,
    },
  });

  return convertSnakeToCamel.keysToCamel(mission);
};

const deleteMission = async (missionId: number) => {
  await prisma.mission.delete({
    where: {
      id: missionId,
    },
  });
};

const getRecentMissions = async (userId: number) => {
  const data = await prisma.mission.findMany({
    include: {
      not_todo: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: 'desc',
    },
    distinct: ['not_todo_id'],
  });

  return await Promise.all(
    data.map(async (item) => {
      const responseData = {
        title: item.not_todo.title,
      };
      return responseData;
    }),
  );
};

const getSituationStat = async (userId: number) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const lastDate = new Date(currentYear, 12, 1);

  const situation: SituationStatDTO[] = await prisma.$queryRaw(
    Prisma.sql`
    SELECT situation.id, count(situation_id), name
    FROM mission, situation
    WHERE user_id = ${userId} AND mission.situation_id = situation.id
    AND action_date > ${startDate} AND action_date <= ${lastDate}
    AND (completion_status = 'FINISH' OR completion_status = 'AMBIGUOUS')
    GROUP BY situation.id
    ORDER BY count(*) DESC
    LIMIT 3
    `,
  );

  const result = await Promise.all(
    situation.map(async (x) => {
      const data = {
        id: x.id,
        count: +String(x.count).replace('n', ''),
        name: x.name,
      };
      return data;
    }),
  );
  return convertSnakeToCamel.keysToCamel(result);
};

const getMissionStat = async (userId: number, situations: SituationStatDTO[]) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const lastDate = new Date(currentYear, 12, 1);

  const missions: SituationStatDTO[] = [];

  for (const situation of situations) {
    const notTodo: NotTodoStatDTO[] = await prisma.$queryRaw(
      Prisma.sql`
        SELECT count(not_todo_id), title
        FROM mission, not_todo
        WHERE user_id = ${userId} AND situation_id = ${situation.id} AND mission.not_todo_id = not_todo.id
        AND action_date > ${startDate} AND action_date <= ${lastDate}
        AND (completion_status = 'FINISH' OR completion_status = 'AMBIGUOUS')
        GROUP BY not_todo.id
        ORDER BY count(*) DESC
        LIMIT 3
        `,
    );
    const result = await Promise.all(
      notTodo.map(async (x) => {
        const data = {
          count: +String(x.count).replace('n', ''),
          title: x.title,
        };
        return data;
      }),
    );

    const data: SituationStatDTO = {
      id: situation.id,
      count: +String(situation.count).replace('n', ''),
      name: situation.name,
      missions: result,
    };
    missions.push(data);
  }
  return convertSnakeToCamel.keysToCamel(missions);
};

const addMissionToOtherDates = async (userId: number, missionId: number, newdates: string[]) => {
  // id??? ???????????? ???????????? ?????? ???
  const mission = await prisma.mission.findUnique({
    where: {
      id: missionId,
    },
  });

  if (!mission) {
    throw 404;
  }

  // ?????? ????????? ????????? 3??? ??????
  await Promise.all(
    newdates.map(async (date) => {
      const data = await getDailyMission(userId, date);
      if (data.length >= 3) {
        throw 4004;
      }
    }),
  );

  // ?????? ?????? ???????????? ???????????? ??????
  await Promise.all(
    newdates.map(async (newDate) => {
      const data = await prisma.mission.findFirst({
        where: {
          user_id: userId,
          action_date: new Date(newDate),
          goal: mission.goal,
          not_todo_id: mission.not_todo_id,
          situation_id: mission.situation_id,
        },
      });
      if (data) {
        throw 4005;
      }
    }),
  );

  // ??????
  const newMissions = await Promise.all(
    newdates.map(async (date) => {
      const responseData = {
        user_id: userId,
        not_todo_id: mission.not_todo_id,
        goal: mission.goal,
        situation_id: mission.situation_id,
        action_date: new Date(date),
        completion_status: 'NOTYET',
      };
      return responseData;
    }),
  );

  const newMissionIds = await Promise.all(
    newMissions.map(async (mission) => {
      const res = await prisma.mission.create({
        data: mission,
        select: {
          id: true
        }
      })
      return res
    })
  )

  // ?????? ????????? id??? ???????????? ???????????? ???????????? ????????? ???????????? ????????????
  const newActions = await prisma.action.findMany({
    where: {
      mission_id: mission.id
    },
    select: {
      name: true
    }
  })
  console.log(newMissionIds)
  console.log(newActions)

  const createdNewActions = newActions.map ((action) => {
    return newMissionIds.map((missionId) => {
      const responseData = {
        mission_id: missionId.id,
        name: action.name
      }
      return responseData
    })
  })

  await prisma.action.createMany({
    data: createdNewActions.flat()
  })
  
  return newdates;
};

// ????????? ??????
const createMission = async (userId: number, newMission: MissionCreateDTO) => {
  const missionDate = new Date(newMission.actionDate.split('.').join('-'));

  // ??????????????? ????????? 3??? ?????? (4002)
  const datilyMission = await prisma.mission.findMany({
    where: {
      user_id: userId,
      action_date: missionDate,
    },
  });

  if (datilyMission.length >= 3) {
    throw 4002;
  }

  // ?????? ?????? ????????? ?????? (4003)
  // ????????????, ??????, ??????, ????????? ??????
  const alreadyData = await prisma.mission.findFirst({
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
      action_date: missionDate,
    },
  });

  if (alreadyData) {
    throw 4003;
  }

  // ??????
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

  const createdMission = await prisma.mission.create({
    data: {
      not_todo_id: title.id,
      situation_id: situationId.id,
      action_date: missionDate,
      goal: newMission.goal,
      user_id: userId,
      completion_status: 'NOTYET',
    },
    select: {
      id: true,
      situation: {
        select: {
          name: true,
        },
      },
      goal: true,
      not_todo: {
        select: {
          title: true,
        },
      },
      action_date: true,
    },
  });

  const newActions = await Promise.all(
    newMission.actions.map(async (action) => {
      const data = {
        mission_id: createdMission.id,
        name: action,
      };
      return data;
    }),
  );

  await prisma.action.createMany({
    data: newActions,
  });

  const resdata = {
    id: createdMission.id,
    title: createdMission.not_todo.title,
    goal: createdMission.goal,
    situation: {
      name: createdMission.situation?.name,
    },
    actions: newActions.map((item) => item.name),
    actionDate: createdMission.action_date,
  };

  return resdata;
};

export default {
  getMissionCount,
  getDailyMission,
  getWeeklyMissionCount,
  getNotTodoStat,
  getSituationStat,
  changeCompletionStatus,
  deleteMission,
  getRecentMissions,
  addMissionToOtherDates,
  createMission,
  getMissionStat,
};
