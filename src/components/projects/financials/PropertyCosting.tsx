"use client";

import dynamic from 'next/dynamic';
import { IProperty } from '@/constants/global';
import { BadgePercent, DollarSign } from 'lucide-react';
const FandoraCard = dynamic(() => import("@/components/cards/RyzerCard"), { ssr: false });
const Costing = dynamic(() => import("@/components/cards/BudgetCard/Costing"), { ssr: false });
const PropertyCosting = ( property : IProperty ) => {

    return (
        <div className="space-y-6">
            <FandoraCard title="Property Costing" tooltipData={false} isCollapsible={true} icon={<BadgePercent />}    >
                <Costing basePropertyValue={property?.basePropertyValue} totalPropertyValueAfterFees={property?.totalPropertyValueAfterFees} fees={property?.fees} tokenPrice={property?.tokenInformation?.tokenPrice} />
            </FandoraCard>
        </div>
    );
};

export default PropertyCosting;