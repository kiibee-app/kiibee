import { usePostAPI } from "@/lib/http/api/postApi";
import { API } from "@/lib/http/api/endpoints";

type CreateCollectionOrderResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    orderId: string;
    url?: string;
  };
};

type CreateCollectionOrderPayload = {
  collectionId: string;
  itemType: string;
  couponCode?: string;
  subscriptionId?: string;
};

export const useCreateCollectionOrder = () =>
  usePostAPI<CreateCollectionOrderResponse, CreateCollectionOrderPayload>(
    API.order.createCollection,
  );
