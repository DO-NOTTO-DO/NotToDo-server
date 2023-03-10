import { Request, Response } from 'express';
import { message, statusCode } from '../constants';
import { fail, success } from '../constants/response';
import { SignInDTO } from '../DTO/authDTO';
import { slackMessage } from '../modules/slackMessage';
import { sendMessageToSlack } from '../modules/slackAPI';
import jwtHandler from '../modules/jwtHandler';
import authService from '../service/authService';
import social from '../modules/social';

/**
 *  @route POST /auth
 *  @desc Post Auth
 *  @access Private
 */
const signIn = async (req: Request, res: Response) => {
  const signInDTO: SignInDTO = req.body;

  try {
    let userData, data;
    switch (signInDTO.socialType) {
      case 'kakao':
        userData = await social.signKakaoUser(signInDTO.socialToken);
        data = {
          name: userData.kakao_account.profile.nickname,
          email: userData.kakao_account.email,
          socialType: signInDTO.socialType,
          socialId: String(userData.id),
        };
        break;
    }

    if (!data) {
      return 0;
    }

    const user = await authService.createUser(data);
    const fcm = await authService.createFCM(user.id, signInDTO.fcmToken);

    const jwtToken = jwtHandler.sign(user.id);
    data = { ...user, accessToken: jwtToken };
    return res.status(statusCode.OK).send(success(statusCode.OK, message.LOGIN_USER_SUCCESS, data));
  } catch (error) {
    console.log(error);
    const errorMessage: string = slackMessage(req.method.toUpperCase(), req.originalUrl, error, req.body.user?.id);
    sendMessageToSlack(errorMessage);
    if (error == 401) {
      return res.status(statusCode.UNAUTHORIZED).send(fail(statusCode.UNAUTHORIZED, message.INVALID_TOKEN));
    }
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

export default {
  signIn,
};
