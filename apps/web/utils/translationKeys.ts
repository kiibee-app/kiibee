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

const TRANSLATION_KEYS = {
  HERO,
  NAV,
  AUTH,
  AUTH_FORM,
  CREATORS,
  TUTORIAL_VIDEOS,
};

export default TRANSLATION_KEYS;
