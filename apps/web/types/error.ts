export type AppError = Error & { digest?: string };

export type ErrorProps = {
  error: AppError;
  reset: () => void;
};

export type ErrorFallbackProps = {
  title?: string;
  error: AppError;
  resetErrorBoundary: () => void;
};
