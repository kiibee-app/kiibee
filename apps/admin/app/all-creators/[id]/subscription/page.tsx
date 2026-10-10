import { CreatorSubscriptionSettings } from "../../../../components/features/creators/CreatorSubscriptionSettings";

type CreatorSubscriptionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CreatorSubscriptionPage({
  params,
}: CreatorSubscriptionPageProps) {
  const { id } = await params;
  return <CreatorSubscriptionSettings creatorId={id} />;
}
