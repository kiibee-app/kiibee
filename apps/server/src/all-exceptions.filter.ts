import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getStatusCode(exception);
    const isProduction = process.env.NODE_ENV === 'production';

    console.error({
      error: exception,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });

    response.status(status).json({
      statusCode: status,
      message: isProduction
        ? this.getGenericMessage(status)
        : this.getDetailedMessage(exception),
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(isProduction ? {} : { stack: this.getStack(exception) }),
    });
  }

  private getStatusCode(exception: unknown): number {
    if (exception instanceof Error && 'status' in exception) {
      return (exception as any).status;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getGenericMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'Bad request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not found',
      500: 'Internal server error',
    };
    return messages[status] || 'An error occurred';
  }

  private getDetailedMessage(exception: unknown): string {
    if (exception instanceof Error) {
      return exception.message;
    }
    return String(exception);
  }

  private getStack(exception: unknown): string | undefined {
    if (exception instanceof Error) {
      return exception.stack;
    }
    return undefined;
  }
}
