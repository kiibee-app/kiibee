import { HomeIcon } from "@/assets/icons/homeIcon";
import { LogoutIcon } from "@/assets/icons/logoutIcon";
import { QuestionIcon } from "@/assets/icons/questionIcon";
import { SettingsIcon } from "@/assets/icons/settingsIcon";
import { ShoppingBagIcon } from "@/assets/icons/shoppingBag";
import { UsersIcon } from "@/assets/icons/usersIcon";
import React from "react";

export const CREATORS_LABELS = {
  OVERVIEW: "Overview",
  CONTENTS: "Contents",
  USERS: "Users",
  SETTINGS: "Settings",
  HELP: "Help",
  LOG_OUT: "Logout",
} as const;

export type CreatorsLabel =
  (typeof CREATORS_LABELS)[keyof typeof CREATORS_LABELS];

type CreatorItem = {
  label: CreatorsLabel;
  icon?: React.ReactNode;
  section: "top" | "bottom";
  variant?: "danger";
};

export const creatorsItems: CreatorItem[] = [
  { label: CREATORS_LABELS.OVERVIEW, icon: <HomeIcon />, section: "top" },
  {
    label: CREATORS_LABELS.CONTENTS,
    icon: <ShoppingBagIcon />,
    section: "top",
  },
  { label: CREATORS_LABELS.USERS, icon: <UsersIcon />, section: "top" },

  {
    label: CREATORS_LABELS.SETTINGS,
    icon: <SettingsIcon />,
    section: "bottom",
  },
  { label: CREATORS_LABELS.HELP, icon: <QuestionIcon />, section: "bottom" },
  {
    label: CREATORS_LABELS.LOG_OUT,
    icon: <LogoutIcon />,
    section: "bottom",
    variant: "danger",
  },
];
