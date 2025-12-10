"use client"

import { Info, Phone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { WhatsappIcon, WhatsappShareButton } from "react-share"

interface ProjectManagerProps {
  name: string
  image: string
  rating: number
  reviews: number
  responseTime: string
  location: string
  phone: string
  email: string
}

export const ProjectManager = ({
  name,
  image,
  rating,
  reviews,
  responseTime,
  location,
  phone,
  email,
}: ProjectManagerProps) => {
  const handlePhoneCall = () => {
    window.open(`tel:${phone}`, "_self")
  }

  const handleBooking = () => {
    window.open(`https://wa.me/${phone}`, "_blank")
  }

  return (
    <article className="w-full mx-auto bg-white rounded-3xl border border-[#EBEBEB] shadow-sm hover:shadow-md p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px] leading-[30px] font-semibold text-gray-900">Project Manager </h2>
          <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500 hover:text-gray-900">
           
          </Button>
        </div>
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="relative h-12 w-12">
              <Avatar>
                <AvatarImage src={image} alt={name} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-500">Project Manager</p>
            </div>
          </div>
        
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <span className="text-gray-500">Response :</span>
            <span className="font-medium text-gray-900">{responseTime}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500">Prime location :</span>
            <span className="font-medium text-gray-900">{location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1  gap-3">
          <Button
            variant="outline"
            className="flex items-center justify-center  h-10 rounded-xl hover:bg-gray-50 transition-all"
            onClick={handlePhoneCall}
            aria-label="Call project manager"
          >
            <Phone size={40} className=" text-gray-700" />
            {/* <span className="hidden sm:inline text-gray-900">Call</span> */}
          </Button>

          <WhatsappShareButton url={`https://wa.me/${phone}`} className="h-10">
            <Button
              variant="outline"
              className="w-full h-full flex items-center justify-center gap-2 rounded-xl border-green-100 bg-green-50 hover:bg-green-100 transition-all"
              aria-label="Contact via WhatsApp"
            >
              <WhatsappIcon size={48} round />
              {/* <span className="hidden sm:inline text-gray-900">WhatsApp</span> */}
            </Button>
          </WhatsappShareButton>

          <Button
            onClick={handleBooking}
            variant="outline"
            className="h-10 flex items-center  justify-center gap-2 bg-transparent rounded-xl "
          >
            <span className="text-primary p-6 font-bold">Book An Appointment</span>
          </Button>

        </div>
      </div>
    </article>
  )
}

export default ProjectManager

