"use client";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import React, { useState, ReactNode } from "react";

interface FandorBudget {
    title: string;
    isCollapsible?: boolean;
    tooltipData?: string;
    children?: ReactNode;
    className?: string;
}

const FandoraBudgetsComponent: React.FC<FandorBudget> = ({ 
    title, 
    isCollapsible = false, 
    tooltipData = "",
    children,
    className = ""
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <article className={`w-full bg-white rounded-2xl border border-[#EBEBEB] shadow-sm hover:shadow-md my-2 transition-all duration-300 ease-in-out ${className}`}>
            <div className="flex items-center justify-between p-5 border-b border-[#EBEBEB]">
                <div className="flex items-center gap-2 relative">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">{title}</h2>
                    <div className="relative group">
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="h-5 w-5 text-gray-500 hover:text-gray-900"
                        >
                            <Info className="h-4 w-4" />
                        </Button>
                        
                    </div>
                </div>

                {isCollapsible && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsExpanded(!isExpanded)}
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
            <div className={`overflow-hidden transition-max-height duration-500 ease-in-out`} style={{ maxHeight: isExpanded ? '500px' : '0' }}>
                <div className="p-3 sm:p-3 md:p-3 space-y-4 sm:space-y-5 md:space-y-6">
                    {children}
                </div>
            </div>
        </article>
    );
};

export default FandoraBudgetsComponent;
