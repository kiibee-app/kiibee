import { notFound } from "next/navigation";
import ProfileHomeSections from "@/components/Feature/ProfileLayout/HomeSections";
import { isCreatorLayoutParam } from "@/utils/creatorChannel";

type PageProps = {
  params: Promise<{ layout: string }>;
};

export default async function CreatorPage({ params }: PageProps) {
  const { layout } = await params;

  if (!isCreatorLayoutParam(layout)) {
    notFound();
  }

  return <ProfileHomeSections variant={layout} />;
}
