"use client"

import { AlertCircle, Copy, CopyCheck, FileDown, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import api from "@/lib/httpClient"

interface Document {
  id: string
  document_name: string
  investor_slug: string
  updated_at: string
  status?: string
  is_signed: boolean
  is_signed_at?: string
  is_sent: boolean
  is_sent_at?: string
  template_id: number
  order_id: number
  admin_submitter_id: number
  admin_slug: string
  investor_submitter_id: number
  submission_id: number
}

const DocumentsListing = ({ orderData }: { orderData: any }) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const router = useRouter()
  const [isProjectIDCopied, setIsProjectIDCopied] = useState(false)
  useEffect(() => {
    if (orderData) {
      console.log("Setting documents from orderData:", orderData?.documents)
      setDocuments(orderData?.documents || [])
    }
  }, [orderData])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  const reviewDocument = async (submission_id: number) => {
    try {
      const response = await api.get(`/v2/order/document/${submission_id}`)
      const documentURL = response?.data?.document_url
      window.open(documentURL, "_blank")
    } catch (error) {
      console.error('Error reviewing document:', error)
    }
  }

  const downloadDocument = async (submission_id: number, document_name: string) => {
    try {
      const response = await api.get(`/v2/order/document/${submission_id}`)
      const documentURL = response?.data?.document_url

      if (documentURL && typeof window !== 'undefined') {
        const pdfResponse = await fetch(documentURL, {
          method: "GET",
        })

        if (!pdfResponse.ok) {
          throw new Error("Network response was not ok")
        }

        const blob = await pdfResponse.blob()
        const url = window.URL.createObjectURL(blob)
        
        // Create a temporary link element
        const link = document.createElement('a')
        link.href = url
        link.download = document_name
        link.style.display = 'none'
        
        // Append to body and trigger download
        document.body.appendChild(link)
        link.click()
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        }, 100)
      }
    } catch (error) {
      console.error('Error downloading document:', error)
    }
  }

  const handleCopyOrderId = () => {
    if (orderData?.order?.id) {
      navigator.clipboard.writeText(orderData.order.id.toString())
    }
    setIsProjectIDCopied(true)
  }

  const allDocumentsSigned = documents.every((doc) => doc.is_signed)

  if (!orderData || !documents.length) {
    return (
      <div className="w-full text-center py-8">
        <p>Loading documents...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Card className="overflow-hidden">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
            <h3 className="text-lg font-medium text-gray-900">Documents</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Order ID:</span>
              <span className="font-medium text-gray-900 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                {orderData?.order?.id}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-500 hover:text-gray-900 group"
                onClick={handleCopyOrderId}
                aria-label="Copy order ID to clipboard"
                title="Click to copy order ID"
              >
                
                {isProjectIDCopied ? (
            <CopyCheck className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
          ) : (
            <Copy className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
          )}
                <span className="sr-only">Copy order ID to clipboard</span>
              </Button>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
            {documents.map((document) => (
              <div
                key={`${document.id}-${document.is_signed ? "signed" : "unsigned"}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="rounded-lg shrink-0">
                    <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-[#8968ff]" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {document.document_name}
                    </h4>
                    {!document?.is_signed && (
                      <p className="text-xs sm:text-sm text-gray-500">
                        Sent on {formatDate(document?.is_sent_at || document?.updated_at)}
                      </p>
                    )}
                    {document?.is_signed && (
                      <p className="text-xs sm:text-sm text-gray-500">
                        Signed on {formatDate(document?.is_signed_at || document?.updated_at)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 mt-2 sm:mt-0 ml-11 sm:ml-0">
                  <div className="flex-shrink-0">
                    {document?.is_signed ? (
                      <Image src="/Check.svg" alt="check" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>

                  {document.is_signed ? (
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <Button
                        variant="outline"
                        onClick={() => reviewDocument(document?.submission_id)}
                        className="rounded-full border-[#8968ff] py-1 px-3 sm:py-2 sm:px-4 bg-primary/10 font-bold text-primary hover:text-primary/80 hover:bg-[#8968ff]/10 text-xs sm:text-sm h-8 sm:h-auto"
                      >
                        Review
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => downloadDocument(document?.submission_id, document?.document_name)}
                        className="group rounded-full border-[#8968ff] p-1 sm:p-2 bg-primary/10 font-bold text-primary hover:bg-[#8968ff]/10 h-8 w-8 sm:h-10 sm:w-10"
                        aria-label="Download document"
                      >
                        <FileDown className="text-primary group-hover:text-primary/80 h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/orders/${orderData?.order?.id}/track-order/documents/${document.investor_slug}`)
                      }
                      className="rounded-full border-[#8968ff] py-1 px-3 sm:py-2 sm:px-4 bg-primary/10 font-bold text-primary hover:bg-[#8968ff]/10 text-xs sm:text-sm h-8 sm:h-auto"
                    >
                      Sign
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* <footer className="border-t-2 mt-4 sm:mt-6 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 sm:gap-4">
          <Button
            variant="secondarybutton"
            className="w-full sm:w-auto text-center text-sm sm:text-base"
            onClick={() => router.replace(`/projects`)}
          >
            Explore More Projects
          </Button>
          <Button
            onClick={() => router.replace(`/orders/${orderData?.order?.id}/track-order`)}
            className="bg-[#8968ff] hover:bg-[#8968ff]/90 w-full sm:w-auto text-sm sm:text-base"
            disabled={!allDocumentsSigned}
          >
            Next
          </Button>
        </div>
      </footer> */}
    </div>
  )
}

export default DocumentsListing

