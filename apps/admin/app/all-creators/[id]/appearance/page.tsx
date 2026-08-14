import { CreatorAppearanceSettings } from "../../../../components/features/creators/CreatorAppearanceSettings";

type CreatorAppearancePageProps = {
  params: Promise<{ id: string }>;
};

export default async function CreatorAppearancePage({
  params,
}: CreatorAppearancePageProps) {
  const { id } = await params;
  return <CreatorAppearanceSettings creatorId={id} />;
}
