import { redirect } from "next/navigation";
import { PATHS } from "@/utils/path";

export default function DashboardViewerCollectionPage() {
  redirect(PATHS.COLLECTION);
}
