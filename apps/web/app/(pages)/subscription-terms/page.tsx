import { redirect } from "next/navigation";
import { PATHS } from "@/utils/path";

export default function SubscriptionTermsPage() {
  redirect(PATHS.CREATOR_TERMS);
}
