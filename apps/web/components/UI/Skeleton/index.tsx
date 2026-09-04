"use client";

import React from "react";
import {
  SkeletonBase,
  SkeletonImage,
  SkeletonTitle,
  SkeletonSubtitle,
  SkeletonDate,
  SkeletonVideo,
  SkeletonButton,
  SkeletonAvatar,
  SkeletonCreatorName,
  SkeletonCreatorSubs,
  SkeletonSectionHeader,
  SkeletonSectionTag,
  SkeletonImageWrapper,
  SkeletonVideoBox,
  SkeletonCardFooter,
  SkeletonCreatorCardWrapper,
} from "./styles";
import {
  Card as GenericCardWrapper,
  Content as GenericCardContent,
  CardHeader,
  CardTitleBlock,
  CardChildren,
  CardActions,
} from "@/components/UI/GenericCard/styles";
import { Avatar as CreatorAvatar } from "@/components/Feature/ExploreCreators/TopCreators/styles";
import { GENERIC_CARD_LAYOUT } from "@/utils/ui";

export default function Skeleton() {
  return <SkeletonBase />;
}

function TutorialCardSkeleton() {
  return (
    <GenericCardWrapper
      $coverImage={true}
      $minHeight={GENERIC_CARD_LAYOUT.CONTENT_MIN_HEIGHT}
    >
      <SkeletonImageWrapper
        $coverImage={true}
        $imageAspectRatio={GENERIC_CARD_LAYOUT.IMAGE_ASPECT_RATIO}
      >
        <SkeletonImage />
      </SkeletonImageWrapper>
      <GenericCardContent>
        <CardHeader>
          <CardTitleBlock>
            <SkeletonTitle />
            <SkeletonSubtitle />
          </CardTitleBlock>
          <SkeletonDate />
        </CardHeader>
        <CardActions>
          <CardChildren>
            <SkeletonVideoBox>
              <SkeletonVideo />
            </SkeletonVideoBox>
          </CardChildren>
          <SkeletonCardFooter>
            <SkeletonButton />
          </SkeletonCardFooter>
        </CardActions>
      </GenericCardContent>
    </GenericCardWrapper>
  );
}

function ExploreCreatorCardSkeleton() {
  return (
    <GenericCardWrapper
      $coverImage={true}
      $minHeight={GENERIC_CARD_LAYOUT.CREATOR_MIN_HEIGHT}
    >
      <SkeletonImageWrapper
        $coverImage={true}
        $imageAspectRatio={GENERIC_CARD_LAYOUT.IMAGE_ASPECT_RATIO}
      >
        <SkeletonImage />
      </SkeletonImageWrapper>
      <GenericCardContent>
        <CardHeader>
          <CardTitleBlock>
            <SkeletonTitle />
            <SkeletonSubtitle />
          </CardTitleBlock>
        </CardHeader>
        <CardActions>
          <SkeletonCardFooter>
            <SkeletonButton />
          </SkeletonCardFooter>
        </CardActions>
      </GenericCardContent>
    </GenericCardWrapper>
  );
}

function CreatorCardSkeleton() {
  return (
    <SkeletonCreatorCardWrapper>
      <CreatorAvatar>
        <SkeletonAvatar />
      </CreatorAvatar>
      <SkeletonCreatorName />
      <SkeletonCreatorSubs />
    </SkeletonCreatorCardWrapper>
  );
}

Skeleton.Card = TutorialCardSkeleton;
Skeleton.Creator = CreatorCardSkeleton;
Skeleton.ExploreCreator = ExploreCreatorCardSkeleton;
Skeleton.Header = SkeletonSectionHeader;
Skeleton.Tag = SkeletonSectionTag;
