"use client";

import {
  Badge,
  ConsoleBlock,
  ConsoleLabel,
  Description,
  ErrorCard,
  ErrorPage,
  MessageBox,
  RetryButton,
  Title,
} from "./ErrorFallback.styles";

type AppError = Error & { digest?: string };

type ErrorFallbackProps = {
  title?: string;
  error: AppError;
  resetErrorBoundary: () => void;
};

export default function ErrorFallback({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
}: ErrorFallbackProps) {
  const stack = error.stack ?? "Stack trace is not available.";

  return (
    <ErrorPage>
      <ErrorCard role="alert">
        <Badge>Runtime Error</Badge>
        <Title>{title}</Title>
        <Description>
          An unexpected error occurred. You can retry now, and use the console
          details below for debugging.
        </Description>
        <MessageBox>{error.message || "Unknown error message"}</MessageBox>
        <ConsoleLabel>Console details</ConsoleLabel>
        <ConsoleBlock>
          {`name: ${error.name}\nmessage: ${error.message}\ndigest: ${error.digest ?? "n/a"}\n\nstack:\n${stack}`}
        </ConsoleBlock>
        <RetryButton type="button" onClick={resetErrorBoundary}>
          Try again
        </RetryButton>
      </ErrorCard>
    </ErrorPage>
  );
}
