import { fail, success } from '../constants/response';
import express, { Request, Response, NextFunction } from 'express';
import { message, statusCode } from '../constants';

const { validationResult } = require('express-validator');

exports.validatorErrorChecker = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  next();
};
