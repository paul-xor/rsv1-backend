
interface ISearchResult {
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

export const handler = async (event: any): Promise<any> => {
  const searchResults = event;

  const formattedResults = searchResults.map((result: ISearchResult) => {

  return {
    id: result.id,
    arrival_date: result.arrival_date,
    departure_date: result.departure_date,
    room_size: result.room_size,
    room_quantity: result.room_quantity,
    first_name: result.first_name,
    last_name: result.last_name,
    email: result.email,
    phone: result.phone,
    street_name: result.street_name,
    street_number: result.street_number,
    zip_code: result.zip_code,
    state: result.state,
    city: result.city,
    extras: result.extras,
    payment: result.payment,
    note: result.note,
    tags: result.tags,
    reminder: result.reminder,
    newsletter: result.newsletter,
    confirm: result.confirm
  };
});

  return formattedResults;
};
