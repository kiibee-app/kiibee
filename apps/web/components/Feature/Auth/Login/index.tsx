import LoginForm from "./LoginForm";
import LoginSlide from "./LoginSlide";
import { FormPanel, PageLayout, SlidePanel } from "./styles";

export default function LoginPage() {
  return (
    <PageLayout>
      <FormPanel>
        <LoginForm />
      </FormPanel>
      <SlidePanel>
        <LoginSlide />
      </SlidePanel>
    </PageLayout>
  );
}
