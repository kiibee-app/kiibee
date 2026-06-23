import { ShoppingBag } from "lucide-react";

import type { ViewerSale } from "../../../types/viewer";
import { formatRequestedAt } from "../../../utils/date";
import {
  DrawerCardList,
  DrawerCardItem,
  DrawerItemContent,
  DrawerItemValue,
  SaleItem,
  SaleThumb,
  SaleThumbFallback,
  SaleMain,
  SaleTitle,
  SaleCreator,
  SaleTypeBadge,
  SaleRight,
  SaleAmount,
  SaleDate,
} from "./AllCreators.styles";
import { formatSaleType } from "./viewerSalesHistory";

type ViewerSalesHistoryListProps = {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  sales: ViewerSale[];
};

export function ViewerSalesHistoryList({
  isLoading,
  isError,
  errorMessage,
  sales,
}: ViewerSalesHistoryListProps) {
  if (isLoading) {
    return (
      <DrawerCardList>
        <DrawerCardItem>
          <DrawerItemContent>
            <DrawerItemValue>Loading sales history…</DrawerItemValue>
          </DrawerItemContent>
        </DrawerCardItem>
      </DrawerCardList>
    );
  }

  if (isError) {
    return (
      <DrawerCardList>
        <DrawerCardItem>
          <DrawerItemContent>
            <DrawerItemValue>
              {errorMessage || "Failed to load sales history."}
            </DrawerItemValue>
          </DrawerItemContent>
        </DrawerCardItem>
      </DrawerCardList>
    );
  }

  if (!sales.length) {
    return (
      <DrawerCardList>
        <DrawerCardItem>
          <DrawerItemContent>
            <DrawerItemValue>No sales yet.</DrawerItemValue>
          </DrawerItemContent>
        </DrawerCardItem>
      </DrawerCardList>
    );
  }

  return (
    <DrawerCardList>
      {sales.map((sale) => (
        <SaleItem key={sale.id}>
          {sale.contentImage ? (
            <SaleThumb src={sale.contentImage} alt={sale.contentTitle} />
          ) : (
            <SaleThumbFallback>
              <ShoppingBag size={18} />
            </SaleThumbFallback>
          )}
          <SaleMain>
            <SaleTitle>{sale.contentTitle}</SaleTitle>
            {sale.creatorName ? (
              <SaleCreator>by {sale.creatorName}</SaleCreator>
            ) : null}
            <SaleTypeBadge $type={sale.type?.toLowerCase()}>
              {formatSaleType(sale.type)}
            </SaleTypeBadge>
          </SaleMain>
          <SaleRight>
            <SaleAmount>{sale.amount} kr</SaleAmount>
            <SaleDate>{formatRequestedAt(sale.paymentDate)}</SaleDate>
          </SaleRight>
        </SaleItem>
      ))}
    </DrawerCardList>
  );
}
