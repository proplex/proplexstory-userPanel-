"use client";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";
const Components = ({ orderData }: { orderData: any }) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{orderData?.order?.property?.name}</h2>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {orderData?.order?.status}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Order ID</div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{orderData?.order?.id}</span>
              <Button variant="ghost" size="icon" className="h-4 w-4">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-lg font-medium">{orderData?.order?.number_of_token} Shares</div>
            <div className="text-sm text-gray-500">(Per token: ₹ {orderData?.order?.property?.token_amount})</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Your investment</div>
            <div className="text-lg font-medium">₹ {orderData?.order?.property?.token_amount * orderData?.order?.number_of_token}</div>
          </div>
        </div>
        <Button variant="link" className="mt-2 p-0 text-[#8968ff]">
          See break-up
        </Button>
      </CardContent>
    </Card>


  );
};

export default Components;
