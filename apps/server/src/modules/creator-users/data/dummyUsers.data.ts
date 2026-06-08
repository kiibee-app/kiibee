export type RegistrationItem = {
  id: string;
  name: string;
  email: string;
  date: string;
};

export type SalesItem = {
  id: string;
  name: string;
  email: string;
  price: string;
  type: string;
  date: string;
};

export const DUMMY_REGISTRATIONS: RegistrationItem[] = [
  {
    id: 'reg-1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    date: '17 Oct 2025',
  },
  {
    id: 'reg-2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    date: '17 Oct 2025',
  },
  {
    id: 'reg-3',
    name: 'Carol White',
    email: 'carol.white@example.com',
    date: '17 Oct 2025',
  },
  {
    id: 'reg-4',
    name: 'David Brown',
    email: 'david.brown@example.com',
    date: '17 Oct 2025',
  },
  {
    id: 'reg-5',
    name: 'Eva Green',
    email: 'eva.green@example.com',
    date: '17 Oct 2025',
  },
  {
    id: 'reg-6',
    name: 'Frank Black',
    email: 'frank.black@example.com',
    date: '17 Oct 2025',
  },
  {
    id: 'reg-7',
    name: 'Grace Hall',
    email: 'grace.hall@example.com',
    date: '17 Oct 2025',
  },
  {
    id: 'reg-8',
    name: 'Henry Adams',
    email: 'henry.adams@example.com',
    date: '17 Oct 2025',
  },
  {
    id: 'reg-9',
    name: 'Ivy Clark',
    email: 'ivy.clark@example.com',
    date: '17 Oct 2025',
  },
  {
    id: 'reg-10',
    name: 'Jack Lewis',
    email: 'jack.lewis@example.com',
    date: '17 Oct 2025',
  },
  {
    id: 'reg-11',
    name: 'Luna Scott',
    email: 'luna.scott@example.com',
    date: '17 Oct 2025',
  },
];

export const DUMMY_SALES: SalesItem[] = [
  {
    id: 'sale-1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    price: '200 Kr',
    type: 'Purchase',
    date: '17 Oct 2025',
  },
  {
    id: 'sale-2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    price: '98 Kr',
    type: 'Rent',
    date: '17 Oct 2025',
  },
  {
    id: 'sale-3',
    name: 'Carol White',
    email: 'carol.white@example.com',
    price: '1,65 Kr',
    type: 'Purchase',
    date: '17 Oct 2025',
  },
  {
    id: 'sale-4',
    name: 'David Brown',
    email: 'david.brown@example.com',
    price: '60 Kr',
    type: 'Purchase',
    date: '17 Oct 2025',
  },
  {
    id: 'sale-5',
    name: 'Eva Green',
    email: 'eva.green@example.com',
    price: '330.63 Kr',
    type: 'Purchase',
    date: '17 Oct 2025',
  },
  {
    id: 'sale-6',
    name: 'Frank Black',
    email: 'frank.black@example.com',
    price: '44 Kr',
    type: 'Rent',
    date: '17 Oct 2025',
  },
  {
    id: 'sale-7',
    name: 'Grace Hall',
    email: 'grace.hall@example.com',
    price: '1,3 Kr',
    type: 'Rent',
    date: '17 Oct 2025',
  },
  {
    id: 'sale-8',
    name: 'Henry Adams',
    email: 'henry.adams@example.com',
    price: '770 Kr',
    type: 'Purchase',
    date: '17 Oct 2025',
  },
  {
    id: 'sale-9',
    name: 'Ivy Clark',
    email: 'ivy.clark@example.com',
    price: '250 Kr',
    type: 'Purchase',
    date: '17 Oct 2025',
  },
  {
    id: 'sale-10',
    name: 'Jack Lewis',
    email: 'jack.lewis@example.com',
    price: '550 Kr',
    type: 'Purchase',
    date: '17 Oct 2025',
  },
  {
    id: 'sale-11',
    name: 'Lily Evans',
    email: 'lily.evans@example.com',
    price: '120 Kr',
    type: 'Rent',
    date: '18 Oct 2025',
  },
];
