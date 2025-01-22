export interface Restaurant {
  id: string;
  restaurantName: string;
  username: string;
  email: string;
  location: string;
  contactNumber: string;
  quote: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}