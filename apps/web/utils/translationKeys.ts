export const HERO = {
  title: "hero.title",
  subtitle: "hero.subtitle",
  cta: "hero.cta",
  heroAlt: "hero.heroAlt",
};

export const NAV = {
  howItWorks: "nav.howItWorks",
  exploreCreators: "nav.exploreCreators",
  about: "nav.about",
  login: "nav.login",
  startCreating: "nav.startCreating",
  logoAlt: "nav.logoAlt",
};

export const AUTH = {
  title: "auth.title",
  subtitle: "auth.subtitle",
  login: "auth.login",
  signupCreator: "auth.signupCreator",
  signupViewer: "auth.signupViewer",
  haveAccount: "auth.haveAccount",
  mediaCard1Alt: "auth.mediaCard1Alt",
  mediaCard2Alt: "auth.mediaCard2Alt",
};

export const AUTH_FORM = {
  title: "authForm.title",
  emailLabel: "authForm.emailLabel",
  passwordLabel: "authForm.passwordLabel",
};

export const CREATORS = {
  sort: "creators.sort",
  value: (v: string) => `creators.${v}`,
  topCreators: "creators.topCreators",
  seeAll: "creators.seeAll",
  subscribersCount: "creators.subscribersCount",
  heading: {
    lineOne: "creators.heading.lineOne",
    lineTwo: "creators.heading.lineTwo",
    lineThree: "creators.heading.lineThree",
  },
  cta: "creators.cta",
  shortStory: {
    imageAlt: "creators.shortStory.imageAlt",
    title: "creators.shortStory.title",
    lead: "creators.shortStory.lead",
    body: "creators.shortStory.body",
    cta: "creators.shortStory.cta",
  },
  whyChoose: {
    leftItems: "creators.whyChoose.leftItems",
    rightItems: "creators.whyChoose.rightItems",
    heading: "creators.whyChoose.heading",
  },
  viewProfile: "creators.viewProfile",
  loadMore: "creators.loadMore",
  howToGetStarted: {
    title: "creators.howToGetStarted.title",
  },
  marketing: {
    title: "creators.marketing.title",
    description: "creators.marketing.description",
    listIntro: "creators.marketing.listIntro",
  },
};

export const TUTORIAL_VIDEOS = {
  buttonFreeLabel: "tutorialVideos.buttonFreeLabel",
};

export const CREATOR_PROFILE = {
  title: "creatorProfile.title",
  firstName: "creatorProfile.firstName",
  lastName: "creatorProfile.lastName",
  passwordLabel: "creatorProfile.passwordLabel",
  changePassword: "creatorProfile.changePassword",
  companyName: "creatorProfile.companyName",
  companyPlaceholder: "creatorProfile.companyPlaceholder",
  phone: "creatorProfile.phone",
  cvr: "creatorProfile.cvr",
  cvrPlaceholder: "creatorProfile.cvrPlaceholder",
  address: "creatorProfile.address",
  city: "creatorProfile.city",
  postal: "creatorProfile.postal",
  paymentTitle: "creatorProfile.paymentTitle",
  paymentText: "creatorProfile.paymentText",
  regLabel: "creatorProfile.regLabel",
  accountLabel: "creatorProfile.accountLabel",
  currentPassword: "creatorProfile.currentPassword",
  newPassword: "creatorProfile.newPassword",
  confirmPassword: "creatorProfile.confirmPassword",
  accountDeletionTitle: "creatorProfile.accountDeletionTitle",
  accountDeletionText: "creatorProfile.accountDeletionText",
  deleteAccount: "creatorProfile.deleteAccount",
};

export const DASHBOARD_USERS = {
  registrations: {
    title: "dashboard.users.registrations.title",
    description: "dashboard.users.registrations.description",
  },
  salest: {
    title: "dashboard.users.salest.title",
    description: "dashboard.users.salest.description",
  },
};

export const CONTENTS = {
  title: "contents.title",
  actions: {
    createCollection: "contents.actions.createCollection",
    search: "contents.actions.search",
  },
  tabs: {
    coupons: "contents.tabs.coupons",
  },
  couponsCard: {
    title: "contents.couponsCard.title",
    description: "contents.couponsCard.description",
  },
  placeholders: {
    collections: "contents.placeholders.collections",
  },
  deleteModal: {
    title: "contents.deleteModal.title",
    message: "contents.deleteModal.message",
    cancel: "contents.deleteModal.cancel",
    delete: "contents.deleteModal.delete",
  },
  deleteSuccessModal: {
    title: "contents.deleteSuccessModal.title",
    message: "contents.deleteSuccessModal.message",
    done: "contents.deleteSuccessModal.done",
  },
};

const TRANSLATION_KEYS = {
  HERO,
  NAV,
  AUTH,
  AUTH_FORM,
  CREATORS,
  TUTORIAL_VIDEOS,
  CREATOR_PROFILE,
  DASHBOARD_USERS,
  CONTENTS,
};

export default TRANSLATION_KEYS;
