import React from "react";
import dynamic from "next/dynamic";
import {
    Calendar,
  CalendarFold,
  CircleCheck,
  Languages,
  MailIcon,
  MapPin,
  MessageSquare,
  Phone,
  PinIcon,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailIcon } from "react-share";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
const FandoraCard = dynamic(() => import("@/components/cards/RyzerCard"), {
  ssr: false,
});

type AssetManagerProps = {
  manager_name: string;
  manager_role: string;
  manager_experience: string;
  location: string;
  languages: string;
};

const AssetManager = ({
  manager_name,
  manager_role,
  manager_experience,
  location,
  languages,
}: AssetManagerProps) => {
  return (
    <FandoraCard
      title="Asset Manager"
      tooltipData={false}
      isCollapsible={true}
      icon={<Users size={16} className=" text-gray-600" />}
    >
      <div className="flex items-center gap-4 px-4">
        {/* Img */}
        <div className="w-20 h-20 border">
          <img src="" alt="" />
        </div>
        <div className="w-full">
            {/* Name */}
          <div className=" flex gap-2">
            <h1 className="font-bold text-xl">{manager_name}</h1>
            <span className="text-green-600 font-bold rounded-full bg-green-200 flex items-center text-xs w-20 justify-center gap-1">
              <CircleCheck size={12} />
              Verified
            </span>
          </div>
          {/* Role */}
          <p>
            {manager_role} • {manager_experience}
          </p>
          {/* Location */}
          <div className="flex  items-center justify-between">
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {location}
              </span>
              <span className="flex items-center gap-1">
                <Languages size={14} /> {languages}
              </span>
            </div>
            <div className=" flex gap-1 items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <p>4.6/5.0 </p>
              <p className="underline text-gray-400">23 reviews</p>
            </div>
          </div>
          
        </div>
       
      </div>
        {/* Buttons */}
       <div className="flex gap-2">
            <Button className="w-full bg-black text-white hover:bg-gray-700">
                <MessageSquare/>
                Book an Appointment
            </Button>
            <Button variant="outline" className="w-full">
                <Phone/>
                Call Now
            </Button>
            <Button
            variant='outline'
            className="w-full"
            >
                <MailIcon/>
                Email
            </Button>
          </div>
          <Tabs defaultValue="profile">
                 <TabsList className="w-full flex bg-white rounded-none p-0 ">
              <TabsTrigger
                value="profile"
                className="w-full py-2 px-4 text-sm font-medium border-b transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-[#4338CA] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#4338CA] rounded-none "
              >
                <div className="flex items-center gap-2">
                  Profile
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="portfolio"
                className="w-full py-2 px-4 text-sm font-medium border-b  transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-[#4338CA] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#4338CA] rounded-none "
              >
                <div className="flex items-center gap-2">
                  Portfolio
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="ratings"
                className="w-full py-2 px-4 text-sm font-medium border-b  transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-[#4338CA] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#4338CA] rounded-none "
              >
                <div className="flex items-center gap-2">
                  Ratings
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
    </FandoraCard>
  );
};

export default AssetManager;
