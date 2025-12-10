
export interface ProjectManagerType {
    name: string;
    role: string;
    avatar: string;
    rating: number;
    totalReviews: number;
    isVerified: boolean;
    email:string;
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

  export const projectManagerData: ProjectManagerType = {
    name: "Mani Suresh",
    role: "Project Manager",
    avatar: "/project.svg", // You'll need to add the actual image
    rating: 4.6,
    totalReviews: 23,
    isVerified: true,
    email:"surya@fandora.in",
    response: {
      timeFrame: "Within 1-2 hours"
    },
    location: {
      city: "Hyderabad",
      type: "prime"
    },
    contact: {
      phone: "+919876543210", // Add actual phone number
      whatsapp: "+919876543210" // Add actual WhatsApp number
    }
  };