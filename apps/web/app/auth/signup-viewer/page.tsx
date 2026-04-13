import SignUpViewer from "@/components/Feature/Auth/SignUpViewer";
import { PageContainer, Main } from "../signup/styles";

export default function ViewerSignupPage() {
  return (
    <PageContainer>
      <Main>
        <SignUpViewer />
      </Main>
    </PageContainer>
  );
}
