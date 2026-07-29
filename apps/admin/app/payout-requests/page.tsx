import { redirect } from "next/navigation";
import { payoutTabHref } from "../../utils/payout";

export default function PayoutRequestsPage() {
  redirect(payoutTabHref("requests"));
}
