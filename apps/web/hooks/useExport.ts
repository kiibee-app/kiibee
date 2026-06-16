import { usePostAPI } from "@/lib/http/api";
import { API } from "@/lib/http/api";

interface ExportRequestParams {
  type: string;
  startDate?: string;
  endDate?: string;
}

interface ExportResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Record<string, unknown>[];
}

const convertToCSV = (data: Record<string, unknown>[]): string => {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header] ?? "";
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
};

const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const useExportRequest = () => {
  const mutation = usePostAPI<ExportResponse, ExportRequestParams>(
    API.export.request,
  );

  const requestExport = async (params: ExportRequestParams) => {
    const response = await mutation.mutateAsync(params);
    const csv = convertToCSV(response.data);
    downloadCSV(
      csv,
      `export-${params.type}-${new Date().toISOString().split("T")[0]}.csv`,
    );
    return response;
  };

  return {
    requestExport,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};
