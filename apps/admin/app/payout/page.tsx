import { Suspense } from "react";
import { PayoutDashboard } from "../../components/features/payout/PayoutDashboard";
import {
  AllCreatorsLayout,
  AllCreatorsPanel,
  AllCreatorsState,
} from "../../components/features/all-creators/AllCreators.styles";

export default function PayoutPage() {
  return (
    <Suspense
      fallback={
        <AllCreatorsLayout>
          <AllCreatorsPanel>
            <AllCreatorsState>Loading payout dashboard...</AllCreatorsState>
          </AllCreatorsPanel>
        </AllCreatorsLayout>
      }
    >
      <PayoutDashboard />
    </Suspense>
  );
}
