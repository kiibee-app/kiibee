import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  PASSWORD_VISIBILITY_KEY,
  SUBSCRIPTION_STEP,
  type PasswordVisibilityKey,
} from "@/utils/Constants";
import { subscriptionPlans } from "@/utils/subscriptionPlans";
import type {
  SubscriptionContextValue,
  SubscriptionStep,
} from "@/types/subscription";
import { useGetAPI } from "@/lib/http/api/getApi";
import { usePostAPI } from "@/lib/http/api/postApi";
import { API } from "@/lib/http/api/endpoints";
import { useLogin, getPostLoginPath } from "@/hooks/auth/useLogin";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";

type ValidateTokenResponse = {
  success?: boolean;
  message?: string;
  data?: { userId?: string; type?: string; token?: string };
};

type CreatorSetupResponse = {
  success?: boolean;
  message?: string;
  data?: { userId?: string; email?: string; planId?: string };
};

type CreatorSetupPayload = {
  token: string;
  planId: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
};

export const useSubscriptionFlow = (
  setupToken?: string,
): SubscriptionContextValue => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setSession } = useAuthSession();
  const { getErrorMessage } = useApiErrorMessage();

  const trimmedInviteToken = setupToken?.trim() || "";
  const isCreatorInviteFlow = Boolean(trimmedInviteToken);

  const validateTokenRoute = trimmedInviteToken
    ? `/auth/validate-token/${encodeURIComponent(trimmedInviteToken)}`
    : "/auth/validate-token/__unused__";

  const {
    isFetching: isValidatingInviteToken,
    isSuccess: isInviteTokenValid,
    isError: isInviteTokenInvalid,
    error: inviteTokenQueryError,
  } = useGetAPI<ValidateTokenResponse>(validateTokenRoute, undefined, {
    enabled: isCreatorInviteFlow,
    retry: false,
  });

  const inviteTokenError = useMemo(() => {
    if (!isCreatorInviteFlow) return null;
    if (isValidatingInviteToken) return null;
    if (isInviteTokenValid) return null;
    if (isInviteTokenInvalid) {
      return getErrorMessage(
        inviteTokenQueryError,
        "subscriptionPage.invite.invalidToken",
      );
    }
    return t("subscriptionPage.invite.invalidToken");
  }, [
    isCreatorInviteFlow,
    isValidatingInviteToken,
    isInviteTokenValid,
    isInviteTokenInvalid,
    inviteTokenQueryError,
    getErrorMessage,
    t,
  ]);

  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[1].id);
  const [currentStep, setCurrentStep] = useState<SubscriptionStep>(
    SUBSCRIPTION_STEP.PLAN,
  );
  const [passwordVisibility, setPasswordVisibility] = useState({
    [PASSWORD_VISIBILITY_KEY.PASSWORD]: false,
    [PASSWORD_VISIBILITY_KEY.REPEAT_PASSWORD]: false,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [inviteSubmitError, setInviteSubmitError] = useState<string | null>(
    null,
  );

  const { mutateAsync: postCreatorSetup, isPending: isInviteSubmitting } =
    usePostAPI<CreatorSetupResponse, CreatorSetupPayload>(
      API.auth.creatorSetup,
    );
  const { mutateAsync: loginMutate } = useLogin();

  const isSubmitEnabled =
    Boolean(email.trim()) &&
    Boolean(password.trim()) &&
    Boolean(repeatPassword.trim()) &&
    (!isCreatorInviteFlow || (isInviteTokenValid && !isValidatingInviteToken));

  const getPlanPriceLabel = (planId: string) => {
    const plan = subscriptionPlans.find((item) => item.id === planId);
    return plan ? t(plan.priceKey) : "";
  };

  const handleContinue = () => {
    if (currentStep === SUBSCRIPTION_STEP.PLAN) {
      setCurrentStep(SUBSCRIPTION_STEP.DETAILS);
    }
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setInviteSubmitError(null);

      if (isCreatorInviteFlow) {
        if (!isInviteTokenValid || isValidatingInviteToken) {
          return;
        }

        const normalizedEmail = email.trim().toLowerCase();

        try {
          const setupResult = await postCreatorSetup({
            token: trimmedInviteToken,
            planId: selectedPlan,
            confirmEmail: normalizedEmail,
            password,
            confirmPassword: repeatPassword,
          });

          if (setupResult.success === false) {
            setInviteSubmitError(
              setupResult.message || t("subscriptionPage.invite.setupFailed"),
            );
            return;
          }

          const loginResponse = await loginMutate({
            email: normalizedEmail,
            password,
          });

          if (loginResponse.success === false) {
            setInviteSubmitError(
              loginResponse.message ||
                t("subscriptionPage.invite.loginAfterSetupFailed"),
            );
            return;
          }

          setSession(loginResponse);
          router.push(getPostLoginPath(loginResponse));
        } catch (error) {
          setInviteSubmitError(
            getErrorMessage(error, "subscriptionPage.invite.setupFailed"),
          );
        }
        return;
      }

      setCurrentStep(SUBSCRIPTION_STEP.PAYMENT);
    },
    [
      isCreatorInviteFlow,
      isInviteTokenValid,
      isValidatingInviteToken,
      trimmedInviteToken,
      email,
      password,
      repeatPassword,
      selectedPlan,
      postCreatorSetup,
      loginMutate,
      setSession,
      router,
      getErrorMessage,
      t,
    ],
  );

  const handleTogglePasswordVisibility = (key: PasswordVisibilityKey) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return {
    selectedPlan,
    currentStep,
    passwordVisibility,
    email,
    password,
    repeatPassword,
    isSubmitEnabled,
    setSelectedPlan,
    setCurrentStep,
    handleContinue,
    handleSubmit,
    handleTogglePasswordVisibility,
    setEmail,
    setPassword,
    setRepeatPassword,
    getPlanPriceLabel,
    onSelectPlan: setSelectedPlan,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onRepeatPasswordChange: setRepeatPassword,
    onTogglePasswordVisibility: handleTogglePasswordVisibility,
    onSubmit: handleSubmit,
    isCreatorInviteFlow,
    isValidatingInviteToken,
    isInviteSubmitting,
    inviteTokenError,
    inviteSubmitError,
  };
};
