"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiClient } from "../../../hooks/api/api-client";
import { useContentCategories } from "../../../hooks/api/use-creator-appearance";
import { QUERY_KEY } from "../../../utils/constants";
import {
  DetailsSection,
  DetailsSectionBody,
  DetailsSectionHeader,
  DetailsSectionTitle,
} from "../viewers/Viewers.styles";
import {
  Field,
  FieldLabel,
  FieldHint,
  SelectInput,
  PrimaryButton,
  SecondaryButton,
  AppearanceActions,
} from "./CreatorAppearanceSettings.styles";

export function ContentCategorySettings({
  contentId,
  creatorId,
  currentCategoryId,
}: {
  contentId: string;
  creatorId: string;
  currentCategoryId: string | null;
}) {
  const categories = useContentCategories();
  const queryClient = useQueryClient();
  const [categoryId, setCategoryId] = useState(currentCategoryId ?? "");
  const changed = categoryId !== (currentCategoryId ?? "");
  const update = useMutation({
    mutationFn: async () => {
      const result = await apiClient(`/content/admin/category/${contentId}`, {
        method: "PATCH",
        body: JSON.stringify({ categoryId }),
      });
      if (!result.success)
        throw new Error(result.message || "Failed to update category");
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.CONTENT_ENGAGEMENT, contentId],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.CREATOR_CONTENTS, creatorId],
        }),
      ]);
      toast.success("Content category updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });
  return (
    <DetailsSection>
      <DetailsSectionHeader>
        <DetailsSectionTitle>Content category</DetailsSectionTitle>
      </DetailsSectionHeader>
      <DetailsSectionBody>
        <Field>
          <FieldLabel id="content-category-label">Category</FieldLabel>
          <SelectInput
            aria-labelledby="content-category-label"
            value={categoryId}
            disabled={
              categories.isLoading || categories.isError || update.isPending
            }
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="" disabled>
              Select a category
            </option>
            {currentCategoryId &&
              !categories.data?.some(
                (item) => item.id === currentCategoryId,
              ) && (
                <option value={currentCategoryId}>
                  Current category (unavailable)
                </option>
              )}
            {(categories.data ?? []).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </SelectInput>
          <FieldHint>Choose one category for this content.</FieldHint>
        </Field>
        {categories.isError && (
          <FieldHint role="alert">
            Failed to load categories.{" "}
            <button type="button" onClick={() => categories.refetch()}>
              Retry
            </button>
          </FieldHint>
        )}
        <AppearanceActions>
          <SecondaryButton
            disabled={!changed || update.isPending}
            onClick={() => setCategoryId(currentCategoryId ?? "")}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            disabled={
              !changed ||
              !categoryId ||
              update.isPending ||
              categories.isLoading ||
              categories.isError
            }
            onClick={() => update.mutate()}
          >
            {update.isPending ? "Saving…" : "Update category"}
          </PrimaryButton>
        </AppearanceActions>
      </DetailsSectionBody>
    </DetailsSection>
  );
}
