import { HomeIcon } from "@/assets/icons/homeIcon";
import { LogoutIcon } from "@/assets/icons/logoutIcon";
import { QuestionIcon } from "@/assets/icons/questionIcon";
import { SettingsIcon } from "@/assets/icons/settingsIcon";
import { ShoppingBagIcon } from "@/assets/icons/shoppingBag";
import { UsersIcon } from "@/assets/icons/usersIcon";
import { HELP } from "@/utils/common";
import React from "react";

export const CREATORS_LABELS = {
  OVERVIEW: "Overview",
  CONTENTS: "Contents",
  USERS: "Users",
  SETTINGS: "Settings",
  HELP,
  LOG_OUT: "Logout",
  PROFILE: "profile",
} as const;

export type CreatorsLabel =
  (typeof CREATORS_LABELS)[keyof typeof CREATORS_LABELS];

export const CREATOR_SECTIONS = {
  TOP: "top",
  BOTTOM: "bottom",
} as const;

export type CreatorSection =
  (typeof CREATOR_SECTIONS)[keyof typeof CREATOR_SECTIONS];

export const CREATOR_VARIANTS = {
  DANGER: "danger",
} as const;

export type CreatorVariant =
  (typeof CREATOR_VARIANTS)[keyof typeof CREATOR_VARIANTS];

type CreatorItem = {
  label: CreatorsLabel;
  icon?: React.ReactNode;
  section: CreatorSection;
  variant?: CreatorVariant;
};

export const creatorsItems: CreatorItem[] = [
  {
    label: CREATORS_LABELS.OVERVIEW,
    icon: <HomeIcon />,
    section: CREATOR_SECTIONS.TOP,
  },
  {
    label: CREATORS_LABELS.CONTENTS,
    icon: <ShoppingBagIcon />,
    section: CREATOR_SECTIONS.TOP,
  },
  {
    label: CREATORS_LABELS.USERS,
    icon: <UsersIcon />,
    section: CREATOR_SECTIONS.TOP,
  },

  {
    label: CREATORS_LABELS.SETTINGS,
    icon: <SettingsIcon />,
    section: CREATOR_SECTIONS.BOTTOM,
  },
  {
    label: CREATORS_LABELS.HELP,
    icon: <QuestionIcon />,
    section: CREATOR_SECTIONS.BOTTOM,
  },
  {
    label: CREATORS_LABELS.LOG_OUT,
    icon: <LogoutIcon />,
    section: CREATOR_SECTIONS.BOTTOM,
    variant: CREATOR_VARIANTS.DANGER,
  },
];

export const HELP_MENU_ITEMS = [
  { label: "Help videos", href: "/tutorial-videos" },
  { label: "User manual", href: "/support" },
  { label: "Conditions", href: "/terms-of-service" },
] as const;

export type HelpMenuItem = (typeof HELP_MENU_ITEMS)[number];
