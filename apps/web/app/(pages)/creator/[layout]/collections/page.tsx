import { notFound } from "next/navigation";
import ProfileLayoutPage from "@/components/Feature/ProfileLayout/Page";
import { PROFILE_LAYOUT_PAGE } from "@/utils/Constants";
import {
  CREATOR_LAYOUT_PARAMS,
  isCreatorLayoutParam,
} from "@/utils/creatorChannel";

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

  return (
    <ProfileLayoutPage
      variant={layout}
      page={PROFILE_LAYOUT_PAGE.COLLECTIONS}
    />
  );
}
