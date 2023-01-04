import { PrismaClient } from '@prisma/client';
import { CategoryDetailDTO, CategoryDTO } from '../DTO/environmentDTO';
const prisma = new PrismaClient();
import convertSnakeToCamel from '../modules/convertSnakeToCamel';

const getCategory = async (): Promise<CategoryDTO[]> => {
  const category = await prisma.recommend_category.findMany({});
  return convertSnakeToCamel.keysToCamel(category);
};

const getCategoryDetail = async (categoryId: number): Promise<CategoryDetailDTO> => {
  const action = await prisma.recommend_mission.findMany({
    where: {
      recommend_category_id: categoryId,
    },
    select: {
      title: true,
      recommend_action: {
        select: {
          name: true,
        },
      },
    },
  });

  return convertSnakeToCamel.keysToCamel(action);
};

export default {
  getCategory,
  getCategoryDetail,
};
