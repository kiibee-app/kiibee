import { useRouter } from "next/navigation";
import { useCreatePayout, useRejectPayoutRequest } from "../../../hooks/api";
import toast from "react-hot-toast";
import type { PayoutRequest } from "../../../types/payout-request";
import { payoutTabHref } from "../../../utils/payout";

export function usePayoutActions(request?: PayoutRequest | null) {
  const router = useRouter();
  const { mutate: createPayout, isPending: isApproving } = useCreatePayout();
  const { mutate: rejectPayoutRequest, isPending: isRejecting } =
    useRejectPayoutRequest();

  const handleApprove = () => {
    if (!request) return;

    createPayout(
      {
        requestId: request.id,
        creatorId: request.creatorId,
        amount: request.rawAmount,
        payoutId: request.payoutId,
        paymentMethodId: request.paymentMethodId,
      },
      {
        onSuccess: () => {
          toast.success("Payout successfully created and approved.");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to approve payout.");
        },
      },
    );
  };

  const handleReject = () => {
    if (!request) return;

    rejectPayoutRequest(request.id, {
      onSuccess: () => {
        toast.success("Payout request rejected.");
        router.replace(payoutTabHref("requests"));
      },
      onError: (err) => {
        toast.error(err.message || "Failed to reject payout request.");
      },
    });
  };

  return {
    handleApprove,
    handleReject,
    isApproving,
    isRejecting,
  };
}
