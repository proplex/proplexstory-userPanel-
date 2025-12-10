"use client";

import dynamic from 'next/dynamic';
import { Building2 } from "lucide-react";
const FandoraCard = dynamic(() => import("@/components/cards/RyzerCard"), { ssr: false });
const AboutCard = dynamic(() => import("@/components/cards/BudgetCard/About"), { ssr: false });

const About = ({ description }: { description: string }) => {

    return (
        <div className="space-y-6">
            <FandoraCard title="About Project" icon={<Building2 size={16} className=" text-gray-600" />} tooltipData={false} isCollapsible={true}>
                <AboutCard desc={description}  />
            </FandoraCard>
        </div>
    );
};

export default About;