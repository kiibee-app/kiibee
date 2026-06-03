import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProfileShell from "@/components/Feature/ProfileLayout/Shell";
import {
  CREATOR_LAYOUT_PARAMS,
  isCreatorLayoutParam,
} from "@/utils/creatorChannel";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ layout: string }>;
};

export function generateStaticParams() {
  return CREATOR_LAYOUT_PARAMS.map((layout) => ({ layout }));
}

export default async function CreatorProfileRouteLayout({
  children,
  params,
}: LayoutProps) {
  const { layout } = await params;

  if (!isCreatorLayoutParam(layout)) {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <ProfileShell variant={layout}>{children}</ProfileShell>
    </Suspense>
  );
}
