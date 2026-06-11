"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  VIEWER_BILLING_HISTORY_TAB,
  VIEWER_BILLING_TABS,
  type ViewerBillingTab,
} from "@/utils/common";
import {
  BILLING_TAB,
  CARD_BRANDS,
  PAYMENT_METHOD_ACTION_MARK_AS_DEFAULT,
  SORT_DROPDOWN_VARIANT,
} from "@/utils/Constants";
import { useQuerySyncedTab } from "@/hooks/useQuerySyncedTab";
import { useTableSort } from "@/hooks/useTableSort";
import GenericTabs from "@/components/UI/GenericTabs";
import { MonoText } from "@/components/UI/Monotext";
import SearchBar from "@/components/UI/SearchBar";
import Table from "@/components/UI/Table";
import SortDropdown, { DropdownOption } from "@/components/UI/SortDropdown";
import {
  DeleteIcon,
  EditProfileIcon,
  PlusIcon,
  ThreeDotIcon,
} from "@/assets/icons";
import SafeImage from "@/components/UI/SafeImage";
import COLORS from "@repo/ui/colors";
import {
  BILLING_HISTORY_HEADER_KEYS,
  BILLING_HISTORY_KEY_MAP,
  buildHeaderMap,
} from "@/utils/tableHeader";
import {
  CARD_BRAND_LOGOS,
  MOCK_VIEWER_PAYMENT_METHODS,
  type ViewerBillingHistoryItem,
  type ViewerPaymentMethod,
} from "@/utils/dummyData/viewerBillingMockData";
import { DASHBOARD_VIEWER_BILLINGS } from "@/utils/translationKeys";
import { GenericModal } from "@/components/UI/Modals";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import { useViewerBillingHistory } from "@/hooks/useViewerBillingHistory";
import GenericLoader from "@/components/UI/GenericLoader";
import { LOADER_VARIANT } from "@/utils/ui";

import {
  Actions,
  AddCardButton,
  BillingHeader,
  BillingShell,
  BillingTableSection,
  CardIdentity,
  CardLabel,
  CardLogoWrap,
  ContentThumb,
  ContentTitleCell,
  DefaultBadge,
  ExpiryCell,
  IconButton,
  MethodRow,
  MethodsList,
  PaymentHeader,
  PaymentLogoWrap,
  PaymentMethodCell,
  RowNumber,
  SearchFilterWrap,
} from "./styles";
import AddCardModal from "./AddCardModal";
import EditCardModal from "./EditCardModal";
import InvoiceModal from "./InvoiceModal";

export default function ClientViewerBillings() {
  const { t } = useTranslation();
  const { billingHistory, isLoading: isBillingHistoryLoading } =
    useViewerBillingHistory();
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showEditCardModal, setShowEditCardModal] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(
    MOCK_VIEWER_PAYMENT_METHODS,
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<ViewerPaymentMethod | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<ViewerBillingHistoryItem | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleCloseModal = () => {
    setShowAddCardModal(false);
  };

  const handleDeleteClick = (method: ViewerPaymentMethod) => {
    setSelectedPaymentMethod(method);
    setShowDeleteModal(true);
  };

  const handleEditClick = (method: ViewerPaymentMethod) => {
    setSelectedPaymentMethod(method);
    setShowEditCardModal(true);
  };

  const handleEditClose = () => {
    setShowEditCardModal(false);
    setSelectedPaymentMethod(null);
  };

  const handleEditSave = (updatedMethod: ViewerPaymentMethod) => {
    setPaymentMethods((prev) =>
      prev.map((method) =>
        method.id === updatedMethod.id ? updatedMethod : method,
      ),
    );
    setShowEditCardModal(false);
    setShowEditSuccessModal(true);
    setSelectedPaymentMethod(updatedMethod);
  };

  const handleDeleteConfirm = () => {
    if (!selectedPaymentMethod) return;

    setPaymentMethods((prev) =>
      prev.filter((method) => method.id !== selectedPaymentMethod.id),
    );
    setShowDeleteModal(false);
    setShowDeleteSuccessModal(true);
  };

  const handleInvoiceOpen = (invoice: ViewerBillingHistoryItem) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleMarkAsDefault = (method: ViewerPaymentMethod) => {
    setPaymentMethods((prev) =>
      prev.map((item) => ({
        ...item,
        isDefault: item.id === method.id,
      })),
    );
  };

  const getMethodActions = (): DropdownOption<string>[] => [
    {
      label: t(DASHBOARD_VIEWER_BILLINGS.paymentMethods.markAsDefault),
      value: PAYMENT_METHOD_ACTION_MARK_AS_DEFAULT,
    },
  ];

  const handleMethodActionSelect = (
    method: ViewerPaymentMethod,
    action: string,
  ) => {
    if (action === PAYMENT_METHOD_ACTION_MARK_AS_DEFAULT) {
      handleMarkAsDefault(method);
    }
  };

  const { activeTab, setActiveTabAndQuery } =
    useQuerySyncedTab<ViewerBillingTab>({
      queryKey: BILLING_TAB,
      defaultTab: VIEWER_BILLING_HISTORY_TAB,
      validTabs: VIEWER_BILLING_TABS.map((tab) => tab.key),
    });
  const billingHistoryKeys = DASHBOARD_VIEWER_BILLINGS.billingHistory;
  const billingHistoryHeaders = BILLING_HISTORY_HEADER_KEYS.map((key) =>
    t(billingHistoryKeys.tableHeaders[key]),
  );
  const billingHistoryHeaderMap = buildHeaderMap(
    billingHistoryHeaders,
    BILLING_HISTORY_HEADER_KEYS,
  );

  const {
    sortedData: sortedBillingHistory,
    isHeaderSortable,
    getHeaderSortDirection,
    toggleSort,
  } = useTableSort(billingHistory, {
    sortableHeader: billingHistoryHeaders[0],
    sortBy: (item) => item.contentTitle,
  });

  return (
    <BillingShell>
      <BillingHeader>
        <MonoText $use="H4_SemiBold">
          {t(DASHBOARD_VIEWER_BILLINGS.title)}
        </MonoText>
        <GenericTabs
          tabs={VIEWER_BILLING_TABS.map((tab) => ({
            key: tab.key,
            label: t(tab.labelKey),
          }))}
          activeTab={activeTab}
          onTabChange={setActiveTabAndQuery}
        />
      </BillingHeader>

      {activeTab === VIEWER_BILLING_HISTORY_TAB ? (
        isBillingHistoryLoading ? (
          <GenericLoader variant={LOADER_VARIANT.INLINE} />
        ) : sortedBillingHistory.length ? (
          <BillingTableSection>
            <Table<ViewerBillingHistoryItem>
              headers={billingHistoryHeaders}
              data={sortedBillingHistory}
              rowsPerPage={10}
              onRowClick={(row) => handleInvoiceOpen(row)}
              emptyText={t(DASHBOARD_VIEWER_BILLINGS.billingHistory.empty)}
              headerToKey={(header) => billingHistoryHeaderMap[header]}
              onHeaderClick={toggleSort}
              isHeaderSortable={isHeaderSortable}
              getHeaderSortDirection={getHeaderSortDirection}
              getRowKey={(row) => row.id}
              getMobileTitle={(row) => row.contentTitle}
              renderHeaderFilter={({ index }) => {
                if (index === 0) {
                  return (
                    <SearchFilterWrap>
                      <SearchBar
                        placeholder={t(billingHistoryKeys.searchContent)}
                        width="100%"
                      />
                    </SearchFilterWrap>
                  );
                }

                if (index === 1) {
                  return (
                    <SearchFilterWrap>
                      <SearchBar
                        placeholder={t(billingHistoryKeys.searchCreator)}
                        width="100%"
                      />
                    </SearchFilterWrap>
                  );
                }

                return null;
              }}
              renderCell={({ header, row, rowIndex }) => {
                const key = billingHistoryHeaderMap[header];

                if (key === BILLING_HISTORY_KEY_MAP.CONTENT_TITLE) {
                  return (
                    <ContentTitleCell>
                      <RowNumber>{rowIndex + 1}</RowNumber>
                      <ContentThumb>
                        <SafeImage
                          src={row.contentImage}
                          alt=""
                          fill
                          sizes="34px"
                          style={{ objectFit: "cover" }}
                        />
                      </ContentThumb>
                      <MonoText $use="Body_SemiBold">
                        {row.contentTitle}
                      </MonoText>
                    </ContentTitleCell>
                  );
                }

                if (key === BILLING_HISTORY_KEY_MAP.PAYMENT_METHOD) {
                  return (
                    <PaymentMethodCell>
                      <PaymentLogoWrap>
                        <SafeImage
                          src={CARD_BRAND_LOGOS[row.paymentMethod.brand]}
                          alt={row.paymentMethod.brand}
                          width={
                            row.paymentMethod.brand === CARD_BRANDS.VISA
                              ? 31
                              : 21
                          }
                          height={
                            row.paymentMethod.brand === CARD_BRANDS.VISA
                              ? 10
                              : 16
                          }
                        />
                      </PaymentLogoWrap>
                      <MonoText $use="Body_SemiBold">
                        **** {row.paymentMethod.last4}
                      </MonoText>
                    </PaymentMethodCell>
                  );
                }

                return (
                  <MonoText $use="Body_SemiBold">{row[key] as string}</MonoText>
                );
              }}
            />
          </BillingTableSection>
        ) : (
          <MonoText $use="Body_Regular" color={COLORS.neutral.GRAY}>
            {t(DASHBOARD_VIEWER_BILLINGS.billingHistory.empty)}
          </MonoText>
        )
      ) : (
        <>
          <PaymentHeader>
            <MonoText $use="H4_Medium">
              {t(DASHBOARD_VIEWER_BILLINGS.paymentMethods.title)}
            </MonoText>
            <AddCardButton
              type="button"
              onClick={() => setShowAddCardModal(true)}
            >
              <PlusIcon width={12} height={12} />
              <MonoText $use="Body_Medium" color={COLORS.primary.WHITE}>
                {t(DASHBOARD_VIEWER_BILLINGS.paymentMethods.addCard)}
              </MonoText>
            </AddCardButton>
          </PaymentHeader>

          <MethodsList>
            {paymentMethods.map((method) => (
              <MethodRow key={method.id}>
                <CardIdentity>
                  <CardLogoWrap>
                    <SafeImage
                      src={CARD_BRAND_LOGOS[method.brand]}
                      alt={method.brand}
                      width={method.brand === CARD_BRANDS.VISA ? 32 : 22}
                      height={method.brand === CARD_BRANDS.VISA ? 10 : 16}
                    />
                  </CardLogoWrap>
                  <CardLabel>
                    <MonoText $use="Body_SemiBold">{method.label}</MonoText>
                    {method.isDefault ? (
                      <DefaultBadge>
                        {t(
                          DASHBOARD_VIEWER_BILLINGS.paymentMethods.defaultBadge,
                        )}
                      </DefaultBadge>
                    ) : null}
                  </CardLabel>
                </CardIdentity>

                <ExpiryCell>
                  <MonoText $use="Body_SemiBold" color={COLORS.neutral.GRAY}>
                    {t(DASHBOARD_VIEWER_BILLINGS.paymentMethods.expires, {
                      date: method.expiresAt,
                    })}
                  </MonoText>
                </ExpiryCell>

                <Actions>
                  <IconButton
                    type="button"
                    aria-label={t(
                      DASHBOARD_VIEWER_BILLINGS.paymentMethods.edit,
                    )}
                    onClick={() => handleEditClick(method)}
                  >
                    <EditProfileIcon color={COLORS.neutral.GRAY} />
                  </IconButton>
                  <IconButton
                    type="button"
                    aria-label={t(
                      DASHBOARD_VIEWER_BILLINGS.paymentMethods.delete,
                    )}
                    onClick={() => handleDeleteClick(method)}
                  >
                    <DeleteIcon color={COLORS.gradient.NEAR_BLACK} />
                  </IconButton>
                  <SortDropdown<string>
                    options={getMethodActions()}
                    compact
                    dropdownWidth="196px"
                    maxWidth="196px"
                    variant={SORT_DROPDOWN_VARIANT.SURFACE}
                    trigger={
                      <ThreeDotIcon color={COLORS.gradient.NEAR_BLACK} />
                    }
                    onChange={(action) =>
                      handleMethodActionSelect(method, action)
                    }
                  />
                </Actions>
              </MethodRow>
            ))}
          </MethodsList>
        </>
      )}
      <AddCardModal visible={showAddCardModal} onClose={handleCloseModal} />
      <InvoiceModal
        visible={showInvoiceModal}
        invoice={selectedInvoice}
        onClose={() => {
          setShowInvoiceModal(false);
          setSelectedInvoice(null);
        }}
      />
      {selectedPaymentMethod ? (
        <EditCardModal
          key={`${selectedPaymentMethod.id}-${showEditCardModal ? "open" : "closed"}`}
          visible={showEditCardModal}
          paymentMethod={selectedPaymentMethod}
          onClose={handleEditClose}
          onSave={handleEditSave}
        />
      ) : null}
      <GenericModal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedPaymentMethod(null);
        }}
        title={t(DASHBOARD_VIEWER_BILLINGS.paymentMethods.deleteModal.title)}
        message={t(
          DASHBOARD_VIEWER_BILLINGS.paymentMethods.deleteModal.message,
        )}
        cancelLabel={t(
          DASHBOARD_VIEWER_BILLINGS.paymentMethods.deleteModal.cancel,
        )}
        confirmLabel={t(
          DASHBOARD_VIEWER_BILLINGS.paymentMethods.deleteModal.confirm,
        )}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedPaymentMethod(null);
        }}
        onConfirm={handleDeleteConfirm}
        size="sm"
        spacing="md"
        fullWidthButtons
        buttonRow
        showCloseButton={false}
      />
      <GenericModal
        visible={showDeleteSuccessModal}
        icon={<SuccessModalIcon />}
        title={t(
          DASHBOARD_VIEWER_BILLINGS.paymentMethods.deleteSuccessModal.title,
        )}
        message={t(
          DASHBOARD_VIEWER_BILLINGS.paymentMethods.deleteSuccessModal.message,
        )}
        confirmLabel={t(
          DASHBOARD_VIEWER_BILLINGS.paymentMethods.deleteSuccessModal.confirm,
        )}
        onClose={() => {
          setShowDeleteSuccessModal(false);
          setSelectedPaymentMethod(null);
        }}
        onConfirm={() => {
          setShowDeleteSuccessModal(false);
          setSelectedPaymentMethod(null);
        }}
        showCloseButton={false}
      />
      <GenericModal
        visible={showEditSuccessModal}
        icon={<SuccessModalIcon />}
        title={t(
          DASHBOARD_VIEWER_BILLINGS.paymentMethods.editSuccessModal.title,
        )}
        message={t(
          DASHBOARD_VIEWER_BILLINGS.paymentMethods.editSuccessModal.message,
        )}
        confirmLabel={t(
          DASHBOARD_VIEWER_BILLINGS.paymentMethods.editSuccessModal.confirm,
        )}
        onClose={() => {
          setShowEditSuccessModal(false);
          setSelectedPaymentMethod(null);
        }}
        onConfirm={() => {
          setShowEditSuccessModal(false);
          setSelectedPaymentMethod(null);
        }}
        showCloseButton={false}
      />
    </BillingShell>
  );
}
