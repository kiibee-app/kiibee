"use client";

import React from "react";
import {
  SkeletonBase,
  SkeletonImage,
  SkeletonCategory,
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
  CardChildren,
} from "@/components/UI/GenericCard/styles";
import { Avatar as CreatorAvatar } from "@/components/Feature/ExploreCreators/TopCreators/styles";

export default function Skeleton() {
  return (
    <SkeletonBase
      style={{ width: "100%", height: "100%", borderRadius: "8px" }}
    />
  );
}

function TutorialCardSkeleton() {
  return (
    <GenericCardWrapper $coverImage={true}>
      <SkeletonImageWrapper $coverImage={true}>
        <SkeletonImage />
      </SkeletonImageWrapper>
      <GenericCardContent>
        <CardHeader>
          <SkeletonCategory />
          <SkeletonTitle />
          <SkeletonSubtitle />
        </CardHeader>
        <CardChildren>
          <SkeletonDate />
          <SkeletonVideoBox>
            <SkeletonVideo />
          </SkeletonVideoBox>
        </CardChildren>
      </GenericCardContent>
      <SkeletonCardFooter>
        <SkeletonButton />
      </SkeletonCardFooter>
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
Skeleton.Header = SkeletonSectionHeader;
Skeleton.Tag = SkeletonSectionTag;
