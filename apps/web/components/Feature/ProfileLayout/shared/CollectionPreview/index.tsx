"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useProfileHomeCollections } from "@/hooks/useProfileHomeCollections";
import { LeftIcon } from "@/assets/icons";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import {
  SectionHeader,
  SectionLabel,
  SectionLink,
} from "@/components/Feature/TutorialVideos/TutorialContent/styles";
import { MonoText } from "@/components/UI/Monotext";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useCreatorProfileUi } from "@/hooks/useCreatorChannelLayout";
import { matchesProfileSearch } from "@/utils/creatorChannel";
import { type TutorialVideo } from "@/utils/types";
import { VARIANT } from "@/utils/Constants";
import { usePublicCreatorContent } from "@/hooks/creators/usePublicCreatorContent";
import { pathPublishedContent } from "@/utils/path";
import {
  CollectionSection,
  CollectionSectionTag,
  FourColumnGrid,
} from "./styles";
import { ProfileLayoutVariant } from "../../config";

type Props = {
  variant: ProfileLayoutVariant;
};

function PrivateCollectionPreview({
  variant,
  searchQuery,
  displayName,
}: {
  variant: ProfileLayoutVariant;
  searchQuery: string;
  displayName: string;
}) {
  const { data: sections = [] } = useProfileHomeCollections(displayName);

  const visibleSections = useMemo(() => {
    const limited = sections.slice(0, 4);
    if (!searchQuery.trim()) return limited;

    return limited
      .map((section) => ({
        ...section,
        cards: section.cards.filter((card) =>
          matchesProfileSearch(searchQuery, card.title),
        ),
      }))
      .filter((section) => section.cards.length > 0);
  }, [searchQuery, sections]);

  if (!visibleSections.length) return null;

  return (
    <>
      {visibleSections.map((collection) => (
        <CollectionSection key={collection.id} $variant={variant}>
          <SectionHeader>
            <SectionLabel>
              <CollectionSectionTag>
                <MonoText $use="H4_Medium">{collection.name}</MonoText>
              </CollectionSectionTag>
            </SectionLabel>
            <SectionLink href={`/single-collection?id=${collection.id}`}>
              <LeftIcon />
            </SectionLink>
          </SectionHeader>
          <FourColumnGrid>
            {collection.cards.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </FourColumnGrid>
        </CollectionSection>
      ))}
    </>
  );
}

function PublicCollectionPreview({
  variant,
  publicCreatorId,
  searchQuery,
  seeContentLabel,
}: {
  variant: ProfileLayoutVariant;
  publicCreatorId: string;
  searchQuery: string;
  seeContentLabel: string;
}) {
  const { t } = useTranslation();
  const { tutorials, isLoading } = usePublicCreatorContent(publicCreatorId);

  const cardsWithSeeContent = useMemo((): TutorialVideo[] => {
    return tutorials.map((tutorial) => {
      if (tutorial.isFree) {
        return {
          ...tutorial,
          buttons: [
            {
              label: seeContentLabel,
              variant: VARIANT.SECONDARY,
              href: pathPublishedContent(tutorial.id),
            },
          ],
        };
      }
      return tutorial;
    });
  }, [tutorials, seeContentLabel]);

  const visibleCards = useMemo((): TutorialVideo[] => {
    if (!searchQuery.trim()) return cardsWithSeeContent;
    return cardsWithSeeContent.filter((card) =>
      matchesProfileSearch(searchQuery, card.title),
    );
  }, [cardsWithSeeContent, searchQuery]);

  if (isLoading || !visibleCards.length) return null;

  return (
    <CollectionSection $variant={variant}>
      <SectionHeader>
        <SectionLabel>
          <CollectionSectionTag>
            <MonoText $use="H4_Medium">
              {t("createProfileHome.latestUpload.seeContent")}
            </MonoText>
          </CollectionSectionTag>
        </SectionLabel>
      </SectionHeader>
      <FourColumnGrid>
        {visibleCards.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </FourColumnGrid>
    </CollectionSection>
  );
}

export default function CollectionPreview({ variant }: Props) {
  const { t } = useTranslation();
  const { searchQuery } = useCreatorProfileUi();
  const { displayName, isPublicView, publicCreatorId } =
    useCreatorChannelProfile();

  if (isPublicView && publicCreatorId) {
    return (
      <PublicCollectionPreview
        variant={variant}
        publicCreatorId={publicCreatorId}
        searchQuery={searchQuery}
        seeContentLabel={t("createProfileHome.latestUpload.seeContent")}
      />
    );
  }

  return (
    <PrivateCollectionPreview
      variant={variant}
      searchQuery={searchQuery}
      displayName={displayName}
    />
  );
}
