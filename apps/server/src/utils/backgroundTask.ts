import { logger } from 'src/logger/logger';

type BackgroundTaskOptions = {
  name?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
};

export const runInBackground = <T>(
  task: Promise<T>,
  options?: BackgroundTaskOptions,
) => {
  void task
    .then((result) => {
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
    })
    .catch((error) => {
      logger.error(
        `[BackgroundTask${options?.name ? `: ${options.name}` : ''}]`,
        error,
      );

      if (options?.onError) {
        options.onError(error);
      }
    });
};
