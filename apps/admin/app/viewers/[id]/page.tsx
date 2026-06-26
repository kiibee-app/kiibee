import { ViewerDetails } from "../../../components/features/viewers/ViewerDetails";

type ViewerDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ViewerDetailsPage({
  params,
}: ViewerDetailsPageProps) {
  const { id } = await params;
  return <ViewerDetails viewerId={id} />;
}
