import type { Response } from 'express';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

export const sendResponse = (
  res: Response,
  {
    success = true,
    statusCode = 200,
    message = 'Success',
    data = null,
  }: {
    success?: boolean;
    statusCode?: number;
    message?: string;
    data?: any;
  },
) => {
  return res.status(statusCode).json({
    success,
    statusCode,
    message,
    data,
  });
};

export type ApiSuccessResponse<T> = {
  success: true;
  statusCode: number;
  message: string;
  data: T;
};

export const success = <T>(
  data: T,
  message = 'Success',
  statusCode = 200,
): ApiSuccessResponse<T> => {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
};

export const fail = (
  message = 'Something went wrong',
  statusCode = HttpStatus.BAD_REQUEST,
): never => {
  switch (statusCode) {
    case HttpStatus.BAD_REQUEST:
      throw new BadRequestException(message);
    case HttpStatus.UNAUTHORIZED:
      throw new UnauthorizedException(message);
    case HttpStatus.FORBIDDEN:
      throw new ForbiddenException(message);
    case HttpStatus.NOT_FOUND:
      throw new NotFoundException(message);
    case HttpStatus.CONFLICT:
      throw new ConflictException(message);
    default:
      throw new HttpException(message, statusCode);
  }
};
