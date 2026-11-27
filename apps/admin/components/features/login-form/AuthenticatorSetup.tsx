"use client";

import { QRCodeSVG } from "qrcode.react";
import {
  Field,
  Label,
  SetupKey,
  Subtitle,
  QrCodeWrap,
  ManualSetup,
} from "./Login.styles";

export function AuthenticatorSetup({
  setupKey,
  email,
  accountName,
}: {
  setupKey: string;
  email: string;
  accountName?: string;
}) {
  const issuer = "Kiibee Admin";
  const params = new URLSearchParams({
    secret: setupKey,
    issuer,
    algorithm: "SHA1",
    digits: "6",
    period: "30",
  });
  const uri = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?${params.toString()}`;

  return (
    <Field>
      <QrCodeWrap>
        <QRCodeSVG
          value={uri}
          size={208}
          level="M"
          marginSize={4}
          title="Scan with Google Authenticator to set up your Kiibee admin account"
        />
      </QrCodeWrap>
      <ManualSetup>
        <summary>Can’t scan? Enter the setup key manually</summary>
        <Label>Account name</Label>
        <SetupKey>{accountName || `${issuer} (${email})`}</SetupKey>
        <Label>Your setup key</Label>
        <SetupKey>{setupKey}</SetupKey>
        <Subtitle>
          In Google Authenticator, choose Enter a setup key and select Time
          based.
        </Subtitle>
      </ManualSetup>
      <Subtitle>
        Keep this QR code and setup key private. Setup expires after 10 minutes.
      </Subtitle>
    </Field>
  );
}
