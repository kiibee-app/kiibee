import { PayoutRequestDetail } from "../../../components/features/payout-requests/PayoutRequestDetail";

import { isPayoutTab } from "../../../utils/payout";

type PayoutRequestDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string | string[] }>;
};

export default async function PayoutRequestDetailPage({
  params,
  searchParams,
}: PayoutRequestDetailPageProps) {
  const [{ id }, { from }] = await Promise.all([params, searchParams]);
  const returnTab =
    typeof from === "string" && isPayoutTab(from) ? from : undefined;
  return <PayoutRequestDetail id={id} returnTab={returnTab} />;
}
