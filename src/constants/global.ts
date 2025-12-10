export interface PaginationTypes {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasMore:boolean;
}

export const defaultPagination = {
  totalItems: 0,
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  hasMore: false,
};
export const JWT_TOKEN = process.env.NEXT_PUBLIC_JWT_TOKEN || "";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;



// Property Types

export interface IProperty {
   _id: string;
  class: string;
  category: string;
  stage: string;
  style: string;
  currency: string;
  isBookmarked: boolean;
  instrumentType: string;
  name: string;
  about: string;
  totalNumberOfSfts: number;
  pricePerSft: number;
  basePropertyValue: number;
  totalPropertyValueAfterFees: number;
  investmentPerformance: InvestmentPerformance;
  rentalInformation: IRentalInformation;
  escrowInformation: EscrowInformation;
  legalAdivisory: LegalAdvisory;
  company: Company;
  brokerage: Company;
  loanInformation: LoanInformation;
  tokenInformation: TokenInformation;
  media: Media;
  hostedBy: HostedBy;
  city: string;
  country: string;
  landmark: string;
  state: string;
  bookmarkedByMe: boolean;
  bookmarks: number;
  faqs: FAQ[];
  tenants: Tenant[];
  amenities: Amenity[];
  expenses: Expense[];
  features: Feature[];
  fees: Fees;
  riskFactors: RiskFactor[];
  riskDisclosures: RiskDisclosure[];
  termsAndConditions: TermAndCondition[];
  exitOpportunities: ExitOpportunity[];
  additionalTaxes: AdditionalTax[];
  nearByLocations: NearByLocation[];
  documents: IDocument[];
  createdAt: string;
  updatedAt: string;
  longitude: number;
  latitude: number;
  investors: Investor[];
  lastTransaction?: {
    avatar: string;
    tokensBooked: number;
    tokenSymbol: string;
  };
  totalFundsRaised: number;
}

interface InvestmentPerformance {
  targetCapitalAppreciation: number;
  lockInPeriodType: string;
  lockInPeriodValue: number;
  grossTargetIRR: number;
  netTargetIRR: number;
  grossInvestmentMultiplier: number;
  netInvestmentMultiplier: number;
  estimatedSalePriceAsPerLockInPeriod: number;
  capitalGains: number;
  capitalGainsTax: number;
  estimatedReturnsAsPerLockInPeriod: number;
  netRentalYield: number;
  grossRentalYield: number;
  irr: number;
  moic: number;
}

export interface IRentalInformation {
  rentPerSft: number;
  vacancyRate: number;
  grossMonthlyRent: number;
  netMonthlyRent: number;
  grossAnnualRent: number;
  netAnnualRent: number;
  expenses: {
    monthlyExpenses: number;
    annualExpenses: number;
  };
  netCashFlow: number;
}

interface EscrowInformation {
  country: string;
  state: string;
  escrowBank: string;
  escrowAgent: string;
}

interface LegalAdvisory {
  name: string;
  documentURL: string;
}



export type Company = {
  _id: string;
  name: string;
  type: string;
  jurisdiction: string;
  formationDate: string;
  businessPurpose: string;
  status: string;
  currency: string;
  logo: string | null;
  memoAndTerms: {
    investmentMemorandum: string;
    termsAndConditions: string;
    riskFactor: string;
    investmentStrategy: string;
  };
  escrowBankDetails: {
    bankName: string;
    accountType: string;
    accountNumber: string;
    routingNumber: string | null;
    bankStatement: string | null;
  };
  legalDocuments: {
    llcOperatingAgreement: {
      name: string;
      url: string;
      _id: string;
    };
    articlesOfAssociation: {
      name: string;
      url: string;
      _id: string;
    };
    memorandumOfAssociation: {
      name: string;
      url: string;
      _id: string;
    };
    otherDocuments: null;
  };
  boardOfDirectors: {
    treasuryManager: {
      name: string | null;
      email: string | null;
      phoneNumber: string | null;
      idNumber: string | null;
      idProof: string | null;
    };
    assetManager: {
      name: string | null;
      email: string | null;
      phoneNumber: string | null;
      idNumber: string | null;
      idProof: string | null;
    };
  };
  daoConfiguration: {
    daoName: string;
    tokenSymbol: string;
    blockchain: string;
    governanceModel: string;
    proposalThresholdPercent: number;
    quorumPercent: number;
    votingPeriod: {
      days: number;
      hours: number;
    };
    decisionType: string;
    governanceRights: {
      votingRights: boolean;
      proposalCreation: boolean;
      adminVotePower: boolean;
    };
    issuerRepSignature: boolean;
  };
  completedSteps: string[];
  spvAddress: string;
  OnchainAddress: string;
  daoAddress: string;
  ledgerAddress: string;
  blockchainSpvId: string;
  blockchainCompanyId: string;
  idHash: string;
  walletAddress: string;
  transactionHash: string;
  metadata: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};


interface LoanInformation {
  hasAssetPossesLoan: boolean;
  currentLoanAmount: number;
  totalNumberOfYears: number;
  totalLoanAmount: number;
  numberOfEMIsYetToPay: number;
  interestRate: number;
  pendingLoanAmount: number;
  bankName: string;
  brankBranch: string;
}

export interface TokenInformation {
  tokenSupply: number;
  minimumTokensToBuy: number;
  tokenPrice: number;
  tokenSymbol: string;
  availableTokensToBuy: number;
  maximumTokensToBuy: number; 
  blockchainProjectAddress?: string;
  blockchainEscrowAddress?: string;
  blockchainOrderManagerAddress?: string;
  blockchainDaoAddress?: string;
  
}

interface Media {
  imageURL: string;
  videoURL: string;
  gallery: string[];
  pitchDeckURL?: string;
}

interface HostedBy {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logoURL: string;
  whatsappNumber?: string;
  totalProjects: number;
  onGoingProjects: number;
  primeLocation?: string;
  issuerProfileDescription?: string;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface IDocument {
  _id: string;
  name: string;
  description: string;
  type: "asset-document";
  format: string | null;
  document: {
    name: string;
    url: string;
  };
  isProtected: boolean;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface Tenant {
  _id: string;
  name: string;
  rentPerSft: number;
  sftsAllocated: number;
  annualRentEscalation: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'pending';
  type: string;
  lockInPeriod: number;
  leasePeriod: number;
  securityDeposit: number;
  interestOnSecurityDeposit: number;
  agreement: string;
  logo: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Amenity {
  _id: string;
  name: string;
  description: string;
  image: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Expense {
  _id: string;
  expenseName: string;
  isPercentage: boolean;
  value: number;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Feature {
  _id: string;
  name: string;
  description: string;
  image: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Fee {
  _id: string;
  assetId: string;
  type: string;
  name: string;
  value: number;
  isPercentage: boolean;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Fees {
  registration: Fee[];
  legal: Fee[];
  brokerage: Fee[];
  platform: Fee[];
  reserves: Fee[];
  insurance: Fee[];
}

export interface RiskFactor {
  _id: string;
  name: string;
  description: string;

  __v?: number;
}

interface RiskDisclosure {
  _id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface TermAndCondition {
  _id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface ExitOpportunity {
  _id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface AdditionalTax {
  _id: string;
  name: string;
  value: number;
  __v?: number;
}

interface NearByLocation {
  _id: string;
  name: string;
  distanceInKm: number;
  travelTime?: number;
  address: string;
  locationType: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}



export interface IOrder {
  _id: string;
  currentStatus?: string;
  asset: {
    _id: string;
    name: string;
    country: string;
    state: string;
    city: string;
    landmark: string;
    tokenInformation: {
      availableTokensToBuy: number;
      tokenPrice: number;
    };
  };
  investor: {
    _id: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    avatar: string;
  };
  company: {
    _id: string;
    name: string;
    currency: string;
  };
  tracking: {
    title: string;
    description: string;
    status: string;
    isCompleted: boolean;
    comingOrder: number;
    completedAt: string | null;
    dueDate: string | null;
  }[];
  payment: {
    totalOrderValue: number;
    totalFeePaid: number;
    currency: string;
    tokensBooked: number;
    ownershipPercentage: number;
    breakup: any[];
    transaction: {
      statusCode: string;
      statusMessage: string;
      referenceId: string;
      amount: number;
      checkoutRequestId: string;
      phoneNumber: string;
      status: string;
      _id: string;
    };
  };
}

export interface BreakupItem {
  name: string
  value: number
  percentage: number
  isPercentage: boolean
  _id: string
}

export interface TrackingStep {
  title: string
  description: string
  status: string
  isCompleted: boolean
  comingOrder: number
  completedAt: string | null
  dueDate: string | null
  _id: string
}
export interface AssetDetails {
  name: string;
  image: string;
  location: string;
}
export interface RentalDistribution {
  month: string; // ISO date string
  rentalIncome: number;
  _id: string;
}
export interface Asset {
  assetId: string;
  assetDetails: AssetDetails;
  investedAmount: number;
  currentValue: number;
  tokens: number;
  tokenPrice: number;
  investedDate: string; // ISO date string
  rentalDistributions: RentalDistribution[];
  latestValue: number;
  moic: number;
  _id: string;
  // Add other asset properties as needed
}

export interface Investor {
  _id: string
  fullName: string
  email: string
  avatar: string
  // Add other investor properties as needed
}

export interface Transaction {
  statusCode: string
  statusMessage: string
  referenceId: string
  amount: number
  checkoutRequestId: string
  phoneNumber: string
  status: string
  _id: string
}

export interface Order {
  _id: string
  tokensBooked: number
  totalOrderValue: number
  paymentType: string
  hasFullPaymentDone: boolean
  currentStatus: string
  totalFeePaid: number
  currency: string
  tracking: TrackingStep[]
  breakup: BreakupItem[]
  transaction?: Transaction
  createdAt: string
  updatedAt: string
  asset: Asset
  investor: Investor
}
export interface Portfolio {
  assets: Asset[];
  _id: string;
  userId: string;
  totalValue: number;
  holdings: number;
  holdingsPercentage: number;
  cashFlows: number;
  totalInvestment: number;
  createdAt: string;
  updatedAt: string;
}

export interface Summary {
  uniqueAssets: number;
  totalOrders: number;
  totalInvestment: number;
  totalTokens: number;
  totalCurrentValue: number;
}

export interface CashFlowBreakdown {
  date: string;
  monthlyTotalValue: number;
  monthlyCashFlows: number;
  monthlyHoldings: number;
}
export interface PortfolioResponse {
  portfolio: Portfolio;
  summary: Summary;
  cashFlowBreakdown: CashFlowBreakdown;
  userId: string;
  totalValue: number;
  holdings: number;
  cashFlows: number;
  totalInvestment: number;
}


export type TrackingUIState = "completed" | "active" | "inactive"

export interface TrackingStepWithUIState extends TrackingStep {
  uiState: TrackingUIState
}

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};


export const formatStringToTitleCase = (str: string) => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};