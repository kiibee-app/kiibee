"use client";

import { useState, type ReactNode, type MouseEvent } from "react";
import AccessGate, {
  CreatorAccessGrantedModal,
} from "@/components/Feature/AccessGate";
import { GenericModal, LoginRequiredModal } from "@/components/UI/Modals";
import { useCreatorAccessGate } from "@/hooks/useCreatorAccessGate";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";

/** Keep the catalog visible and request channel access only on interaction. */
export default function CreatorBrowseGate({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { displayName } = useCreatorChannelProfile();
  const gate = useCreatorAccessGate();

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof Element)) return;
    if (
      !event.target.closest(
        "[data-channel-access-trigger], [data-creator-content-button]",
      )
    )
      return;
    if (!gate.gateType && !gate.isLoading) return;
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <div style={{ display: "contents" }} onClickCapture={handleClick}>
        {children}
      </div>
      <GenericModal
        visible={isOpen && Boolean(gate.gateType)}
        onClose={() => setIsOpen(false)}
        width="440px"
        backgroundColor="#ffffff"
        padding="48px 28px 28px"
        borderRadius="20px"
        contentMarginBottom="0"
      >
        {gate.gateType && (
          <AccessGate
            type={gate.gateType}
            accessBoxText={gate.accessBoxText}
            paymentOptions={gate.paymentOptions}
            variant="content"
            creatorName={displayName ?? undefined}
            onSuccess={async (value, name) => {
              const success = await gate.handleSuccess(value, name);
              if (success) setIsOpen(false);
              return success;
            }}
          />
        )}
      </GenericModal>
      <LoginRequiredModal
        visible={gate.isLoginModalVisible}
        onClose={gate.closeLoginModal}
      />
      <CreatorAccessGrantedModal
        visible={gate.showAccessGranted}
        onClose={gate.closeAccessGranted}
      />
    </>
  );
}
