"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Head from "next/head"

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  TelegramIcon,
  TelegramShareButton,
  EmailIcon,
  EmailShareButton,
  RedditIcon,
  RedditShareButton,
  LineIcon,
  LineShareButton,
  OKIcon,
  OKShareButton,
  ViberIcon,
  ViberShareButton,
} from "react-share"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Copy, Check } from "lucide-react"

interface ShareCardProps {
  isOpen: boolean
  onClose: () => void
  shareUrl: string
  title: string
}


const ShareCard: React.FC<ShareCardProps> = ({ isOpen, onClose, shareUrl, title }) => {
  const [copied, setCopied] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  

  const shareMessage = `Check out this amazing property: ${title}`

  // Handle window resize and detect mobile screens
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const socialButtons = [
    { Button: FacebookShareButton, Icon: FacebookIcon, name: "Facebook" },
    { Button: TwitterShareButton, Icon: TwitterIcon, name: "Twitter" },
    { Button: WhatsappShareButton, Icon: WhatsappIcon, name: "WhatsApp" },
    { Button: LinkedinShareButton, Icon: LinkedinIcon, name: "LinkedIn" },
    { Button: TelegramShareButton, Icon: TelegramIcon, name: "Telegram" },
    { Button: EmailShareButton, Icon: EmailIcon, name: "Email" },
    { Button: RedditShareButton, Icon: RedditIcon, name: "Reddit" },
    { Button: LineShareButton, Icon: LineIcon, name: "Line" },
    { Button: OKShareButton, Icon: OKIcon, name: "OK" },
    { Button: ViberShareButton, Icon: ViberIcon, name: "Viber" },
  ]

  // Adjust buttons per page based on screen size
  const buttonsPerPage = isMobile ? 3 : 5
  const totalPages = Math.ceil(socialButtons.length / buttonsPerPage)

  // Reset to first page when screen size changes
  useEffect(() => {
    setCurrentPage(0)
  }, [isMobile])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)

    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0))
  }

  const currentButtons = socialButtons.slice(currentPage * buttonsPerPage, (currentPage + 1) * buttonsPerPage)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[600px] bg-white p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">Share this Property</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Choose your preferred platform to share this amazing property.
          </DialogDescription>
        </DialogHeader>

        <div className="relative flex items-center justify-center w-full my-4 sm:my-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 z-10 hover:bg-gray-100"
            onClick={handlePrevPage}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>

          <div className="flex justify-between items-center w-full px-6 sm:px-8">
            {currentButtons.map(({ Button, Icon, name }, index) => (
              <div key={index} className="flex flex-col items-center">
                <Button
                  url={shareUrl}
                  title={shareMessage}
                  className="hover:opacity-80 transition-opacity mb-1 sm:mb-2"
                >
                  <Icon size={isMobile ? 36 : 48} round />
                </Button>
                <span className="text-xs sm:text-sm text-gray-600">{name}</span>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 z-10 hover:bg-gray-100"
            onClick={handleNextPage}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>
        </div>

        <div className="flex justify-center items-center space-x-1 sm:space-x-2 mb-4 sm:mb-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentPage ? "bg-primary w-3 sm:w-4" : "bg-gray-300 dark:bg-gray-600 w-1.5 sm:w-2"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full">
          <Input
            type="text"
            value={shareUrl}
            readOnly
            className="w-full sm:flex-1 text-sm sm:text-base text-primary font-bold border-gray-300"
          />
          <Button
            type="button"
            variant="outline"
            className={`w-full sm:w-auto transition-all duration-300 ${copied ? "bg-green-500 text-white" : ""}`}
            onClick={handleCopyLink}
          >
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareCard

