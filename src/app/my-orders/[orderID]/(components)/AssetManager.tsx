import { Button } from "@/components/ui/button";
import { Mail, PhoneCall } from "lucide-react";
import React from "react";

const AssetManager = (assetManger: any) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-400"></div>
        <div>
          <h1 className="text-lg font-bold">{assetManger.name}</h1>
          <p className="text-sm">Asset Manager</p>
        </div>
      </div>
      <div>
        <Button variant="default" className="bg-gray-700 mx-2 px-2" >
          <PhoneCall />
        </Button>
        <Button variant="default" className="bg-gray-700 ml-2 px-2">
            <Mail />
        </Button>
      </div>
    </div>
  );
};

export default AssetManager;
