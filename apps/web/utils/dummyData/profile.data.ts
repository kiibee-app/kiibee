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
