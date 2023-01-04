const validateDate = async (date: string) => {
  try {
    if (isNaN(Date.parse(date))) {
      throw 400;
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
  } catch (error) {
    throw 400;
  }
};

export default {
  validateDate,
};