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

  const initials =
    String(payload.fullName ?? "")
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  return (
    <Page>
      <HeroCard>
        <HeroLeft>
          <Avatar>{initials}</Avatar>
          <HeroIdentity>
            <Name>{String(payload.fullName ?? PLACEHOLDER)}</Name>
            <Email>{String(payload.email ?? PLACEHOLDER)}</Email>
            <Badge $tone="blue">
              <Shield size={15} />
              {String(payload.role ?? PLACEHOLDER)}
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
            <Label>Full Name</Label>
            <Value>{String(payload.fullName ?? PLACEHOLDER)}</Value>
          </Field>

          <Field>
            <Label>Email</Label>
            <Value>{String(payload.email ?? PLACEHOLDER)}</Value>
          </Field>

          <Field style={{ borderBottom: "none" }}>
            <FieldTop>
              <Label>Email Verification</Label>
              <Badge $tone={payload.isEmailVerified ? "green" : "amber"}>
                {payload.isEmailVerified ? (
                  <>
                    <CircleCheck size={15} />
                    Verified
                  </>
                ) : (
                  "Not Verified"
                )}
              </Badge>
            </FieldTop>
          </Field>
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
                  navigator.clipboard.writeText(String(payload.id ?? ""))
                }
              >
                <Copy size={14} />
              </IconAction>
            </FieldTop>
            <Value>{String(payload.id ?? PLACEHOLDER)}</Value>
          </Field>

          <Field>
            <Label>Role</Label>
            <Value>{String(payload.role ?? PLACEHOLDER)}</Value>
          </Field>

          <Field style={{ borderBottom: "none" }}>
            <Label>Status</Label>
            <Badge $tone="amber">
              <Shield size={15} />
              {String(payload.status ?? PLACEHOLDER)}
            </Badge>
            <StatusText style={{ marginTop: 8 }}>
              This page only shows essential account details to keep profile
              management clean and focused.
            </StatusText>
          </Field>
        </Card>
      </Grid>
    </Page>
  );
}
