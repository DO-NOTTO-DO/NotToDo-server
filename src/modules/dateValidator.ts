const validateDate = async (date: string) => {
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
};

/**
 * "YYYY.DD.MM" 형식체크
 * @param date: 체크할날짜
 */
const validateDotDate = async (date: string) => {
  if (isNaN(Date.parse(date))) {
    throw 400;
  }
  if (date.length != 10) {
    throw 400;
  } else {
    const dateStrings = date.split('.');
    if (dateStrings[0].length != 4) {
      throw 400;
    } else if (dateStrings[1].length != 2) {
      throw 400;
    } else if (dateStrings[2].length != 2) {
      throw 400;
    }
  }
};

const validateMonday = async (date: string) => {
  const startDate: Date = new Date(date);
  const weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  if (weekday[startDate.getDay()] != 'MON') {
    throw 4001;
  }
};

export default {
  validateDate,
  validateMonday,
  validateDotDate,
};
