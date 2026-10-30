"use client";

import { useEffect } from "react";
import { notFound, usePathname, useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import ProfileShell from "@/components/Feature/ProfileLayout/Shell";
import { useCreatorPublicProfile } from "@/hooks/creators/useExploreCreators";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { readStoredLoginUser } from "@/hooks/auth/useLogin";
import { isBrowser } from "@/utils/ui";
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

  useEffect(() => {
    if (typeof window === "undefined" || isLoading) return;

    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const rafId = requestAnimationFrame(resetScroll);
    const timeoutId = setTimeout(resetScroll, 100);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [isLoading, pathname]);

  const storedUser = useStoredLoginUser();
  const currentUserId =
    storedUser?.id || (isBrowser ? readStoredLoginUser()?.id : null);
  const isOwner = Boolean(
    currentUserId &&
    creator?.id &&
    String(currentUserId).trim() === String(creator.id).trim(),
  );
  const uploadCount = Number(creator?.uploadCount ?? 0);
  const hasPublishedPublicContent =
    Number.isFinite(uploadCount) && uploadCount > 0;

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

  if (!creator || (!hasPublishedPublicContent && !isOwner)) {
    notFound();
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
