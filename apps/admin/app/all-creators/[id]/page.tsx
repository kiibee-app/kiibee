import { CreatorDetails } from "../../../components/features/creators/CreatorDetails";

type CreatorDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CreatorDetailsPage({
  params,
}: CreatorDetailsPageProps) {
  const { id } = await params;
  return <CreatorDetails creatorId={id} />;
}
