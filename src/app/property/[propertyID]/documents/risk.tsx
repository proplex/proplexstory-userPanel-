"use client";

import { IProperty } from '@/constants/global';
import dynamic from 'next/dynamic';
import { AlertCircle } from 'lucide-react';
const FandoraCard = dynamic(() => import("@/components/cards/RyzerCard"), { ssr: false });
const TitleDescription = dynamic(() => import("@/components/cards/RyzerCard/TitleDescription"), { ssr: false });

const Risk = ({risks}: {risks: IProperty['riskFactors']}) => {
 
    
    return (
        <div className="space-y-6">
            <FandoraCard title="Risk factors" isCollapsible={true} icon={<AlertCircle size={16} className=" text-gray-600" />}>
                <TitleDescription titleDescriptions={risks.map((risk: any, _: any) => {
                    return {
                        name: risk?.name,
                        description: risk?.description
                    }
                })} />
            </FandoraCard>
        </div>
    )
}

export default Risk;