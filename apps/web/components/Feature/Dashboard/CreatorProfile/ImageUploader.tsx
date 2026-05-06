"use client";

import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarEditButton } from "./styles";
import { EditProfileIcon } from "@/assets/icons";
import { MonoText } from "@/components/UI/Monotext";
import ImageUploadCropModal from "@/components/UI/ImageUploadCropModal";
import { BUTTON } from "@/utils/Constants";

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
      <Avatar onClick={() => setOpen(true)} role={BUTTON} tabIndex={0}>
        {image ? (
          <AvatarImage src={image} alt={alt} />
        ) : (
          <MonoText $use="Heading2">{fallback}</MonoText>
        )}

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
        key={image ?? null}
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
