"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, Download } from "lucide-react";
import React from "react";

interface IProject {
  id: number;
  name: string;
}

interface ProjectProps {
  stage: string;
  analysis_report: string;
  property_type_id: string;
  propertyType: IProject; // Replace with actual project type interface if needed. This is a placeholder for now
}

const Project: React.FC<ProjectProps> = ({
  stage,
  analysis_report,
  property_type_id,
  propertyType,
}) => {
  console.log(propertyType);
  const { name } = propertyType;

  return (
    <div className="w-full ">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Project Type</span>
          <span className="font-medium">{name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Production Stage</span>
          <span className="font-medium">{stage || "Completed"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Analysis Report</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            // onClick={() => handleDownload(analysis_report)}
          >
            <Download className="h-4 w-4 text-indigo-600" />
          </Button>
        </div>
      </div>
    </div>
    // <>
    // jehu
    // </>
  );
};

export default Project;
