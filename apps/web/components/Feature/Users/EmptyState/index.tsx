"use client";

import {
  EmptyStateBox,
  EmptyStateDescription,
  EmptyStateTitle,
} from "./styles";

type UsersEmptyStateProps = {
  title: string;
  description: string;
};

export default function UsersEmptyState({
  title,
  description,
}: UsersEmptyStateProps) {
  return (
    <EmptyStateBox>
      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateDescription>{description}</EmptyStateDescription>
    </EmptyStateBox>
  );
}
