import { Suspense } from "react";
import { Main, PageContainer } from "@/app/styles";
import CreatorPlansClient from "./CreatorPlansClient";

export default function CreatorPlansPage() {
  return (
    <PageContainer>
      <Main>
        <Suspense fallback={null}>
          <CreatorPlansClient />
        </Suspense>
      </Main>
    </PageContainer>
  );
}
