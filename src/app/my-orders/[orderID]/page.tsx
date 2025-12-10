"use client";
import React from "react";
import TokenStatus from "./(components)/TokenStatus";
// import { order_res } from "./dummyOrder";
import OrderDetails from "./(components)/OrderDetails";
import { useFetchPropertyById } from "@/hooks/property/useFetchPropertyById";
import { IProperty } from "@/constants/global";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight, PhoneCall } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import AssetManager from "./(components)/AssetManager";
import useFetchOrderById from "@/hooks/order/useFetchOrderById";
import PropertyHeader from "@/components/my-orders/(components)/PropertyHeader";

const OrderStatus = () => {
  const params = useParams();
  const router = useRouter();

  const {
    fetchOrder,
    order,
    error: orderError,
    loading: orderLoading,
  } = useFetchOrderById(params?.myOrdersID as string);
  console.log("order", order);
  const { property, error, loading } = useFetchPropertyById(
    order?.asset._id as string
  );

  console.log("order", order);
  //   console.log("params", params);
  const handleViewOnBlockchain = () => {
    const address = property?.tokenInformation?.blockchainProjectAddress;
    if (address) {
      window.open(
        `https://explorer.testnet.xrplevm.org/token/${address}`,
        "_blank"
      );
    }
  };
  if (loading || orderLoading) {
    return <h1>Loading......</h1>;
  }
  return (
    <div className="lg:space-y-5">
      <PropertyHeader
        property={property as IProperty}
        handleViewOnBlockchain={handleViewOnBlockchain}
        assetmanager={false}
      />

      <div className="flex justify-center gap-3 items-center flex-wrap">
        <div className="lg:w-[40%] max-md:w-full max-md:p-4">
          <div className="w-full shadow border rounded-lg p-4">
            <TokenStatus status={order?.currentStatus} />
            <OrderDetails property={property} order={order} />
            <hr className="my-2" />
            <div className="max-md:p-1">
              <h1 className="text-xl font-bold">Support Needed?</h1>
              <AssetManager
                assetmanager={property?.company?.boardOfDirectors?.assetManager}
              />
            </div>
          </div>
          <div className="flex justify-between items-center lg:my-5 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:px-4 max-md:gap-8 max-md:bg-white max-md:py-4 max-md:rounded-t-lg">
            <Button
              onClick={() => router.push("/orders")}
              variant="default"
              className="bg-black hover:bg-black/80 max-md:w-full"
            >
              <ArrowLeft />
              View Orders
            </Button>
            <Button
              className="max-md:w-full"
              onClick={() => router.push("/portfolio")}
            >
              My Portfolio <ArrowUpRight />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderStatus;
