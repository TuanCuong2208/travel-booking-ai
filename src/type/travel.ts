export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Tour {
  id: string;
  title: string;
  destination: string;
  price: number;
  duration: string;
  image: string;
  rating: number;
  featured: boolean;
  description: string;
  itinerary: { day: number; title: string; detail: string }[];
  reviews?: Review[];
}

export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedTourId?: string;
}