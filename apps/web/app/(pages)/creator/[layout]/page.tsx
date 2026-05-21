import { notFound } from "next/navigation";
import {
  CREATOR_LAYOUT_PARAMS,
  isCreatorLayoutParam,
} from "@/utils/creatorChannel";
import { creatorHomeByLayout } from "@/utils/creatorPageRegistry";

type PageProps = {
  params: Promise<{ layout: string }>;
};

export function generateStaticParams() {
  return CREATOR_LAYOUT_PARAMS.map((layout) => ({ layout }));
}

export default async function CreatorPage({ params }: PageProps) {
  const { layout } = await params;

  if (!isCreatorLayoutParam(layout)) {
    notFound();
  }

  const Home = creatorHomeByLayout[layout];
  return <Home />;
}
