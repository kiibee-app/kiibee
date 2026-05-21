import { notFound } from "next/navigation";
import {
  CREATOR_LAYOUT_PARAMS,
  isCreatorLayoutParam,
} from "@/utils/creatorChannel";
import { creatorCollectionsByLayout } from "@/utils/creatorPageRegistry";

type PageProps = {
  params: Promise<{ layout: string }>;
};

export function generateStaticParams() {
  return CREATOR_LAYOUT_PARAMS.map((layout) => ({ layout }));
}

export default async function CreatorCollectionsPage({ params }: PageProps) {
  const { layout } = await params;

  if (!isCreatorLayoutParam(layout)) {
    notFound();
  }

  const Collections = creatorCollectionsByLayout[layout];
  return <Collections />;
}
