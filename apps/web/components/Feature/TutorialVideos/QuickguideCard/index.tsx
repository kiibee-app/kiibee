"use client";

import { useState } from "react";
import GenericCard from "@/components/UI/GenericCard";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import ContentPreviewModal from "@/components/Feature/SingleContentPage/ContentPreviewModal";
import { FORMAT_TYPE } from "@/utils/types";
import type { TutorialQuickguideApiItem } from "@/utils/tutorialVideoMapper";

type QuickguideCardProps = {
  guide: TutorialQuickguideApiItem & { freeLabel: string };
};

export default function QuickguideCard({ guide }: QuickguideCardProps) {
  const [showPdf, setShowPdf] = useState(false);

  return (
    <>
      <GenericCard
        coverImage
        image={guide.thumbnailUrl ?? undefined}
        imageInitials={guide.thumbnailUrl ? undefined : "PDF"}
        alt={guide.title}
        title={<MonoText $use="Body_Medium">{guide.title}</MonoText>}
        subtitle={
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
            {guide.freeLabel}
          </MonoText>
        }
        onClick={() => setShowPdf(true)}
      />

      <ContentPreviewModal
        visible={showPdf}
        onClose={() => setShowPdf(false)}
        src={guide.pdfUrl}
        type={FORMAT_TYPE.PDF}
        title={guide.title}
      />
    </>
  );
}
