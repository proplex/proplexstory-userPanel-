"use client";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info, Link } from 'lucide-react';
import React, { useState, ReactNode } from "react";

interface FandoraCardProps {
    title: string;
    isCollapsible?: boolean;
    tooltipData?: string;
    children?: ReactNode;
    className?: string;
    hyperlink?: string;
}

const FandoraCrew: React.FC<FandoraCardProps> = ({
    title,
    isCollapsible = false,
    children,
    className = "",
    hyperlink = ""
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleEmailClick = () => {
        if (typeof window !== 'undefined' && hyperlink) {
            window.open(hyperlink, '_blank');
        }
    };

    return (
        <article className={`w-full bg-white rounded-2xl border border-[#EBEBEB] shadow-sm hover:shadow-md my-2 transition-all duration-300 ease-in-out ${className}`}>
            <div className="flex items-center justify-between p-5 border-b border-[#EBEBEB] cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex w-full items-center justify-between gap-2 ">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">{title}</h2>
                    {hyperlink && (
                        <h2 className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer" onClick={handleEmailClick}>{"Send docs to email"}</h2>
                    )}

                </div>

                {isCollapsible && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-500 hover:text-gray-900"
                    >
                        {isExpanded ? (
                            <ChevronUp className="h-5 w-5" />
                        ) : (
                            <ChevronDown className="h-5 w-5" />
                        )}
                    </Button>
                )}
            </div>
            <div className={`overflow-y-auto no-scrollbar transition-max-height duration-500 ease-in-out`} style={{ maxHeight: isExpanded ? '500px' : '0' }}>
                <div className="p-3 sm:p-3 md:p-3 space-y-4 overflow-y-auto sm:space-y-5 md:space-y-6">
                    {children}
                </div>
            </div>
        </article>
    );
};

export default FandoraCrew;
