import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, CopyIcon } from "lucide-react";
import React, { useState } from "react";

type Props = {
  property: any;
  order: any;
};

const OrderDetails: React.FC<Props> = ({ property, order }) => {
  const [copied, setCopied] = useState<string | null>(null);

  // safe helpers
  const safeSliceId = (id?: string, len = 4) => {
    if (!id || typeof id !== "string") return "-";
    return id.length <= len ? id : id.slice(-len);
  };

  const formatTokens = (tokens?: number) => {
    if (tokens === null || tokens === undefined) return "-";
    // you can adapt decimals as required
    return Number(tokens).toLocaleString();
  };

  const copyToClipboard = async (text: string | undefined, label?: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label || text);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) {
      // fallback: select & prompt (rare on browsers with clipboard blocked)
      console.error("Copy failed", e);
    }
  };
  const openOnExplorer = (tx?: string) => {
    // default to Etherscan mainnet. Replace base if you use other chain/explorer.
    const url = `https://amoy.polygonscan.com/tx/${tx}`;


    window.open(url, "_blank", "noopener,noreferrer");
  };

  const fields = [
    {
      name: "Property",
      value: property?.name ?? "-",
      icon: <ArrowUpRight size={17} />,
    },
    {
      name: "Tokens",
      value: formatTokens(order?.tokensBooked),
      icon: <ArrowUpRight size={17} />,
    },
    {
      name: "Token Name",
      value: order?.transaction?.symbol ?? property?.tokenInformation?.tokenSymbol ?? "-",
      icon: <ArrowUpRight size={17} />,
    },
    {
      name: "Amount paid",
      // show currency if available
      value:
        order?.totalOrderValue !== undefined && (order?.company?.currency || order?.currency)
          ? `${formatCurrency(order?.totalOrderValue)} ${(order?.company?.currency || order?.currency)}`
          : order?.totalOrderValue !== undefined
          ? formatCurrency(order?.totalOrderValue)
          : "-",
      icon: <ArrowUpRight size={17} />,
    },
    // {
    //   name: "Upcoming Dividends",
    //   // you didn't supply upcoming dividends in payload; attempt to use order.upcomingDividends
    //   value:
    //     order?.upcomingDividends !== undefined
    //       ? `${formatCurrency(order.upcomingDividends)} ${order?.currency ?? ""}`
    //       : "-",
    //   icon: <ArrowUpRight size={17} />,
    // },
    {
      name: "Order Id",
      value: safeSliceId(order?._id),
      icon: <CopyIcon size={17} />,
      onClick: () => copyToClipboard(order?._id, "OrderId"),
      fullValue: order?._id,
    },
    {
      name: "Payment Id",
      value: safeSliceId(order?.paymentId ?? order?._id),
      icon: <CopyIcon size={17} />,
      onClick: () => copyToClipboard(order?.paymentId ?? order?._id, "PaymentId"),
      fullValue: order?.paymentId ?? order?._id,
    },
    {
      name: "Transaction Hash",
      value:
        order?.transaction?.txHash
          ? `${order.transaction.txHash.slice(0, 8)}...${order.transaction.txHash.slice(-6)}`
          : "-",
      icon: <CopyIcon size={17} />,
      onClick: () => copyToClipboard(order?.transaction?.txHash, "TxHash"),
      fullValue: order?.transaction?.txHash,
    },
    {
      name: "View on block chain",
      value: order?.transaction?.txHash ? "View transaction" : "View project address",
      icon: <ArrowUpRight size={17} />,
      color: "text-violet-500",
      onClick: () =>
        openOnExplorer(order?.transaction?.txHash),
    },
    // {
    //   name: "Project Address",
    //   value: order?.projectAddress ? `${order.projectAddress.slice(0, 8)}...${order.projectAddress.slice(-6)}` : "-",
    //   icon: <CopyIcon size={17} />,
    //   onClick: () => copyToClipboard(order?.projectAddress, "ProjectAddress"),
    //   fullValue: order?.projectAddress,
    // },
    // {
    //   name: "Escrow Address",
    //   value: order?.escrowAddress ? `${order.escrowAddress.slice(0, 8)}...${order.escrowAddress.slice(-6)}` : "-",
    //   icon: <CopyIcon size={17} />,
    //   onClick: () => copyToClipboard(order?.escrowAddress, "EscrowAddress"),
    //   fullValue: order?.escrowAddress,
    // },
    // {
    //   name: "Order Manager",
    //   value: order?.orderManagerAddress ? `${order.orderManagerAddress.slice(0, 8)}...${order.orderManagerAddress.slice(-6)}` : "-",
    //   icon: <CopyIcon size={17} />,
    //   onClick: () => copyToClipboard(order?.orderManagerAddress, "OrderManager"),
    //   fullValue: order?.orderManagerAddress,
    // },
  ];
  return (
    <div className="px-1 space-y-3 mt-4">
      {fields.map((field) => (
        <div key={field.name} className="flex justify-between items-center">
          <h3 className="text-muted-foreground text-sm">{field.name}</h3>

          <div
            className={`flex items-center gap-3 ${("color" in field && (field as any).color) ? (field as any).color : ""}`}
          >
            <button
              onClick={() => (field.onClick ? field.onClick() : null)}
              className="flex items-center gap-2 focus:outline-none"
              aria-label={typeof field.value === "string" ? `Action for ${field.name}` : field.name}
              title={typeof (field as any).fullValue === "string" ? (field as any).fullValue : undefined}
            >
              <span className="text-md font-semibold">{field.value}</span>
              <span className="opacity-80">{field.icon}</span>
            </button>
          </div>
        </div>
      ))}

      {/* small feedback line for copy */}
      <div aria-live="polite" className="text-xs text-muted-foreground h-4">
        {copied ? `${copied} copied to clipboard` : ""}
      </div>
    </div>
  );
};

export default OrderDetails;
