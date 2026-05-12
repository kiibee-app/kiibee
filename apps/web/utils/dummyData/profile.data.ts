export const createInitialProfileData = (email: string) => ({
  firstName: "Lena",
  lastName: "Jakobssen",
  company: "",
  phone: "+4567321145",
  cvr: "45672345",
  address: "Jagtvej 17",
  city: "Copenhagen",
  postal: "2400",
  reg: "3120",
  account: "5555",
  email,
});

export const emptyPasswords = {
  current: "",
  next: "",
  confirm: "",
};

export const creatorProfileData = {
  name: "Lena Petersen",
  email: "lena@gmail.com",
};

export const viewerProfileData = {
  name: "Lena Petersen",
  email: "Lena_Petersen@gmail.com",
  downloads: 15,
};

export const creatorInfoModalData = {
  name: "Raul Jones",
  description:
    "Online kurser i Kammas Kantine er til dig, der gerne vil lære at få krammet på din krop. Det får du med viden, sundhed, praktiske tips og tricks og fantastiske retter - der er enkle at lave i dit eget køkken.\nSom kostvejleder og professionel formidler serverer jeg viden om sund mad på en forståelig måde - uden dogmer og løftede pegefingre.\nAlt er nøje planlagt, så du kan kramme din krop på kærligste, mest smagfulde vis. \n \n Online kurser i Kammas Kantine er til dig, der gerne vil lære at få krammet på din krop. Det får du med viden, sundhed, praktiske tips og tricks og fantastiske retter - der er enkle at lave i dit eget køkken.\nSom kostvejleder og professionel formidler serverer jeg viden om sund mad på en forståelig måde - uden dogmer og løftede pegefingre.\nAlt er nøje planlagt, så du kan kramme din krop på kærligste, mest smagfulde vis. ",
  joinedDate: "24th Nov 2023",
  uploads: 42,
  links: {
    facebook: "facebook.com/rauljones",
    twitter: "twitter.com/rauljones",
  },
};
