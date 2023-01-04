import { PrismaClient } from '@prisma/client';
import { CategoryDTO } from '../DTO/environmentDTO';
const prisma = new PrismaClient();
import convertSnakeToCamel from '../modules/convertSnakeToCamel';

const getCategory = async (): Promise<CategoryDTO> => {
  const category = await prisma.recommend_category.findMany({});
  return convertSnakeToCamel.keysToCamel(category);
};

export default {
  getCategory,
};
