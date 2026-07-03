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
import { useDebounce } from "@/hooks/useDebounce";
import GenericTabs from "@/components/UI/GenericTabs";
import { MonoText } from "@/components/UI/Monotext";
import SearchBar from "@/components/UI/SearchBar";
import Table from "@/components/UI/Table";
import SortDropdown, { DropdownOption } from "@/components/UI/SortDropdown";
import { DeleteIcon, ThreeDotIcon, CardIcon } from "@/assets/icons";
import SafeImage from "@/components/UI/SafeImage";
import COLORS from "@repo/ui/colors";
import {
  BILLING_HISTORY_HEADER_KEYS,
  BILLING_HISTORY_KEY_MAP,
  buildHeaderMap,
} from "@/utils/tableHeader";
import { CARD_BRAND_LOGOS, type ViewerPaymentMethod } from "@/types/cardTypes";
import { DASHBOARD_VIEWER_BILLINGS } from "@/utils/translationKeys";
import { GenericModal } from "@/components/UI/Modals";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import {
  useViewerBillingHistory,
  type ViewerBillingHistoryItem,
} from "@/hooks/useViewerBillingHistory";
import { useViewerPaymentMethods } from "@/hooks/useViewerPaymentMethods";
import GenericLoader from "@/components/UI/GenericLoader";
import { LOADER_VARIANT } from "@/utils/ui";

import {
  Actions,
  BillingHeader,
  BillingShell,
  BillingTableSection,
  CardIdentity,
  CardLabel,
  CardLogoWrap,
  ContentThumb,
  ContentTitleCell,
  DefaultBadge,
  EmptyStateBox,
  EmptyStateDescription,
  EmptyStateIconWrap,
  EmptyStateTitle,
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
import InvoiceModal from "./InvoiceModal";

export default function ClientViewerBillings() {
  const { t } = useTranslation();
  const [searchContent, setSearchContent] = useState("");
  const [searchCreator, setSearchCreator] = useState("");
  const debouncedSearchContent = useDebounce(searchContent);
  const debouncedSearchCreator = useDebounce(searchCreator);

  const { billingHistory, isLoading: isBillingHistoryLoading } =
    useViewerBillingHistory({
      searchContent: debouncedSearchContent || undefined,
      searchCreator: debouncedSearchCreator || undefined,
    });
  const {
    paymentMethods,
    isLoading: isPaymentMethodsLoading,
    deleteCard,
    markAsDefault,
  } = useViewerPaymentMethods();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<ViewerPaymentMethod | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [selectedBillingId, setSelectedBillingId] = useState<string | null>(
    null,
  );
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleDeleteClick = (method: ViewerPaymentMethod) => {
    setSelectedPaymentMethod(method);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPaymentMethod) return;

    await deleteCard(selectedPaymentMethod.subscriptionId);
    setShowDeleteModal(false);
    setShowDeleteSuccessModal(true);
  };

  const handleInvoiceOpen = (invoice: ViewerBillingHistoryItem) => {
    setSelectedBillingId(invoice.id);
    setShowInvoiceModal(true);
  };

  const handleMarkAsDefault = async (method: ViewerPaymentMethod) => {
    await markAsDefault(method.id);
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
        ) : (
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
                        value={searchContent}
                        onChange={setSearchContent}
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
                        value={searchCreator}
                        onChange={setSearchCreator}
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
        )
      ) : (
        <>
          <PaymentHeader>
            <MonoText $use="H4_Medium">
              {t(DASHBOARD_VIEWER_BILLINGS.paymentMethods.title)}
            </MonoText>
          </PaymentHeader>

          {isPaymentMethodsLoading ? (
            <GenericLoader variant={LOADER_VARIANT.INLINE} />
          ) : paymentMethods.length === 0 ? (
            <EmptyStateBox>
              <EmptyStateIconWrap>
                <CardIcon
                  width={28}
                  height={28}
                  color={COLORS.neutral.GRAY_400}
                />
              </EmptyStateIconWrap>
              <EmptyStateTitle>
                {t(DASHBOARD_VIEWER_BILLINGS.paymentMethods.emptyTitle)}
              </EmptyStateTitle>
              <EmptyStateDescription>
                {t(DASHBOARD_VIEWER_BILLINGS.paymentMethods.emptyDescription)}
              </EmptyStateDescription>
            </EmptyStateBox>
          ) : (
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
                            DASHBOARD_VIEWER_BILLINGS.paymentMethods
                              .defaultBadge,
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
          )}
        </>
      )}
      <InvoiceModal
        visible={showInvoiceModal}
        billingId={selectedBillingId}
        onClose={() => {
          setShowInvoiceModal(false);
          setSelectedBillingId(null);
        }}
      />
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
    </BillingShell>
  );
}
