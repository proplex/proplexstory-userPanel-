export interface ProjectManagerType {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  response: {
    timeFrame: string;
  };
  location: {
    city: string;
    type: "prime" | "secondary";
  };
  contact: {
    phone: string;
    whatsapp: string;
  };
} 