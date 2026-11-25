import type { PayoutRequest } from "../types/payout-request";

export type InvoiceFonts = { regular: string; semibold: string };

export function payoutInvoiceFilename(
  request: Pick<PayoutRequest, "fullName" | "createdAt">,
) {
  const creatorName =
    request.fullName
      .normalize("NFC")
      .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, " ")
      .trim()
      .replace(/[\s_-]+/g, "-")
      .slice(0, 100) || "Creator";
  const requestedDate = new Date(request.createdAt);
  const date = Number.isFinite(requestedDate.getTime())
    ? new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Europe/Copenhagen",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(requestedDate)
    : "undated";
  return `${creatorName}-payout-${date}.pdf`;
}

export async function createPayoutInvoicePdf(
  request: PayoutRequest,
  fonts: InvoiceFonts,
) {
  if (request.feeCalculationError)
    throw new Error(
      "Resolve the fee calculation before downloading this invoice.",
    );
  const values = [
    request.rawAmount,
    request.platformFee,
    request.processingFee,
    request.payableAmount,
  ];
  if (
    values.some(
      (value) =>
        value.trim() === "" ||
        !Number.isFinite(Number(value)) ||
        Number(value) < 0,
    )
  )
    throw new Error("This payout has incomplete financial details.");
  const [gross, platform, acquirer, net] = values.map((value) =>
    Math.round(Number(value) * 100),
  );
  if (gross - platform - acquirer !== net)
    throw new Error(
      "The payout amounts do not balance. Refresh the request before downloading.",
    );

  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  doc.addFileToVFS("RedditSans-Regular.ttf", fonts.regular);
  doc.addFont("RedditSans-Regular.ttf", "RedditSans", "normal");
  doc.addFileToVFS("RedditSans-SemiBold.ttf", fonts.semibold);
  doc.addFont("RedditSans-SemiBold.ttf", "RedditSans", "bold");
  doc.setProperties({
    title: `Payout invoice - ${request.id}`,
    author: "Kiibee",
    subject: "Payout and fee breakdown",
  });

  const left = 18,
    right = 192,
    width = right - left;
  const ink = "#20363D",
    muted = "#687B82",
    line = "#E2E9EA",
    teal = "#297C6E";
  let y = 24;
  const text = (
    value: string,
    x: number,
    top: number,
    size = 10,
    bold = false,
    color = ink,
    align: "left" | "right" = "left",
  ) => {
    doc.setFont("RedditSans", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
    doc.text(value, x, top, { align });
  };
  const rule = (top: number) => {
    doc.setDrawColor(line);
    doc.setLineWidth(0.25);
    doc.line(left, top, right, top);
  };
  const ensureSpace = (height: number) => {
    if (y + height <= 270) return;
    doc.addPage();
    y = 23;
    text("Kiibee / Payout invoice", left, y, 11, true);
    y += 12;
  };
  const wrapped = (
    value: string,
    maxWidth: number,
    size: number,
    bold = false,
  ): string[] => {
    doc.setFont("RedditSans", bold ? "bold" : "normal");
    doc.setFontSize(size);
    return doc.splitTextToSize(value, maxWidth);
  };
  const paragraph = (value: string, size = 10, bold = false, color = ink) => {
    for (const part of wrapped(value, width, size, bold)) {
      ensureSpace(6);
      text(part, left, y, size, bold, color);
      y += 5.5;
    }
  };
  const amount = (value: string | number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));
  const percentage = (ratio: number) =>
    new Intl.NumberFormat("en-US", {
      style: "percent",
      maximumFractionDigits: 2,
    }).format(ratio);
  const status =
    request.status.charAt(0).toUpperCase() + request.status.slice(1);

  text("Kiibee", left, y, 25, true, teal);
  text("PAYOUT INVOICE", right, y - 1, 17, true, ink, "right");
  text(`Status: ${status}`, right, y + 8, 10, false, muted, "right");
  y += 20;
  rule(y);
  y += 14;
  text("CREATOR", left, y, 8, true, muted);
  y += 8;
  paragraph(request.fullName || "Unknown creator", 15, true);
  paragraph(request.email || "Email unavailable", 10, false, muted);
  y += 9;

  ensureSpace(65);
  text("BANK DETAILS", left, y, 8, true, muted);
  y += 8;
  for (const [label, value] of [
    ["Account holder", request.bankDetails?.accountHolderName],
    ["Bank", request.bankDetails?.bankName],
    ["Registration number", request.bankDetails?.registrationNumber],
    ["Account number", request.bankDetails?.accountNumber],
  ]) {
    const parts = wrapped(value || "Not recorded", width - 43, 9);
    ensureSpace(parts.length * 5 + 7);
    text(label!, left, y, 9, false, muted);
    for (const part of parts) {
      text(part, left + 43, y, 9);
      y += 5;
    }
    y += 3;
  }
  y += 7;

  const requestedDate = new Date(request.createdAt);
  const date = Number.isFinite(requestedDate.getTime())
    ? new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Copenhagen",
        timeZoneName: "short",
      }).format(requestedDate)
    : "Not recorded";
  for (const [label, value] of [
    ["Payout reference", request.payoutId],
    ["Requested on", date],
  ]) {
    const parts = wrapped(value, width - 43, 9);
    ensureSpace(parts.length * 5 + 7);
    text(label, left, y, 9, false, muted);
    for (const part of parts) {
      text(part, left + 43, y, 9);
      y += 5;
    }
    y += 5;
  }
  y += 5;
  ensureSpace(103);
  text("Payout breakdown", left, y, 13, true);
  y += 12;
  doc.setFillColor("#F3F6F6");
  doc.rect(left, y - 6, width, 10, "F");
  text("Description", left + 4, y, 8, true, muted);
  text("Calculation", left + 59, y, 8, true, muted);
  text(`Amount (${request.currency})`, right - 4, y, 8, true, muted, "right");
  y += 13;

  const breakdown = request.feeBreakdown;
  const saleCount = breakdown?.saleCount;
  const effectiveRate =
    Number(request.rawAmount) > 0
      ? Number(request.processingFee) / Number(request.rawAmount)
      : null;
  const acquirerRate = breakdown?.processingFeePercentage ?? effectiveRate;
  const platformCalculation =
    breakdown?.fixedPlatformFee != null
      ? saleCount != null
        ? `${saleCount} × ${amount(breakdown.fixedPlatformFee)} ${request.currency}`
        : "Sale count not recorded"
      : breakdown
        ? `${amount(request.rawAmount)} × ${percentage(breakdown.platformFeePercentage)}`
        : "Per-sale details not recorded";
  const acquirerCalculation =
    acquirerRate != null
      ? `${amount(request.rawAmount)} × ${percentage(acquirerRate)}${breakdown ? "" : " effective"}`
      : "Rate not recorded";
  const rows = [
    [
      "Gross sales",
      saleCount != null ? `${saleCount} sales` : "Sale count not recorded",
      amount(request.rawAmount),
    ],
    ["Kiibee fee", platformCalculation, `-${amount(request.platformFee)}`],
    ["Acquirer fee", acquirerCalculation, `-${amount(request.processingFee)}`],
  ];
  for (const [label, calculation, value] of rows) {
    const parts = wrapped(calculation, 66, 8.5);
    const height = Math.max(16, parts.length * 4.5 + 8);
    ensureSpace(height + 5);
    text(label, left + 4, y, 10);
    parts.forEach((part, index) =>
      text(part, left + 59, y + index * 4.5, 8.5, false, muted),
    );
    text(value, right - 4, y, 10, true, ink, "right");
    y += height;
    rule(y - 7);
  }
  y += 1;
  ensureSpace(30);
  doc.setFillColor("#EAF5F2");
  doc.roundedRect(left, y - 5, width, 20, 2, 2, "F");
  text("Net payout", left + 5, y + 7, 11, true);
  text(
    `${amount(request.payableAmount)} ${request.currency}`,
    right - 5,
    y + 7,
    17,
    true,
    teal,
    "right",
  );
  y += 26;
  if (request.status === "pending")
    paragraph(
      "Pending payout - payment has not been completed.",
      9,
      false,
      muted,
    );
  if (request.status === "rejected")
    paragraph("This payout request was rejected.", 9, false, muted);
  if (!breakdown)
    paragraph(
      "Sale count and per-sale details were not recorded for this payout. Amounts reflect the saved payout record.",
      8.5,
      false,
      muted,
    );

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    rule(281);
    text("Kiibee / Payout invoice", left, 288, 8, false, muted);
    text(`Page ${page} of ${pages}`, right, 288, 8, false, muted, "right");
  }
  return doc;
}

let fontsPromise: Promise<InvoiceFonts> | undefined;
async function loadFonts(): Promise<InvoiceFonts> {
  if (!fontsPromise) {
    fontsPromise = Promise.all(
      ["Regular", "SemiBold"].map(async (weight) => {
        const response = await fetch(`/fonts/RedditSans-${weight}.ttf`);
        if (!response.ok)
          throw new Error("Could not load invoice fonts. Please try again.");
        const bytes = new Uint8Array(await response.arrayBuffer());
        let binary = "";
        for (let start = 0; start < bytes.length; start += 32768)
          binary += String.fromCharCode(
            ...bytes.subarray(start, start + 32768),
          );
        return btoa(binary);
      }),
    )
      .then(([regular, semibold]) => ({ regular, semibold }))
      .catch((error) => {
        fontsPromise = undefined;
        throw error;
      });
  }
  return fontsPromise;
}

export async function downloadPayoutInvoice(request: PayoutRequest) {
  const doc = await createPayoutInvoicePdf(request, await loadFonts());
  await doc.save(payoutInvoiceFilename(request), { returnPromise: true });
}
