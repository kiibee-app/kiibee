import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  PASSWORD_VISIBILITY_KEY,
  SUBSCRIPTION_STEP,
  type PasswordVisibilityKey,
} from "@/utils/Constants";
import {
  isFreeSubscriptionPlan,
  subscriptionPlanSlugToDbName,
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
import { saveCreatorInvitePostPayment } from "@/lib/subscription/inviteFlowStorage";

type CreateSubscriptionResponse = {
  success?: boolean;
  data?: {
    paymentWindowUrl?: string;
  };
  type?: string;
  message?: string;
};

type CreateSubscriptionPayload = {
  userId: string;
  planId: string;
};

type ValidateTokenResponse = {
  success?: boolean;
  message?: string;
  data?: {
    userId?: string;
    type?: string;
    token?: string;
    email?: string | null;
  };
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

type ApiPlan = {
  id: string;
  name: string;
  price: number;
};

type PlansResponse = {
  success?: boolean;
  data?: ApiPlan[];
};

export const useSubscriptionFlow = (
  setupToken?: string,
  initialStep: SubscriptionStep = SUBSCRIPTION_STEP.PLAN,
  initialPlanId?: string | null,
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
    data: validateTokenData,
    isFetching: isValidatingInviteToken,
    isSuccess: isInviteTokenValid,
    isError: isInviteTokenInvalid,
    error: inviteTokenQueryError,
  } = useGetAPI<ValidateTokenResponse>(validateTokenRoute, undefined, {
    enabled: isCreatorInviteFlow,
    retry: false,
  });

  const { data: plansData } = useGetAPI<PlansResponse>(API.subscription.plans);

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

  const inviteUserId = validateTokenData?.data?.userId;

  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[1].id);
  const [currentStep, setCurrentStep] = useState<SubscriptionStep>(initialStep);
  const [passwordVisibility, setPasswordVisibility] = useState({
    [PASSWORD_VISIBILITY_KEY.PASSWORD]: false,
    [PASSWORD_VISIBILITY_KEY.REPEAT_PASSWORD]: false,
  });
  const [email, setEmail] = useState("");
  const [inviteSubmitError, setInviteSubmitError] = useState<string | null>(
    null,
  );
  const [inviteSignupFlowBusy, setInviteSignupFlowBusy] = useState(false);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const {
    mutateAsync: postCreatorSetup,
    isPending: isPostCreatorSetupPending,
  } = usePostAPI<CreatorSetupResponse, CreatorSetupPayload>(
    API.auth.creatorSetup,
  );
  const { mutateAsync: loginMutate } = useLogin();
  const { mutateAsync: createSubscription } = usePostAPI<
    CreateSubscriptionResponse,
    CreateSubscriptionPayload
  >(API.subscription.create);

  useEffect(() => {
    const inviteEmail = validateTokenData?.data?.email;
    if (inviteEmail && !email) {
      setEmail(inviteEmail);
    }
  }, [validateTokenData?.data?.email, email]);

  useEffect(() => {
    if (
      initialPlanId &&
      subscriptionPlans.some((plan) => plan.id === initialPlanId)
    ) {
      setSelectedPlan(initialPlanId);
    }
  }, [initialPlanId]);

  const resolvePlanDbId = useCallback(
    (planSlug: string) => {
      const planName = subscriptionPlanSlugToDbName[planSlug];
      if (!planName) return null;

      return (
        plansData?.data?.find(
          (plan) => plan.name.toLowerCase() === planName.toLowerCase(),
        )?.id ?? null
      );
    },
    [plansData?.data],
  );

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

  const startPaidInviteCheckout = useCallback(async () => {
    if (!isCreatorInviteFlow || !inviteUserId) return;

    setInviteSignupFlowBusy(true);
    try {
      setInviteSubmitError(null);

      const dbPlanId = resolvePlanDbId(selectedPlan);
      if (!dbPlanId) {
        setInviteSubmitError(t("subscriptionPage.invite.setupFailed"));
        return;
      }

      const subscriptionResponse = await createSubscription({
        userId: inviteUserId,
        planId: dbPlanId,
      });

      const paymentUrl = subscriptionResponse?.data?.paymentWindowUrl;
      if (!paymentUrl) {
        setInviteSubmitError(t("subscriptionPage.invite.setupFailed"));
        return;
      }

      saveCreatorInvitePostPayment({
        token: trimmedInviteToken,
        planId: selectedPlan,
      });

      window.location.assign(paymentUrl);
    } catch (error) {
      setInviteSubmitError(
        getErrorMessage(error, "subscriptionPage.invite.setupFailed"),
      );
    } finally {
      setInviteSignupFlowBusy(false);
    }
  }, [
    isCreatorInviteFlow,
    inviteUserId,
    selectedPlan,
    resolvePlanDbId,
    createSubscription,
    trimmedInviteToken,
    getErrorMessage,
    t,
  ]);

  const handleContinue = useCallback(async () => {
    if (currentStep !== SUBSCRIPTION_STEP.PLAN) return;

    if (isCreatorInviteFlow && !isFreeSubscriptionPlan(selectedPlan)) {
      if (!isInviteTokenValid || isValidatingInviteToken) return;
      await startPaidInviteCheckout();
      return;
    }

    setCurrentStep(SUBSCRIPTION_STEP.DETAILS);
  }, [
    currentStep,
    isCreatorInviteFlow,
    selectedPlan,
    isInviteTokenValid,
    isValidatingInviteToken,
    startPaidInviteCheckout,
  ]);

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

        await completeCreatorInviteSignup();
        return;
      }

      setCurrentStep(SUBSCRIPTION_STEP.PAYMENT);
    },
    [
      isCreatorInviteFlow,
      isInviteTokenValid,
      isValidatingInviteToken,
      completeCreatorInviteSignup,
    ],
  );

  const handleTogglePasswordVisibility = (key: PasswordVisibilityKey) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isPostPaymentSetup =
    isCreatorInviteFlow &&
    initialStep === SUBSCRIPTION_STEP.DETAILS &&
    !isFreeSubscriptionPlan(selectedPlan);

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
    isPostPaymentSetup,
  };
};
