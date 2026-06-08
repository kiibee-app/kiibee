import {
  DUMMY_REGISTRATIONS,
  DUMMY_SALES,
  type RegistrationItem,
  type SalesItem,
} from './dummyUsers.data';

let registrations: RegistrationItem[] = [...DUMMY_REGISTRATIONS];

export const getRegistrations = (): RegistrationItem[] => [...registrations];

export const deleteRegistration = (id: string): boolean => {
  const initialLength = registrations.length;
  registrations = registrations.filter((item) => item.id !== id);
  return registrations.length < initialLength;
};

export const getSales = (): SalesItem[] => [...DUMMY_SALES];
