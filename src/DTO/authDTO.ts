export interface SignInDTO {
  socialToken: string;
  socialType: string;
  fcm: string;
}

export interface UserCreateDTO {
  name?: string;
  email?: string;
  socialType?: string;
  fcmToken?: string;
  socialId?: string;
}
