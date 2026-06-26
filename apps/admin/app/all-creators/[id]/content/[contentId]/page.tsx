import { CreatorContentEngagement } from "../../../../../components/features/creators/CreatorContentEngagement";

type CreatorContentPageProps = {
  params: Promise<{ id: string; contentId: string }>;
};

export default async function CreatorContentPage({
  params,
}: CreatorContentPageProps) {
  const { id, contentId } = await params;
  return <CreatorContentEngagement creatorId={id} contentId={contentId} />;
}
