export const mockOrder = {
    id: "00192834",
    property: {
      name: "Spiderman 4",
      category: "Marvel",
    },
    number_of_tokens: 10,
    price_per_token: 9050,
    total_amount: 90500,
    status: "payment_confirmation",
    created_at: "2024-02-13T12:30:00.000Z",
    timeline: [
      {
        step: "order_confirmed",
        title: "Your order confirmed",
        description: "We have confirmed your booking & shared a receipt to your email.",
        completed: true,
        timestamp: "2025-02-13T12:30:00.000Z",
      },
      {
        step: "awaiting_investment",
        title: "Awaiting for 100% investment",
        description: "Property is still accepting investments and we appreciate your patience.",
        completed: true,
        // deadline: "2025-02-17T12:30:00.000Z",
      },
      {
        step: "document_signatures",
        title: "Document signatures",
        description: "We have confirmed your booking & shared a receipt to your email.",
        completed: true,
        deadline: "2025-02-20T12:30:00.000Z",
      },
      {
        step: "payment_confirmation",
        title: "Full payment confirmation",
        description: "We have confirmed your booking & shared a receipt to your email.",
        completed: false,
        deadline: "2025-02-23T12:30:00.000Z",
      },
      {
        step: "wallet_connection",
        title: "Connect to wallet",
        description:
          "Securely connect your Web3 wallet to access decentralized features, manage your assets, and authorize transactions seamlessly.",
        completed: false,
        // deadline: "2025-02-26T12:30:00.000Z",
      },
      {
        step: "token_transfer",
        title: "Security token transfer",
        description: "We have confirmed your booking & shared a receipt to your email.",
        completed: false,
        // deadline: "2025-02-28T12:30:00.000Z",
      },
    ],
  }
  
  