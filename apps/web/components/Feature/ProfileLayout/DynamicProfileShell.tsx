"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import ProfileShell from "@/components/Feature/ProfileLayout/Shell";
import { useCreatorPublicProfile } from "@/hooks/creators/useExploreCreators";
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";
import {
  DEFAULT_CREATOR_LAYOUT,
  layoutParamFromKey,
  isCreatorLayoutKey,
  isCreatorLayoutParam,
} from "@/utils/creatorChannel";
import GenericSpinner from "@/components/UI/GenericSpinner";
import {
  SectionWrapper,
  ContentAdjust,
} from "@/components/Feature/ProfileLayout/HomeSections/styles";
import { ProfileLoadingWrapper } from "@/components/Feature/ProfileLayout/pageStyles";

import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";

export default function DynamicProfileShell({
  children,
  render,
  hideHero,
}: {
  children?: React.ReactNode;
  render?: (layout: ProfileLayoutVariant) => React.ReactNode;
  hideHero?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const raw = params?.creatorSlug;
  const creatorSlug = Array.isArray(raw) ? raw[0] : raw;

  const { creator, isLoading } = useCreatorPublicProfile(creatorSlug ?? null);

  useEffect(() => {
    if (
      isLoading ||
      !creatorSlug ||
      !creator?.slug ||
      creatorSlug === creator.slug
    ) {
      return;
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 1 && segments[0] === creatorSlug) {
      router.replace(getPublicCreatorProfilePath(creator.slug));
    } else if (
      segments.length === 2 &&
      segments[0] === creatorSlug &&
      segments[1] === "collections"
    ) {
      router.replace(
        `${getPublicCreatorProfilePath(creator.slug)}/collections`,
      );
    }
  }, [creator?.slug, creatorSlug, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <SectionWrapper>
        <ContentAdjust>
          <ProfileLoadingWrapper>
            <GenericSpinner size={48} />
          </ProfileLoadingWrapper>
        </ContentAdjust>
      </SectionWrapper>
    );
  }

  // Fallback to layout1 if not found or invalid
  let layout = layoutParamFromKey(DEFAULT_CREATOR_LAYOUT);

  if (creator?.layout && isCreatorLayoutKey(creator.layout)) {
    const parsedLayout = layoutParamFromKey(creator.layout);
    if (isCreatorLayoutParam(parsedLayout)) {
      layout = parsedLayout;
    }
  }

  return (
    <ProfileShell variant={layout} hideHero={hideHero}>
      {render ? render(layout) : children}
    </ProfileShell>
  );
}
