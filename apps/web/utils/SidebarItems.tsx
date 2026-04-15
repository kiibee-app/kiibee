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
  { label: CREATORS_LABELS.OVERVIEW, icon: null, section: "top" },
  { label: CREATORS_LABELS.CONTENTS, icon: null, section: "top" },
  { label: CREATORS_LABELS.USERS, icon: null, section: "top" },

  { label: CREATORS_LABELS.SETTINGS, icon: null, section: "bottom" },
  { label: CREATORS_LABELS.HELP, icon: null, section: "bottom" },
  {
    label: CREATORS_LABELS.LOG_OUT,
    icon: null,
    section: "bottom",
    variant: "danger",
  },
];
