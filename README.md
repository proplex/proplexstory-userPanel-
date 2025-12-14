# Proplex - Real-World Asset Investment Platform

Proplex is a pioneering blockchain platform democratizing access to high-value real-world assets (RWAs) such as commercial real estate, private equity, and infrastructure projects. By enabling fractional ownership through tokenized assets, Proplex removes traditional barriers and empowers global retail investors to participate in opportunities previously limited to institutions.

Built natively on Story Protocol, Proplex leverages its decentralized IP graph, scalable infrastructure, and trustless verification layers to deliver secure, compliant, and high-performance RWA tokenization.

At its core, Proplex introduces a dual-token system:

- Asset Tokens representing direct ownership in RWAs
- Proplex Utility Token (PXT) used for governance, network fees, and ecosystem participation

All transactions, settlements, and compliance validations occur through Story Protocol's composable network modules, ensuring transparent, verifiable, and cost-efficient operations.

By merging structured compliance, decentralized governance, and real-world asset backing, Proplex bridges the gap between traditional finance (TradFi) and Web3, enabling a global, borderless investment economy.

Proplex Demo Link:- https://drive.google.com/drive/folders/1l6PdWTQI5-5WgsBa-yXufjypg_KBIQGx

DEMO LINK:- https://proplex.vercel.app/

## 🏠 Features

- **RWA Investment**: Browse and invest in fractional tokenized assets across real estate, private equity, and infrastructure projects
- **User Authentication**: Secure sign-up, login, and password recovery with wallet-based sessions
- **KYC/AML Verification**: Streamlined OnChainID integration for compliant wallet verification
- **Story Protocol Wallet Management**: Connect and track portfolios on Story Protocol; manage IP tokens and Asset Tokens
- **Investment Management**: View, manage, and trade investments with real-time yield tracking and secondary market liquidity via internal DEX
- **DAO Governance**: Vote on proposals using PXT tokens via Snapshot integration
- **Responsive Design**: Optimized for desktop, mobile, and decentralized hosting via IPFS
- **Yield Automation**: Automated quarterly distributions of rental income, dividends, and ESG-aligned returns in USDC

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: TailwindCSS with ShadCN UI components
- **State Management**: React Query for server state and on-chain data fetching
- **Authentication**: WalletConnect and JWT with secure HTTP-only cookies
- **Form Handling**: React Hook Form with Zod validation for investment and KYC forms
- **Blockchain Integration**: ethers.js for Story Protocol interactions; wagmi for Ethereum compatibility
- **Payments & Stablecoins**: Circle USDC integration for all settlements; no fiat gateways to ensure DeFi alignment
- **Compliance & Identity**: OnChainID for decentralized KYC/AML; ERC-3643 compliant tokens for regulated transfers

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git
- MetaMask or compatible wallet for Story Protocol

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ryzerofficial/proplex-user.git
   cd proplex-user
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the necessary environment variables (see Environment Variables section below).

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser. Connect your wallet to interact with Story Protocol testnet RWAs.

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

For decentralized deployment, export to static files and pin to IPFS via Pinata or Fleek.

## 📂 Project Structure

```
src/
├── app/                    # App router pages and layouts
│   ├── api/                # API routes for off-chain queries
│   ├── auth/               # Wallet authentication and OnChainID KYC pages
│   ├── assets/             # RWA browsing, tokenization, and investment details
│   ├── wallet/             # Story Protocol portfolio and USDC management
│   ├── governance/         # DAO voting and PXT staking pages
│   └── ...
├── components/             # Reusable UI components (e.g., AssetCard, YieldChart)
├── constants/              # Application constants (e.g., chain IDs, USDC addresses)
├── lib/                    # Utility functions (e.g., cross-chain bridging, oracle fetches)
├── store/                  # State management (e.g., wallet slices, RWA metadata)
└── types/                  # TypeScript type definitions (e.g., AssetToken, YieldData)
```

## 📝 Environment Variables

Create a `.env.local` file and add the following variables:

```
NEXT_PUBLIC_API_URL=your_proplex_api_url_here
NEXT_PUBLIC_ONCHAINID_API_KEY=your_onchainid_api_key
NEXT_PUBLIC_USDC_ADDRESS=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48  # Mainnet USDC on Ethereum
NEXT_PUBLIC_STORY_PROTOCOL_RPC=https://aeneid.storyrpc.io
NEXT_PUBLIC_STORY_PROTOCOL_EXPLORER=https://aeneid.storyscan.io
WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
# Add other variables for Story Protocol endpoints, etc., as needed
```

**Security Note**: Never commit sensitive keys. Use .gitignore for .env files. All smart contracts are audited by CertiK and PeckShield.

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingRWAFeature`)
3. Commit your changes (`git commit -m 'Add multi-chain yield tracking'`)
4. Push to the branch (`git push origin feature/AmazingRWAFeature`)
5. Open a Pull Request

Contributions aligning with Proplex's roadmap (e.g., AI-driven asset discovery in Maturity Phase) are especially welcome!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [ShadCN UI Documentation](https://ui.shadcn.com/docs)
- [Story Protocol Documentation](https://docs.storyprotocol.xyz/)
- [OnChainID Documentation](https://docs.onchainid.com/)