import { runInBackground } from 'src/utils/backgroundTask';
import { logger } from 'src/logger/logger';

jest.mock('src/logger/logger');

const mockLogger = logger as jest.Mocked<typeof logger>;

describe('runInBackground', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute successful task without callbacks', async () => {
    const mockTask = Promise.resolve('success');

    await runInBackground(mockTask);

    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('should execute task with success callback', async () => {
    const mockTask = Promise.resolve('success');
    const onSuccess = jest.fn();

    await runInBackground(mockTask, { onSuccess });

    expect(onSuccess).toHaveBeenCalledWith('success');
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('should handle task rejection and log error without onError callback', async () => {
    const mockError = new Error('Task failed');
    const mockTask = Promise.reject(mockError);

    await runInBackground(mockTask, { name: 'test-task' });
    await new Promise(process.nextTick); // Wait for microtasks

    expect(mockLogger.error).toHaveBeenCalledWith(
      '[BackgroundTask: test-task]',
      mockError,
    );
  });

  it('should handle task rejection with onError callback', async () => {
    const mockError = new Error('Task failed');
    const mockTask = Promise.reject(mockError);
    const onError = jest.fn();

    await runInBackground(mockTask, { onError });
    await new Promise(process.nextTick); // Wait for microtasks

    expect(onError).toHaveBeenCalledWith(mockError);
    expect(mockLogger.error).toHaveBeenCalledWith(
      '[BackgroundTask]',
      mockError,
    );
  });

  it('should handle both success and error callbacks', async () => {
    const mockError = new Error('Task failed');
    const mockTask = Promise.reject(mockError);
    const onSuccess = jest.fn();
    const onError = jest.fn();

    await runInBackground(mockTask, { onSuccess, onError, name: 'named-task' });
    await new Promise(process.nextTick); // Wait for microtasks

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(mockError);
    expect(mockLogger.error).toHaveBeenCalledWith(
      '[BackgroundTask: named-task]',
      mockError,
    );
  });

  it('should work with successful task and both callbacks', async () => {
    const mockTask = Promise.resolve('success');
    const onSuccess = jest.fn();
    const onError = jest.fn();

    await runInBackground(mockTask, { onSuccess, onError });

    expect(onSuccess).toHaveBeenCalledWith('success');
    expect(onError).not.toHaveBeenCalled();
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('should handle non-Error rejections', async () => {
    const mockTask = Promise.reject('string error');

    await runInBackground(mockTask);
    await new Promise(process.nextTick); // Wait for microtasks

    expect(mockLogger.error).toHaveBeenCalledWith(
      '[BackgroundTask]',
      'string error',
    );
  });
});
