import { Request, Response } from 'express';
import { message, statusCode } from '../constants';
import { fail, success } from '../constants/response';
import { SignInDTO } from '../DTO/authDTO';
import jwtHandler from '../modules/jwtHandler';
import authService from '../service/authService';
import social from '../modules/social';
import convertSnakeToCamel from '../modules/convertSnakeToCamel';
/**
 *  @route POST /auth
 *  @desc Post Auth
 *  @access Private
 */
const signIn = async (req: Request, res: Response) => {
  const signInDTO: SignInDTO = req.body;

  try {
    let userData, data, user;
    switch (signInDTO.socialType) {
      case 'kakao':
        userData = await social.signKakaoUser(signInDTO.socialToken);

        data = {
          name: userData.kakao_account.profile.nickname,
          email: userData.kakao_account.email,
          socialType: signInDTO.socialType,
          fcmToken: signInDTO.fcm,
          socialId: String(userData.id),
        };
        break;
    }
    user = await authService.findUserBySocialId(data.socialId);
    if (user.fcmToken != data.fcmToken) {
      await authService.updateFcm(user.id, data.fcmToken);
    }
    if (!user) {
      user = await authService.createUser(data);
    }
    const jwtToken = jwtHandler.sign(user.id);
    data = convertSnakeToCamel.keysToCamel({ ...user, accessToken: jwtToken });
    return res.status(statusCode.OK).send(success(statusCode.OK, message.LOGIN_USER_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

export default {
  signIn,
};
