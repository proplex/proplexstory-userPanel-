"use client";

import dynamic from 'next/dynamic';
import { IDocument } from '@/constants/global';
const DocumentDisplay = dynamic(() => import("@/components/cards/BudgetCard/DocumentDisplay"), { ssr: false });
const FandoraCard = dynamic(() => import("@/components/cards/RyzerCard"), { ssr: false });
import { File } from "lucide-react";


const DocumentList = ({ propertyDocument }: { propertyDocument: any }) => {

    console.log(propertyDocument)

  return (

    

    <div className="space-y-6">
      <FandoraCard title="Document CheckList"  isCollapsible={true} icon={<File size={16} className=" text-gray-600" />}>
        <DocumentDisplay
          propertyDocument={propertyDocument.map((document: IDocument) => {
            return {
              name: document?.document?.name,
              status: document?.isActive,
              url: document?.document?.url,
              createdAt: document?.createdAt,
              updatedAt: document?.updatedAt,
              protected: document?.isProtected,
              description: document?.description,
            };

          })}
        />
        
      </FandoraCard>
    </div>
  );
};

export default DocumentList;