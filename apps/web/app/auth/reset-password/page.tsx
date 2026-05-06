import { Main, PageContainer } from "@/app/styles";
import ResetPasswordForm from "@/components/Feature/ResetPassword";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <PageContainer>
      <Main>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </Main>
    </PageContainer>
  );
}
