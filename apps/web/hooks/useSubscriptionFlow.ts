import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  PASSWORD_VISIBILITY_KEY,
  SUBSCRIPTION_STEP,
  type PasswordVisibilityKey,
} from "@/utils/Constants";
import {
  isFreeSubscriptionPlan,
  subscriptionPlans,
} from "@/utils/subscriptionPlans";
import { isValidEmail, MIN_PASSWORD_LENGTH } from "@/utils/common";
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
  const [inviteSignupFlowBusy, setInviteSignupFlowBusy] = useState(false);

  const {
    mutateAsync: postCreatorSetup,
    isPending: isPostCreatorSetupPending,
  } = usePostAPI<CreatorSetupResponse, CreatorSetupPayload>(
    API.auth.creatorSetup,
  );
  const { mutateAsync: loginMutate } = useLogin();

  const { isEmailValid, isPasswordValid, passwordsMatch, validationError } =
    useMemo(() => {
      const isEmailValid = !email ? true : isValidEmail(email);

      const isPasswordValid =
        !password || password.length >= MIN_PASSWORD_LENGTH;

      const passwordsMatch =
        !password || !repeatPassword || password === repeatPassword;

      let validationError: string | null = null;

      if (email && !isEmailValid) {
        validationError = t("subscriptionPage.invite.emailInvalid");
      } else if (password && !isPasswordValid) {
        validationError = t("subscriptionPage.invite.passwordMinLength");
      } else if (password && repeatPassword && !passwordsMatch) {
        validationError = t("subscriptionPage.invite.passwordMismatch");
      }

      return {
        isEmailValid,
        isPasswordValid,
        passwordsMatch,
        validationError,
      };
    }, [email, password, repeatPassword, t]);

  const isSubmitEnabled =
    Boolean(email.trim()) &&
    isEmailValid &&
    Boolean(password.trim()) &&
    isPasswordValid &&
    Boolean(repeatPassword.trim()) &&
    passwordsMatch &&
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

  const completeCreatorInviteSignup = useCallback(async () => {
    if (!isCreatorInviteFlow) return;
    if (!isInviteTokenValid || isValidatingInviteToken) return;

    setInviteSignupFlowBusy(true);
    try {
      setInviteSubmitError(null);
      const normalizedEmail = email.trim().toLowerCase();

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
    } finally {
      setInviteSignupFlowBusy(false);
    }
  }, [
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
  ]);

  const backFromPaymentStep = useCallback(() => {
    setInviteSubmitError(null);
    setCurrentStep(SUBSCRIPTION_STEP.DETAILS);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setInviteSubmitError(null);

      if (isCreatorInviteFlow) {
        if (!isInviteTokenValid || isValidatingInviteToken) {
          return;
        }

        if (!isFreeSubscriptionPlan(selectedPlan)) {
          setCurrentStep(SUBSCRIPTION_STEP.PAYMENT);
          return;
        }

        await completeCreatorInviteSignup();
        return;
      }

      setCurrentStep(SUBSCRIPTION_STEP.PAYMENT);
    },
    [
      isCreatorInviteFlow,
      isInviteTokenValid,
      isValidatingInviteToken,
      selectedPlan,
      completeCreatorInviteSignup,
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
    isEmailValid,
    isPasswordValid,
    passwordsMatch,
    validationError,
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
    completeCreatorInviteSignup,
    backFromPaymentStep,
    isCreatorInviteFlow,
    isValidatingInviteToken,
    isInviteSubmitting: isPostCreatorSetupPending || inviteSignupFlowBusy,
    inviteTokenError,
    inviteSubmitError,
  };
};
