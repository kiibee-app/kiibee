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
  dashboard: "nav.dashboard",
  accountProfile: "nav.accountProfile",
  logout: "nav.logout",
  profileMenu: "nav.profileMenu",
  startCreating: "nav.startCreating",
  logoAlt: "nav.logoAlt",
};

export const CREATE_PROFILE_HOME = {
  brandName: "createProfileHome.brandName",
  uploads: "createProfileHome.uploads",
  title: "createProfileHome.title",
  description: "createProfileHome.description",
  more: "createProfileHome.more",
  searchPlaceholder: "createProfileHome.searchPlaceholder",
  searchOpenPlaceholder: "createProfileHome.searchOpenPlaceholder",
  searchCollectionsPlaceholder:
    "createProfileHome.searchCollectionsPlaceholder",
  searchAriaLabel: "createProfileHome.searchAriaLabel",
  aboutModal: {
    moreInfo: "createProfileHome.aboutModal.moreInfo",
    joined: "createProfileHome.aboutModal.joined",
    links: "createProfileHome.aboutModal.links",
  },
};

export const CREATE_PROFILE_ROUTES = {
  collections: {
    title: "createProfileCollections.title",
    description: "createProfileCollections.description",
  },
  about: {
    title: "createProfileAbout.title",
    description: "createProfileAbout.description",
    sectionTitle: "createProfileAbout.sectionTitle",
    sectionTitleClothes: "createProfileAbout.sectionTitleClothes",
    buyCollection: "createProfileAbout.buyCollection",
  },
};

export const CREATE_PROFILE_FOOTER = {
  tagline: "createProfileFooter.tagline",
  cta: "createProfileFooter.cta",
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

export const AUTH_CREATOR = {
  backAria: "authCreator.backAria",
  requestSent: {
    title: "authCreator.requestSent.title",
    description: "authCreator.requestSent.description",
    backToKiibee: "authCreator.requestSent.backToKiibee",
  },
};

export const VIEWER_SIGNUP_PREFERENCE = {
  title: "viewerSignup.preference.title",
  description: "viewerSignup.preference.description",
  submit: "viewerSignup.preference.submit",
  content: {
    title: "viewerSignup.preference.content.title",
    subtitle: "viewerSignup.preference.content.subtitle",
    option: (key: string) => `viewerSignup.preference.content.options.${key}`,
  },
  types: {
    title: "viewerSignup.preference.types.title",
    subtitle: "viewerSignup.preference.types.subtitle",
    submit: "viewerSignup.preference.types.submit",
    option: (key: string) => `viewerSignup.preference.types.options.${key}`,
  },
};

export const CREATORS = {
  marquee: {
    title: "creators.marquee.title",
    defaultDescription: "creators.marquee.defaultDescription",
  },
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
  noCreatorsFound: "creators.noCreatorsFound",
  uploadsCount: "creators.uploadsCount",
  loadMore: "creators.loadMore",
  title: "creators.title",
  allCreators: "nav.explore.creator.allCreators",
  featured: "nav.explore.creator.featured",
  newCreators: "nav.explore.creator.newCreators",
  popular: "nav.explore.creator.popular",
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
  newPasswordSameAsCurrent: "creatorProfile.newPasswordSameAsCurrent",
  accountDeletionTitle: "creatorProfile.accountDeletionTitle",
  accountDeletionText: "creatorProfile.accountDeletionText",
  deleteAccount: "creatorProfile.deleteAccount",
  deleteModal: {
    title: "creatorProfile.deleteModal.title",
    message: "creatorProfile.deleteModal.message",
    cancel: "creatorProfile.deleteModal.cancel",
    confirm: "creatorProfile.deleteModal.confirm",
  },
  deleteSuccessModal: {
    title: "creatorProfile.deleteSuccessModal.title",
    message: "creatorProfile.deleteSuccessModal.message",
    confirm: "creatorProfile.deleteSuccessModal.confirm",
  },
};

export const DASHBOARD_USERS = {
  search: "users.search",
  tabs: {
    registrations: "users.tabs.registrations",
    sales: "users.tabs.sales",
    registrationsWithCount: "users.tabs.registrationsWithCount",
    salesWithCount: "users.tabs.salesWithCount",
  },
  registrations: {
    title: "users.registrations.title",
    description: "users.registrations.description",
    emptyState: {
      title: "users.registrations.emptyState.title",
      description: "users.registrations.emptyState.description",
    },
    tableHeaders: {
      name: "users.registrations.tableHeaders.name",
      email: "users.registrations.tableHeaders.email",
      date: "users.registrations.tableHeaders.date",
      action: "users.registrations.tableHeaders.action",
    },
    deleteModal: {
      title: "users.registrations.deleteModal.title",
      message: "users.registrations.deleteModal.message",
      cancel: "users.registrations.deleteModal.cancel",
      delete: "users.registrations.deleteModal.delete",
    },
  },
  salest: {
    title: "users.salest.title",
    description: "users.salest.description",
    emptyState: {
      title: "users.salest.emptyState.title",
      description: "users.salest.emptyState.description",
    },
    tableHeaders: {
      name: "users.salest.tableHeaders.name",
      email: "users.salest.tableHeaders.email",
      price: "users.salest.tableHeaders.price",
      type: "users.salest.tableHeaders.type",
      date: "users.salest.tableHeaders.date",
    },
  },
};

export const DASHBOARD_VIEWER_PURCHASED = {
  title: "dashboard.viewerPurchased.title",
  sections: {
    collections: "dashboard.viewerPurchased.sections.collections",
    videos: "dashboard.viewerPurchased.sections.videos",
    audios: "dashboard.viewerPurchased.sections.audios",
    pdf: "dashboard.viewerPurchased.sections.pdf",
  },
  buttons: {
    seeContent: "dashboard.viewerPurchased.buttons.seeContent",
  },
  emptyStates: {
    collections: "dashboard.viewerPurchased.emptyStates.collections",
    media: "dashboard.viewerPurchased.emptyStates.media",
  },
};

export const DASHBOARD_VIEWER_BILLINGS = {
  title: "dashboard.viewerBillings.title",
  tabs: {
    billingHistory: "dashboard.viewerBillings.tabs.billingHistory",
    paymentMethods: "dashboard.viewerBillings.tabs.paymentMethods",
  },
  billingHistory: {
    empty: "dashboard.viewerBillings.billingHistory.empty",
    placeholder: "dashboard.viewerBillings.billingHistory.placeholder",
    searchContent: "dashboard.viewerBillings.billingHistory.searchContent",
    searchCreator: "dashboard.viewerBillings.billingHistory.searchCreator",
    invoiceModal: {
      title: "dashboard.viewerBillings.billingHistory.invoiceModal.title",
      orderNumber:
        "dashboard.viewerBillings.billingHistory.invoiceModal.orderNumber",
      contentDetails:
        "dashboard.viewerBillings.billingHistory.invoiceModal.contentDetails",
      share: "dashboard.viewerBillings.billingHistory.invoiceModal.share",
    },
    tableHeaders: {
      contentTitle:
        "dashboard.viewerBillings.billingHistory.tableHeaders.contentTitle",
      creatorName:
        "dashboard.viewerBillings.billingHistory.tableHeaders.creatorName",
      type: "dashboard.viewerBillings.billingHistory.tableHeaders.type",
      paymentDate:
        "dashboard.viewerBillings.billingHistory.tableHeaders.paymentDate",
      amount: "dashboard.viewerBillings.billingHistory.tableHeaders.amount",
      paymentMethod:
        "dashboard.viewerBillings.billingHistory.tableHeaders.paymentMethod",
    },
  },
  paymentMethods: {
    title: "dashboard.viewerBillings.paymentMethods.title",
    addCard: "dashboard.viewerBillings.paymentMethods.addCard",
    defaultBadge: "dashboard.viewerBillings.paymentMethods.defaultBadge",
    expires: "dashboard.viewerBillings.paymentMethods.expires",
    edit: "dashboard.viewerBillings.paymentMethods.edit",
    markAsDefault: "dashboard.viewerBillings.paymentMethods.markAsDefault",
    delete: "dashboard.viewerBillings.paymentMethods.delete",
    more: "dashboard.viewerBillings.paymentMethods.more",
    deleteModal: {
      title: "dashboard.viewerBillings.paymentMethods.deleteModal.title",
      message: "dashboard.viewerBillings.paymentMethods.deleteModal.message",
      cancel: "dashboard.viewerBillings.paymentMethods.deleteModal.cancel",
      confirm: "dashboard.viewerBillings.paymentMethods.deleteModal.confirm",
    },
    deleteSuccessModal: {
      title: "dashboard.viewerBillings.paymentMethods.deleteSuccessModal.title",
      message:
        "dashboard.viewerBillings.paymentMethods.deleteSuccessModal.message",
      confirm:
        "dashboard.viewerBillings.paymentMethods.deleteSuccessModal.confirm",
    },
    addCardModal: {
      title: "dashboard.viewerBillings.paymentMethods.addCardModal.title",
      cardNumber:
        "dashboard.viewerBillings.paymentMethods.addCardModal.cardNumber",
      expiryDate:
        "dashboard.viewerBillings.paymentMethods.addCardModal.expiryDate",
      cvv: "dashboard.viewerBillings.paymentMethods.addCardModal.cvv",
      cardPlaceholder:
        "dashboard.viewerBillings.paymentMethods.addCardModal.cardPlaceholder",
      expiryPlaceholder:
        "dashboard.viewerBillings.paymentMethods.addCardModal.expiryPlaceholder",
      cvvPlaceholder:
        "dashboard.viewerBillings.paymentMethods.addCardModal.cvvPlaceholder",
      successTitle:
        "dashboard.viewerBillings.paymentMethods.addCardModal.successTitle",
      successMessage:
        "dashboard.viewerBillings.paymentMethods.addCardModal.successMessage",
    },
    editCardModal: {
      title: "dashboard.viewerBillings.paymentMethods.editCardModal.title",
      cardNumber:
        "dashboard.viewerBillings.paymentMethods.editCardModal.cardNumber",
      expiryDate:
        "dashboard.viewerBillings.paymentMethods.editCardModal.expiryDate",
      cvv: "dashboard.viewerBillings.paymentMethods.editCardModal.cvv",
      cardPlaceholder:
        "dashboard.viewerBillings.paymentMethods.editCardModal.cardPlaceholder",
      expiryPlaceholder:
        "dashboard.viewerBillings.paymentMethods.editCardModal.expiryPlaceholder",
      cvvPlaceholder:
        "dashboard.viewerBillings.paymentMethods.editCardModal.cvvPlaceholder",
    },
    editSuccessModal: {
      title: "dashboard.viewerBillings.paymentMethods.editSuccessModal.title",
      message:
        "dashboard.viewerBillings.paymentMethods.editSuccessModal.message",
      confirm:
        "dashboard.viewerBillings.paymentMethods.editSuccessModal.confirm",
    },
  },
};

export const CONTENTS = {
  title: "contents.title",
  actions: {
    createCollection: "contents.actions.createCollection",
    createCoupon: "contents.actions.createCoupon",
    search: "contents.actions.search",
  },
  tabs: {
    coupons: "contents.tabs.coupons",
  },
  couponsCard: {
    title: "contents.couponsCard.title",
    description: "contents.couponsCard.description",
  },
  couponActions: {
    editCoupon: "contents.couponActions.editCoupon",
    makeActive: "contents.couponActions.makeActive",
    makeInactive: "contents.couponActions.makeInactive",
    delete: "contents.couponActions.delete",
  },
  placeholders: {
    collections: "contents.placeholders.collections",
  },
  appearance: {
    textColor: "contents.appearance.textColor",
    textColorHint: "contents.appearance.textColorHint",
    followTheme: "contents.appearance.followTheme",
    darkText: "contents.appearance.darkText",
    whiteText: "contents.appearance.whiteText",
    buttonColor: "contents.appearance.buttonColor",
    buttonColorHint: "contents.appearance.buttonColorHint",
    chooseColor: "contents.appearance.chooseColor",
    color: "contents.appearance.color",
    colorPickerHint: "contents.appearance.colorPickerHint",
    selectColor: "contents.appearance.selectColor",
    cancelColorPicker: "contents.appearance.cancelColorPicker",
    defaultColor: "contents.appearance.defaultColor",
    receipt: "contents.appearance.receipt",
    receiptHint: "contents.appearance.receiptHint",
    receiptPlaceholder: "contents.appearance.receiptPlaceholder",
    maximumCharacter: "contents.appearance.maximumCharacter",
    supportEmail: "contents.appearance.supportEmail",
    supportEmailHint: "contents.appearance.supportEmailHint",
    supportEmailPlaceholder: "contents.appearance.supportEmailPlaceholder",
    validation: {
      invalidHex: "contents.appearance.validation.invalidHex",
      invalidSupportEmail: "contents.appearance.validation.invalidSupportEmail",
      fixErrors: "contents.appearance.validation.fixErrors",
      descriptionRequired: "contents.appearance.validation.descriptionRequired",
      logoNameRequired: "contents.appearance.validation.logoNameRequired",
      logoImageRequired: "contents.appearance.validation.logoImageRequired",
      desktopCoverRequired:
        "contents.appearance.validation.desktopCoverRequired",
      mobileCoverRequired: "contents.appearance.validation.mobileCoverRequired",
      layoutRequired: "contents.appearance.validation.layoutRequired",
    },
    coverImage: {
      title: "contents.appearance.coverImage.title",
      subtitle: "contents.appearance.coverImage.subtitle",
      uploadDesktop: "contents.appearance.coverImage.uploadDesktop",
      uploadMobile: "contents.appearance.coverImage.uploadMobile",
      desktopSize: "contents.appearance.coverImage.desktopSize",
      mobileSize: "contents.appearance.coverImage.mobileSize",
      desktopAlt: "contents.appearance.coverImage.desktopAlt",
      mobileAlt: "contents.appearance.coverImage.mobileAlt",
    },
    description: {
      label: "contents.appearance.description.label",
      hint: "contents.appearance.description.hint",
      placeholder: "contents.appearance.description.placeholder",
    },
    layouts: {
      title: "contents.appearance.layouts.title",
      subtitle: "contents.appearance.layouts.subtitle",
      preview: "contents.appearance.layouts.preview",
      saveSuccess: "contents.appearance.layouts.saveSuccess",
      options: {
        layout1: "contents.appearance.layouts.options.layout1",
        layout2: "contents.appearance.layouts.options.layout2",
        layout3: "contents.appearance.layouts.options.layout3",
      },
    },
    logo: {
      title: "contents.appearance.logo.title",
      subtitle: "contents.appearance.logo.subtitle",
      toggleText: "contents.appearance.logo.toggleText",
      togglePicture: "contents.appearance.logo.togglePicture",
      placeholder: "contents.appearance.logo.placeholder",
      uploadButton: "contents.appearance.logo.upload",
    },
  },
  general: {
    trailerLink: "contents.general.trailerLink",
    trailerLinkHint: "contents.general.trailerLinkHint",
    trailerLinkPlaceholder: "contents.general.trailerLinkPlaceholder",
    visibility: "contents.general.visibility",
    visibilityHint: "contents.general.visibilityHint",
    public: "contents.general.public",
    hidden: "contents.general.hidden",
    draft: "contents.general.draft",
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

export const SETTINGS = {
  title: "settings.title",
  tabs: {
    payout: "settings.tabs.payout",
    notifications: "settings.tabs.notifications",
    export: "settings.tabs.export",
  },
  export: {
    title: "settings.export.title",
    description: "settings.export.description",
    requestExport: "settings.export.requestExport",
    buildCsv: "settings.export.buildCsv",
    typeLabel: "settings.export.typeLabel",
    dateLabel: "settings.export.dateLabel",
    exportTypeUsersEmailSignups: "settings.export.exportTypeUsersEmailSignups",
    exportTypeSales: "settings.export.exportTypeSales",
    exportTypeViews: "settings.export.exportTypeViews",
    includeMedia: "settings.export.includeMedia",
    lastExported: "settings.export.lastExported",
    noExports: "settings.export.noExports",
    typeDescription: "settings.export.typeDescription",
    dateDescription: "settings.export.dateDescription",
    modalTitle: "settings.export.modalTitle",
    modalMessage: "settings.export.modalMessage",
  },
};

export const COMMON = {
  back: "common.back",
  close: "common.close",
  share: "common.share",
};

export const SUBSCRIPTION = {
  logoAlt: "subscriptionPage.logoAlt",
  title: "subscriptionPage.title",
  comparePlans: "subscriptionPage.comparePlans",
  continue: "subscriptionPage.continue",
  creatorDetails: {
    email: "subscriptionPage.creatorDetails.email",
    password: "subscriptionPage.creatorDetails.password",
    repeatPassword: "subscriptionPage.creatorDetails.repeatPassword",
  },
};

const TRANSLATION_KEYS = {
  HERO,
  NAV,
  AUTH,
  AUTH_FORM,
  AUTH_CREATOR,
  VIEWER_SIGNUP_PREFERENCE,
  CREATORS,
  TUTORIAL_VIDEOS,
  CREATOR_PROFILE,
  DASHBOARD_USERS,
  DASHBOARD_VIEWER_BILLINGS,
  CONTENTS,
  SETTINGS,
  COMMON,
  SUBSCRIPTION,
};

export default TRANSLATION_KEYS;
