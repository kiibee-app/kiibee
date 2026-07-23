"use client";

import React, { useState } from "react";
import { Avatar, AvatarEditButton } from "./styles";
import { EditProfileIcon } from "@/assets/icons";
import ImageUploadCropModal from "@/components/UI/ImageUploadCropModal";
import { BUTTON } from "@/utils/Constants";
import CreatorChannelAvatar from "@/components/Feature/ProfileLayout/shared/CreatorChannelAvatar";

type Props = {
  image: string | null;
  fallback: string;
  alt: string;
  uploadTitle: string;
  editTitle: string;
  onChange: (image: string) => void;
};

export default function ImageUploader({
  image,
  fallback,
  alt,
  uploadTitle,
  editTitle,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Avatar
        $hasImage={Boolean(image)}
        onClick={() => setOpen(true)}
        role={BUTTON}
        tabIndex={0}
      >
        <CreatorChannelAvatar
          avatarUrl={image}
          initial={fallback}
          alt={alt}
          sizes="(max-width: 767px) 88px, 120px"
          fit="contain"
        />

        <AvatarEditButton
          type={BUTTON}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <EditProfileIcon width={36} height={36} />
        </AvatarEditButton>
      </Avatar>

      <ImageUploadCropModal
        visible={open}
        titleUpload={uploadTitle}
        titleEdit={editTitle}
        image={image}
        onClose={() => setOpen(false)}
        onApply={onChange}
      />
    </>
  );
}
