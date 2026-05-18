import { GenericModal } from "@/components/UI/Modals";
import { SuccessArcIcon } from "@/assets/icons";
import COLORS from "@repo/ui/colors";
import { useTranslation } from "react-i18next";

type DeleteModalsProps = {
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteSuccess: boolean;
  setShowDeleteSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirmDelete: () => void;
};

export default function DeleteModals({
  showDeleteConfirm,
  setShowDeleteConfirm,
  showDeleteSuccess,
  setShowDeleteSuccess,
  onConfirmDelete,
}: DeleteModalsProps) {
  const { t } = useTranslation();
  return (
    <>
      <GenericModal
        visible={showDeleteConfirm}
        title={t("contents.deleteModal.title")}
        message={t("contents.deleteModal.message")}
        cancelLabel={t("contents.deleteModal.cancel")}
        confirmLabel={t("contents.deleteModal.delete")}
        onCancel={() => setShowDeleteConfirm(false)}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={onConfirmDelete}
        size="sm"
        spacing="xs"
        buttonRow
      />

      <GenericModal
        visible={showDeleteSuccess}
        icon={
          <SuccessArcIcon
            width={40}
            height={40}
            color={COLORS.primary.GREEN_200}
          />
        }
        title={t("contents.deleteSuccessModal.title")}
        message={t("contents.deleteSuccessModal.message")}
        confirmLabel={t("contents.deleteSuccessModal.done")}
        onClose={() => setShowDeleteSuccess(false)}
        onConfirm={() => setShowDeleteSuccess(false)}
        showCloseButton={false}
      />
    </>
  );
}
