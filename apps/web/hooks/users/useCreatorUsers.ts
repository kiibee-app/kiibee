import { useQueryClient } from "@tanstack/react-query";
import { API, useGetAPI } from "@/lib/http/api";
import { axiosClient } from "@/lib/http/axiosClient";
import {
  CreatorUsersListResponse,
  CreatorUsersSalesResponse,
  RegistrationRow,
} from "@/types/creatorUsers";

type SalesQueryParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export const useRegistrations = () => {
  const query = useGetAPI<CreatorUsersListResponse<RegistrationRow>>(
    API.creatorUsers.registrations,
  );

  return {
    ...query,
    rows: query.data?.data ?? [],
  };
};

export const useSales = (params?: SalesQueryParams) => {
  const queryParams = {
    ...(params?.search ? { search: params.search } : {}),
    ...(params?.page ? { page: params.page } : {}),
    ...(params?.limit ? { limit: params.limit } : {}),
  };
  const query = useGetAPI<CreatorUsersSalesResponse>(
    API.creatorUsers.sales,
    queryParams,
  );

  return {
    ...query,
    rows: query.data?.data?.sales ?? [],
    pagination: query.data?.data?.pagination,
  };
};

export const useCreatorUsersCounts = () => {
  const registrationsQuery = useGetAPI<
    CreatorUsersListResponse<RegistrationRow>
  >(API.creatorUsers.registrations);
  const salesQuery = useGetAPI<CreatorUsersSalesResponse>(
    API.creatorUsers.sales,
  );

  return {
    registrationsCount: registrationsQuery.data?.data?.length ?? 0,
    salesCount: salesQuery.data?.data?.pagination?.totalItems ?? 0,
    isLoading: registrationsQuery.isLoading || salesQuery.isLoading,
  };
};

export const useDeleteRegistration = () => {
  const queryClient = useQueryClient();

  const deleteRegistration = async (id: string) => {
    await axiosClient.delete(API.creatorUsers.deleteRegistration(id));
    await queryClient.invalidateQueries({
      queryKey: [API.creatorUsers.registrations],
    });
  };

  return { deleteRegistration };
};
