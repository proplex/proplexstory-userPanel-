"use client";

import React, { useState } from "react";
import FandoraCard from "@/components/cards/RyzerCard";
import CrewDetailsCard from "@/components/cards/BudgetCard/Crew";
import FandoraCrew from "@/components/cards/BudgetCard/FandoraCrew";
import { Button } from "@/components/ui/button";
import Project from "@/components/cards/BudgetCard/ProjectType";

const ProjectDetails = ({
  stage,
  property_type_id,
  analysis_report,
  propertyType,
}: any) => {
  return (

    <div className="space-y-6">
      <FandoraCrew title="Project Details" isCollapsible={true}>
       <Project 
       stage={stage}
       analysis_report={analysis_report}
       property_type_id={property_type_id}
       propertyType={propertyType}
       />  
      </FandoraCrew>
    </div>
  );
};

export default ProjectDetails;
