import type { Response } from 'express';

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
