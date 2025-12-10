"use client";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import React, { useState, ReactNode } from "react";

interface RyzerCardProps {
    title: string;
    isCollapsible?: boolean;
    tooltipData?: boolean;
    children?: ReactNode;
    className?: string;
    icon?: ReactNode;
}

const RyzerCard: React.FC<RyzerCardProps> = ({
    title,
    isCollapsible = false,
    tooltipData = false,
    children,
    className = "",
    icon
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <article className={`w-full bg-white rounded-2xl border border-[#EBEBEB] my-2  transition-all duration-300 ease-in-out  ${className}`} >
            <div className="flex items-center justify-between p-4 border-b border-[#EBEBEB] cursor-pointer"  onClick={() => setIsExpanded(!isExpanded)}  >
                <div className="flex items-center gap-2 "               >
                    {icon && <div className="text-gray-800 bg-blue-100 rounded-2xl p-2 hover:text-gray-900">{React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4', size: 16 })}</div>}
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    {tooltipData ?
                        <div className="relative group">
                            <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                className="h-5 w-5 text-gray-500 hover:text-gray-900"
                            >

                                <Info className="h-4 w-4" />
                            </Button>
                            <div className="absolute z-10 w-96 ml-10 transform -translate-x-1/2 top-8 bg-white text-white text-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {children}
                            </div>
                        </div> : ""
                    }
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
            <div className={`overflow-y-auto transition-max-height duration-500 ease-in-out`} style={{ maxHeight: isExpanded ? '1000px' : '0' }}>
                <div className="p-2 sm:p-4 md:p-4 space-y-4 sm:space-y-5 md:space-y-6">
                    {children}
                </div>
            </div>
        </article>
    );
};

export default RyzerCard;
