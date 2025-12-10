"use client";

import { IProperty } from '@/constants/global';
import { TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';

const FandoraCard = dynamic(() => import("@/components/cards/RyzerCard"), { ssr: false });
const TitleDescription = dynamic(() => import("@/components/cards/RyzerCard/TitleDescription"), { ssr: false });


const Exits = ({ exit }: { exit:  IProperty['exitOpportunities'] }) => {
 

  return (
    <div className="space-y-6">
      <FandoraCard title="Exit Opportunity" isCollapsible={true}   icon={<TrendingUp size={16} className=" text-gray-600" />}>
        <TitleDescription
          titleDescriptions={exit.map((exit) => ({
            name: exit.name,
            description: exit.description,
          }))}
        />
      </FandoraCard>
    </div>
  );
};

export default Exits;