import { BillingHistory } from "@/components/features/billing-history/BillingHistory";

export default async function CreatorBillingHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BillingHistory creatorId={id} />;
}
