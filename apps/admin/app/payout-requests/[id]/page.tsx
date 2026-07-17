import { PayoutRequestDetail } from "../../../components/features/payout-requests/PayoutRequestDetail";

type PayoutRequestDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PayoutRequestDetailPage({
  params,
}: PayoutRequestDetailPageProps) {
  const { id } = await params;
  return <PayoutRequestDetail id={id} />;
}
