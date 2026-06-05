"use client";

import { CircleCheck, Copy, Lock, Shield, UserRound } from "lucide-react";
import { decodeToken, getAccessToken } from "../../utils/token";
import {
  Avatar,
  Badge,
  Card,
  CardHeader,
  CardSubtitle,
  CardTitle,
  Email,
  Field,
  FieldNoBorder,
  FieldTop,
  Grid,
  HeroCard,
  HeroIdentity,
  HeroLeft,
  IconAction,
  IconBubble,
  Label,
  Name,
  Page,
  StatusText,
  Value,
} from "./styles";

type StoredAuthPayload = {
  id?: string;
  fullName?: string;
  email?: string;
  role?: string;
  status?: string;
  isEmailVerified?: boolean;
  [key: string]: unknown;
};

const PLACEHOLDER = "-";

export default function ProfilePage() {
  const payload: StoredAuthPayload =
    typeof window === "undefined"
      ? {}
      : (() => {
          const fromStorage = window.localStorage.getItem("admin.authPayload");
          if (!fromStorage) return {};

          try {
            return JSON.parse(fromStorage) as StoredAuthPayload;
          } catch {
            return {};
          }
        })();
  const tokenPayload = payload.email
    ? null
    : decodeToken(getAccessToken() ?? "");
  const profilePayload: StoredAuthPayload = payload.email
    ? payload
    : {
        id: tokenPayload?.sub,
        email: tokenPayload?.email,
        role: tokenPayload?.role,
      };

  const initials =
    String(profilePayload.fullName || profilePayload.email?.split("@")[0] || "")
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";
  const currentName =
    profilePayload.fullName?.trim() ||
    (profilePayload.email?.includes("@")
      ? profilePayload.email.split("@")[0]
      : profilePayload.email) ||
    PLACEHOLDER;

  return (
    <Page>
      <HeroCard>
        <HeroLeft>
          <Avatar>{initials}</Avatar>
          <HeroIdentity>
            <Name>{currentName}</Name>
            <Email>{String(profilePayload.email ?? PLACEHOLDER)}</Email>
            <Badge $tone="blue">
              <Shield size={15} />
              {String(profilePayload.role ?? PLACEHOLDER)}
            </Badge>
          </HeroIdentity>
        </HeroLeft>
      </HeroCard>

      <Grid>
        <Card>
          <CardHeader>
            <IconBubble $tone="blue">
              <UserRound size={18} />
            </IconBubble>
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardSubtitle>Your basic personal details.</CardSubtitle>
            </div>
          </CardHeader>

          <Field>
            <Label>Current Name</Label>
            <Value>{currentName}</Value>
          </Field>

          <Field>
            <Label>Email</Label>
            <Value>{String(profilePayload.email ?? PLACEHOLDER)}</Value>
          </Field>

          <FieldNoBorder>
            <FieldTop>
              <Label>Email Verification</Label>
              <Badge $tone={profilePayload.isEmailVerified ? "green" : "amber"}>
                {profilePayload.isEmailVerified ? (
                  <>
                    <CircleCheck size={15} />
                    Verified
                  </>
                ) : (
                  "Not Verified"
                )}
              </Badge>
            </FieldTop>
          </FieldNoBorder>
        </Card>

        <Card>
          <CardHeader>
            <IconBubble $tone="purple">
              <Lock size={18} />
            </IconBubble>
            <div>
              <CardTitle>Account Details</CardTitle>
              <CardSubtitle>Your account and security details.</CardSubtitle>
            </div>
          </CardHeader>

          <Field>
            <FieldTop>
              <Label>User ID</Label>
              <IconAction
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(String(profilePayload.id ?? ""))
                }
              >
                <Copy size={14} />
              </IconAction>
            </FieldTop>
            <Value>{String(profilePayload.id ?? PLACEHOLDER)}</Value>
          </Field>

          <Field>
            <Label>Role</Label>
            <Value>{String(profilePayload.role ?? PLACEHOLDER)}</Value>
          </Field>

          <FieldNoBorder>
            <Label>Status</Label>
            <Badge $tone="amber">
              <Shield size={15} />
              {String(profilePayload.status ?? PLACEHOLDER)}
            </Badge>
            <StatusText>
              This page only shows essential account details to keep profile
              management clean and focused.
            </StatusText>
          </FieldNoBorder>
        </Card>
      </Grid>
    </Page>
  );
}
