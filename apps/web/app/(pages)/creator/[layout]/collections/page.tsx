import { notFound } from "next/navigation";
import CollectionList from "@/components/Feature/ProfileLayout/shared/CollectionList";
import { isCreatorLayoutParam } from "@/utils/creatorChannel";

type PageProps = {
  params: Promise<{ layout: string }>;
};

export default async function CreatorCollectionsPage({ params }: PageProps) {
  const { layout } = await params;

  if (!isCreatorLayoutParam(layout)) {
    notFound();
  }

  return <CollectionList />;
}
