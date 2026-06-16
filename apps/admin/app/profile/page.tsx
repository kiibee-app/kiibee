"use client";

import { CircleCheck, Copy, Lock, Shield, UserRound } from "lucide-react";
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
import { useAdminProfile } from "../../hooks/api";

const PLACEHOLDER = "-";

function getDisplayName(
  fullName?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  email?: string,
) {
  const nameFromParts = [firstName, lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");

  if (fullName?.trim()) return fullName.trim();
  if (nameFromParts) return nameFromParts;
  if (email?.includes("@")) return email.split("@")[0];
  return PLACEHOLDER;
}

function getInitials(name: string, email?: string) {
  const source = name !== PLACEHOLDER ? name : email || "";

  return (
    source
      .split(/[\s@.]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD"
  );
}

export default function ProfilePage() {
  const profileQuery = useAdminProfile();
  const profile = profileQuery.data;
  const displayName = profileQuery.isLoading
    ? "Loading..."
    : getDisplayName(
        profile?.fullName,
        profile?.firstName,
        profile?.lastName,
        profile?.email,
      );
  const email = profile?.email ?? PLACEHOLDER;
  const role = profile?.role ?? PLACEHOLDER;
  const status = profile?.status ?? PLACEHOLDER;
  const initials = getInitials(displayName, profile?.email);

  return (
    <Page>
      <HeroCard>
        <HeroLeft>
          <Avatar>{initials}</Avatar>
          <HeroIdentity>
            <Name>{displayName}</Name>
            <Email>{email}</Email>
            <Badge $tone="blue">
              <Shield size={15} />
              {role}
            </Badge>
            {profileQuery.isError ? (
              <StatusText>
                {profileQuery.error?.message || "Failed to load admin profile."}
              </StatusText>
            ) : null}
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
            <Label>Full Name</Label>
            <Value>{displayName}</Value>
          </Field>

          <Field>
            <Label>Email</Label>
            <Value>{email}</Value>
          </Field>

          <FieldNoBorder>
            <FieldTop>
              <Label>Email Verification</Label>
              <Badge $tone={profile?.isEmailVerified ? "green" : "amber"}>
                {profile?.isEmailVerified ? (
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
                disabled={!profile?.id}
                onClick={() =>
                  navigator.clipboard.writeText(String(profile?.id ?? ""))
                }
                aria-label="Copy user ID"
              >
                <Copy size={14} />
              </IconAction>
            </FieldTop>
            <Value>{profile?.id ?? PLACEHOLDER}</Value>
          </Field>

          <Field>
            <Label>Role</Label>
            <Value>{role}</Value>
          </Field>

          <FieldNoBorder>
            <Label>Status</Label>
            <Badge $tone={status === "active" ? "green" : "amber"}>
              <Shield size={15} />
              {status}
            </Badge>
            <StatusText>
              {profile
                ? `Account is ${profile.isActive ? "active" : "inactive"} and ready for admin dashboard access.`
                : "Account details will appear after the profile loads."}
            </StatusText>
          </FieldNoBorder>
        </Card>
      </Grid>
    </Page>
  );
}
