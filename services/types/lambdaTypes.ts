

export interface ReservationData {
  arrival_date: string,
  departure_date: string,
  room_size: string,
  room_quantity: string,
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street_name: string;
  street_number: string;
  zip_code: string;
  state: string;
  city: string;
  extras: string;
  payment: string;
  note: string;
  tags: string;
  reminder: string;
  newsletter: string;
  confirm: string;
}

export interface ISearchResult {
  id: string;
  arrival_date: string;
  departure_date: string;
  room_size: string;
  room_quantity: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street_name: string;
  street_number: string;
  zip_code: string;
  state: string;
  city: string;
  extras: string;
  payment: string;
  note: string;
  tags: string;
  reminder: boolean;
  newsletter: boolean;
  confirm: boolean;
}