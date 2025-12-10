"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import * as LucideIcons from 'lucide-react';

interface IconProps {
    name: string;
    type?: 'regular' | 'solid' | 'logo';
    className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className = '' }) => {
    // Convert the name to PascalCase to match Lucide icon names
    const iconName = name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

    // Get the icon component from Lucide
    const IconComponent = (LucideIcons as any)[iconName];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found in Lucide icons`);
        return null;
    }

    return <IconComponent className={className} />;
};

export default dynamic(() => Promise.resolve(Icon), { ssr: false });