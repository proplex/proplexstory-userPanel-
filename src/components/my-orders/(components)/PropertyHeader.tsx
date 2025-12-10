"use client";
import PropertyHeaderSKeleton from "@/components/placeOrder/PropertyHeaderSKeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IProperty } from "@/constants/global";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowUpRightIcon,
  Building2,
  CheckCircle,
  DollarSign,
  PhoneCall,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const PropertyHeader = ({
  property,
  handleViewOnBlockchain,
  assetmanager = true,
  loading,
}: {
  property: IProperty;
  handleViewOnBlockchain: any;
  assetmanager?: boolean;
  loading?: boolean;
}) => {
  const router = useRouter();

  if (loading) {
    return <PropertyHeaderSKeleton />;
  }

  return (
    <div className="flex justify-center items-center gap-10 mt-10 w-full bg-white/40 max-md:justify-start ">
      <div className="lg:w-[37%] max-md:px-4 flex flex-col justify-start ">
        <div className="flex items-center gap-2">
          <ArrowLeft
            onClick={() => router.back()}
            className="cursor-pointer"
            size={18}
          />
          <h1 className="text-xl font-bold flex gap-1 items-center max-md:text-[18px] max-sm:text-[16px]">
            <span> {property?.name || "Property Name"}{" "},</span> <span>{property?.city || "City"},</span>{" "}
            <span>{property?.country || "Country"} </span>{" "}
            <span className="">
              <ArrowUpRight size={18} className="text-blue-500 " />
            </span>
          </h1>
        </div>
        {/* //Badges */}
        <div className="flex flex-wrap gap-2 mt-3 ml-3">
          <div className="rounded-full flex w-auto h-auto  ">
            <div className="flex justify-center gap-2  items-center bg-gray-700 rounded-l-full p-1 text-[12px] font-medium text-white">
              <Building2 size={15} className="ml-1" />{" "}
              {property?.tokenInformation?.tokenSymbol}
              <ArrowUpRightIcon
                className="cursor-pointer"
                onClick={handleViewOnBlockchain}
                size={16}
              />
            </div>
            <div className="flex justify-center gap-0   items-center bg-gray-300 rounded-r-full p-1  text-[12px] font-medium mr-2 pr-2 text-black">
              Ksh {property?.tokenInformation?.tokenPrice}{" "}
              Per Token
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-[#9384FF] rounded-full bg-[#ECEFFF] border-purple-200 font-medium"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Proof of Reserves
          </Badge>
          <Badge
            variant="outline"
            className="text-[#485F71] bg-[#E2F2FF] rounded-full border-green-200 font-medium"
          >
            <Shield className="h-3 w-3 mr-1" />
            Legally Verified
          </Badge>
        </div>
      </div>

      <div
        className={` flex justify-between items-center  px-3 py-3 bg-white rounded-xl lg:w-[400px] max-sm:hidden   ${
          assetmanager ? "shadow" : "" 
        }`}
      >
        {assetmanager && (
          <>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-400"></div>
              <div>
                <h1 className="text-lg font-bold">Charan Teja</h1>
                <p className="text-md">Asset Manager</p>
              </div>
            </div>
            <div>
              <Button variant="default" className="bg-gray-700 mx-2 p-3">
                <PhoneCall />
              </Button>
              <Button variant="default" className="bg-gray-700 ml-2 px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.13205 10.7208L0.180664 14.1946L3.73553 13.2624C4.71505 13.7966 5.81778 14.0781 6.93998 14.0785H6.94287C10.6387 14.0785 13.6472 11.0709 13.6488 7.37485C13.6494 5.58347 12.9524 3.89923 11.6865 2.63209C10.4202 1.36496 8.73663 0.666891 6.94287 0.666016C3.24646 0.666016 0.238435 3.67316 0.236931 7.36944C0.236554 8.55093 0.545269 9.70427 1.13205 10.7208ZM1.36918 7.3698C1.37031 4.29772 3.87056 1.79838 6.94502 1.79838C8.43384 1.79901 9.8331 2.37925 10.8855 3.43237C11.9378 4.48549 12.517 5.88551 12.5164 7.37432C12.5152 10.4466 10.0149 12.9463 6.94286 12.9463H6.94074C5.94037 12.9458 4.95946 12.6772 4.1039 12.1695L3.9002 12.0487L1.79067 12.6019L2.35387 10.5459L2.22124 10.3351C1.66334 9.44791 1.36873 8.42254 1.36918 7.3698Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.26692 4.56689C5.14133 4.28795 5.0092 4.28229 4.88989 4.2774C4.79217 4.27325 4.68039 4.2735 4.56874 4.2735C4.45696 4.2735 4.27547 4.31545 4.12199 4.48312C3.96839 4.65079 3.53546 5.05609 3.53546 5.8805C3.53546 6.70491 4.13593 7.50144 4.21958 7.61335C4.30335 7.72513 5.3787 9.47091 7.08191 10.1425C8.49725 10.7006 8.78524 10.5896 9.09257 10.5617C9.39978 10.5338 10.0839 10.1564 10.2234 9.76518C10.3631 9.37395 10.3631 9.03874 10.3213 8.96865C10.2793 8.8987 10.1677 8.85687 10 8.7731C9.83246 8.68933 9.00867 8.2839 8.85507 8.22801C8.70147 8.17212 8.58981 8.14424 8.47803 8.31191C8.36638 8.47958 8.04548 8.85687 7.94764 8.96865C7.84993 9.08056 7.75221 9.0945 7.58454 9.01073C7.417 8.9267 6.87731 8.74999 6.23715 8.17916C5.73904 7.73505 5.40282 7.18657 5.30498 7.0189C5.20727 6.85123 5.29455 6.76055 5.37858 6.67703C5.45381 6.60192 5.54612 6.48135 5.63002 6.38351C5.71354 6.28567 5.74155 6.21584 5.79732 6.10419C5.85321 5.99228 5.82532 5.89444 5.78337 5.81067C5.74155 5.7269 5.41588 4.89822 5.26692 4.56689Z"
                    fill="white"
                  />
                </svg>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyHeader;
