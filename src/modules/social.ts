import axios from 'axios';
const jwt = require('jsonwebtoken');

const signKakaoUser = async (socialToken) => {
  try {
    const user = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${socialToken}`,
      },
    });
    if (!user) {
      throw 401;
    }
    return user.data;
  } catch (err) {
    throw 401;
  }
};

const signAppleUser = async (appleAccessToken) => {
  try {
    const appleUser = jwt.decode(appleAccessToken);
    if (appleUser.email_verified == 'false') {
      throw 401;
    }
    return appleUser;
  } catch (err) {
    throw 401;
  }
};
module.exports = {
  signAppleUser,
  signKakaoUser,
};
