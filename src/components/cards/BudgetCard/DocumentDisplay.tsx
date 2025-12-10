"use client";

import NothingFound from "@/components/common/NothingFound";
import { Button } from "@/components/ui/button";
import { formatDateForDocuments } from "@/constants/formatdate";
import { IDocument } from "@/constants/global";
import { Download, ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


type Document = {
  name: string;
  url: string;
  status: boolean;
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
  description: string;
  protected: boolean;
}

interface IDocumentDisplayProps {
  propertyDocument: Document[];
}

const DocumentDisplay: React.FC<IDocumentDisplayProps> = ({
  propertyDocument,
}) => {
  const [visibleDocuments, setVisibleDocuments] = useState(3);

  const handleSeeMore = () => {
    setVisibleDocuments(prev => prev + 3);
  };
  console.log(propertyDocument)

  return (
    <div className="w-full mx-auto bg-white rounded-lg">
      <div className="space-y-4">
        {propertyDocument.length === 0 ? (
          <NothingFound text="No documents found" />
        ) : (
          <>
            {propertyDocument.slice(0, visibleDocuments).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 flex items-center justify-center w-8 h-8 rounded-full">
                    <Image
                      width={25}
                      height={16}
                      src="/Check.svg"
                      alt="check mark"
                      className="object-contain"
                    />
                  </div>

                  <div>
                    <div className="flex items-center">
                      <p className="text-base lg:text-sm ">
                        <span className="font-medium">
                          {" "}
                          {item.status ? "Verified" : "Not Verified"}
                        </span>
                        <span> {item?.name}</span>
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDateForDocuments(item?.updatedAt)}
                    </p>
                  </div>
                </div>
                {item?.protected ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-purple-500 hover:text-purple-600 hover:bg-purple-50"
                    onClick={() => {
                      toast.warning("This document is protected and cannot be downloaded.");
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                ) : (
                  <a
                    href={item?.url}
                    download={item?.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-purple-500 hover:text-purple-600 hover:bg-purple-50"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                )}
              </div>
            ))}

            {visibleDocuments < propertyDocument.length && (
              <div className="flex justify-end mt-4 pb-4">
                <Button 
                  onClick={handleSeeMore}
                  variant="ghost"
                  className="text-purple-500 hover:text-purple-600"
                >
                  See More <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentDisplay;
