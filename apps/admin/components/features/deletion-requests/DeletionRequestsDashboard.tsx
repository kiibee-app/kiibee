"use client";

import { useState } from "react";
import type { DeletionRequestsTab } from "../../../types/creator-deletion-request";
import { deletionRequestsTabs } from "../../../utils/deletionRequests";
import {
  AllCreatorsHeader,
  AllCreatorsLayout,
  AllCreatorsTabButton,
  AllCreatorsTabs,
} from "../all-creators/AllCreators.styles";
import { DeletionHistoryList } from "./DeletionHistoryList";
import { DeletionRequestsList } from "./DeletionRequestsList";

export function DeletionRequestsDashboard() {
  const [activeTab, setActiveTab] = useState<DeletionRequestsTab>("requests");

  return (
    <AllCreatorsLayout>
      <AllCreatorsHeader>
        <AllCreatorsTabs>
          {deletionRequestsTabs.map((tab) => (
            <AllCreatorsTabButton
              key={tab.key}
              type="button"
              $active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </AllCreatorsTabButton>
          ))}
        </AllCreatorsTabs>
      </AllCreatorsHeader>

      {activeTab === "requests" ? <DeletionRequestsList /> : null}
      {activeTab === "history" ? <DeletionHistoryList /> : null}
    </AllCreatorsLayout>
  );
}
