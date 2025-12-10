"use client";

import { Button } from "@/components/ui/button";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import Icon from "@/components/common/Icon";

import { CardFooter } from "@/components/ui/card";
import useBankDetailsByID from "@/hooks/escrow/useBankDetailsByID";
import { ArrowLeft, Check } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LottieAnimation from "@/components/animation/LottieAnimation";
import Success from "../../../../public/lottie-animations/Success.json";
import { useEffect, useState } from "react";

const SuccessWithDraw = ({
    response,
    resetSubmission,
    bankDetails,
}: {
    response?: any;
    resetSubmission: () => void;
    bankDetails: any;
}) => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    console.log(bankDetails);

    const maskAccountNumber = (accountNumber: string) => {
        if (!accountNumber) return "";
        return accountNumber.replace(/.(?=.{4})/g, "*");
    };
    const pathname = usePathname();

    const pathSegments = pathname?.split("/").filter((segment) => segment);

    const handleCopyToClipboard = async (text: string) => {
        if (!isClient) return;
        
        try {
            await navigator.clipboard.writeText(text);
            // You might want to add a toast notification here to indicate successful copy
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <main className="w-full max-w-[1100px] mx-auto ">
                <div className="">
                    {/* Breadcrumbs */}
                    <Breadcrumb className="text-sm space-x-2 sm:space-x-4 pb-4 font-semibold">
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/"
                                className="text-primary hover:text-primary/80"
                            >
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        {pathSegments?.map((segment, index) => {
                            const path = `/${pathSegments?.slice(0, index + 1).join("/")}`;
                            const isLast = index === pathSegments?.length - 1;

                            return (
                                <BreadcrumbItem key={path}>
                                    <Icon
                                        name="chevron-right"
                                        type="solid"
                                        className="text-gray-400 w-4 h-4"
                                    />
                                    {isLast ? (
                                        <span className="text-gray-900 font-semibold uppercase">
                                            {segment}
                                        </span>
                                    ) : (
                                        <BreadcrumbLink
                                            href={path}
                                            className="text-primary hover:text-primary/80"
                                        >
                                            {segment}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            );
                        })}
                    </Breadcrumb>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Header */}
                        <header className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => router.back()}
                                    className="hover:bg-gray-100 rounded-full p-2"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    Withdrawal
                                </h1>
                            </div>
                        </header>

                        {/* Success Content */}
                        <div className="p-8">
                            <div className="mx-auto max-w-3xl text-center">
                                <div className="w-full flex items-center justify-center">
                                    <div className="w-32 h-32 md:w-32 md:h-32 rounded-full bg-transparent flex items-center justify-center">
                                        <LottieAnimation
                                            animationData={Success}
                                            style={{ width: '100%', height: '100%', zIndex: 20 }}
                                        />
                                    </div>
                                </div>
                                <h2 className="mt-4 text-2xl font-semibold">Successful!</h2>
                                <p className="mt-2 text-gray-600">
                                    Your amount has been successfully withdrawn to your selected account.
                                </p>

                                {/* Account Details */}
                                <div className="mt-6 space-y-4 max-w-md mx-auto border rounded-lg bg-gray-50 p-6 text-left">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount</span>
                                        <span className="font-medium">₹{response?.amount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Transaction ID:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{response?.txnid}</span>
                                            <button
                                                onClick={() => handleCopyToClipboard(response?.txnid)}
                                                className="p-1 hover:bg-gray-100 rounded-md"
                                                aria-label="Copy transaction ID"
                                            >
                                                <Icon
                                                    name="copy"
                                                    type="solid"
                                                    className="w-4 h-4 text-gray-500 hover:text-gray-700"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Bank name:</span>
                                        <span className="font-medium">{bankDetails?.bank_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Bank account number:</span>
                                        <span className="font-medium">{bankDetails?.bank_account}</span>
                                    </div>
                                </div>

                                {/* Actions */}

                            </div>
                        </div>
                        <div className="flex justify-end border-t p-4 ">
                            <Button
                                
                                variant="primary"
                                onClick={resetSubmission}
                            >
                                Okay
                            </Button>
                        </div>
                    </div>


                </div>
            </main>
        </div>
    );
};

export default SuccessWithDraw;
