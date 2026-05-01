import { HomeIcon } from "@/assets/icons/homeIcon";
import { LogoutIcon } from "@/assets/icons/logoutIcon";
import { QuestionIcon } from "@/assets/icons/questionIcon";
import { SettingsIcon } from "@/assets/icons/settingsIcon";
import { ShoppingBagIcon } from "@/assets/icons/shoppingBag";
import { UsersIcon } from "@/assets/icons/usersIcon";
import React from "react";
import { HELP } from "./common";

export const CREATORS_LABELS = {
  OVERVIEW: "Overview",
  CONTENTS: "Contents",
  USERS: "Users",
  SETTINGS: "Settings",
  HELP,
  LOG_OUT: "Logout",
  PROFILE: "profile",
} as const;

export const VIEWER_LABELS = {
  PURCHASED: "Purchased",
  CURRENTLY_RENTED: "Currently Rented",
  PREVIOUSLY_RENTED: "Previously Rented",
  BILLINGS: "Billings",
  MY_PROFILE: "My Profile",
  LOG_OUT: "Logout",
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

export type DashboardSidebarItem = {
  label: string;
  icon?: React.ReactNode;
  section: CreatorSection;
  variant?: CreatorVariant;
};

export type ViewerLabel = (typeof VIEWER_LABELS)[keyof typeof VIEWER_LABELS];

export const VIEWER_VIEW_VALUES = {
  PURCHASED: "purchased",
  CURRENTLY_RENTED: "currently-rented",
  PREVIOUSLY_RENTED: "previously-rented",
  BILLINGS: "billings",
  MY_PROFILE: "my-profile",
} as const;

export type ViewerViewValue =
  (typeof VIEWER_VIEW_VALUES)[keyof typeof VIEWER_VIEW_VALUES];

export const VIEWER_LABEL_TO_VIEW: Record<ViewerLabel, ViewerViewValue> = {
  [VIEWER_LABELS.PURCHASED]: VIEWER_VIEW_VALUES.PURCHASED,
  [VIEWER_LABELS.CURRENTLY_RENTED]: VIEWER_VIEW_VALUES.CURRENTLY_RENTED,
  [VIEWER_LABELS.PREVIOUSLY_RENTED]: VIEWER_VIEW_VALUES.PREVIOUSLY_RENTED,
  [VIEWER_LABELS.BILLINGS]: VIEWER_VIEW_VALUES.BILLINGS,
  [VIEWER_LABELS.MY_PROFILE]: VIEWER_VIEW_VALUES.MY_PROFILE,
  [VIEWER_LABELS.LOG_OUT]: VIEWER_VIEW_VALUES.PURCHASED,
};

export const VIEWER_VIEW_TO_LABEL: Record<ViewerViewValue, ViewerLabel> = {
  [VIEWER_VIEW_VALUES.PURCHASED]: VIEWER_LABELS.PURCHASED,
  [VIEWER_VIEW_VALUES.CURRENTLY_RENTED]: VIEWER_LABELS.CURRENTLY_RENTED,
  [VIEWER_VIEW_VALUES.PREVIOUSLY_RENTED]: VIEWER_LABELS.PREVIOUSLY_RENTED,
  [VIEWER_VIEW_VALUES.BILLINGS]: VIEWER_LABELS.BILLINGS,
  [VIEWER_VIEW_VALUES.MY_PROFILE]: VIEWER_LABELS.MY_PROFILE,
};

export const creatorsItems: DashboardSidebarItem[] = [
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

export const viewerItems: DashboardSidebarItem[] = [
  {
    label: VIEWER_LABELS.PURCHASED,
    section: CREATOR_SECTIONS.TOP,
  },
  {
    label: VIEWER_LABELS.CURRENTLY_RENTED,
    section: CREATOR_SECTIONS.TOP,
  },
  {
    label: VIEWER_LABELS.PREVIOUSLY_RENTED,
    section: CREATOR_SECTIONS.TOP,
  },
  {
    label: VIEWER_LABELS.BILLINGS,
    section: CREATOR_SECTIONS.TOP,
  },
  {
    label: VIEWER_LABELS.MY_PROFILE,
    section: CREATOR_SECTIONS.TOP,
  },
  {
    label: VIEWER_LABELS.LOG_OUT,
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
