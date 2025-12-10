"use client";

import React from 'react';

interface OrderAttributeProps {
    title: string;
    value: string;
    isSmall?: boolean;
    className?: string;
    icon?: React.ReactNode;
};

const OrderAttribute: React.FC<OrderAttributeProps> = ({title, value, isSmall = false, className, icon}) => {
  return (
    <article className={`flex items-center gap-1 p-3 rounded-lg ${className}`}>
        <div className='flex items-center justify-center w-14 h-14 rounded-full bg-purple-50'>
            {icon}
        </div>
        <div className='flex flex-col items-start gap-0'>
            <p className={`text-gray-500 font-semibold ${isSmall ? "text-xs" : "text-sm"}`}>{title}</p>
            <p className={`font-bold text-[#1B2559] ${isSmall ? "text-base" : "text-2xl"}`}>{value}</p>
        </div>
    </article>
  )
}

export default OrderAttribute;