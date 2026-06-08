import { useQueryClient } from "@tanstack/react-query";
import { API, useGetAPI } from "@/lib/http/api";
import { axiosClient } from "@/lib/http/axiosClient";
import {
  CreatorUsersListResponse,
  RegistrationRow,
  SalesRow,
} from "@/types/creatorUsers";

export const useRegistrations = () => {
  const query = useGetAPI<CreatorUsersListResponse<RegistrationRow>>(
    API.creatorUsers.registrations,
  );

  return {
    ...query,
    rows: query.data?.data ?? [],
  };
};

export const useSales = () => {
  const query = useGetAPI<CreatorUsersListResponse<SalesRow>>(
    API.creatorUsers.sales,
  );

  return {
    ...query,
    rows: query.data?.data ?? [],
  };
};

export const useCreatorUsersCounts = () => {
  const registrationsQuery = useGetAPI<
    CreatorUsersListResponse<RegistrationRow>
  >(API.creatorUsers.registrations);
  const salesQuery = useGetAPI<CreatorUsersListResponse<SalesRow>>(
    API.creatorUsers.sales,
  );

  return {
    registrationsCount: registrationsQuery.data?.data?.length ?? 0,
    salesCount: salesQuery.data?.data?.length ?? 0,
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
