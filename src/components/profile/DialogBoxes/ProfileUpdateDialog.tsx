"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { CalendarIcon, Edit, Mail, Phone, User } from "lucide-react"
import { format, parseISO } from "date-fns"
import { toast } from "react-toastify"
import useUpdateInvestorApi from "@/hooks/user/useUpdateInvestorApi"
import PhoneNumberUpdateDialog from "./PhoneNumberUpdateDialog"
import PhoneNumberOtp from "./PhoneNumberOtp"
import EmailOtp from "./EmailOtp"
import EmailUpdateDialog from "./EmailUpdateDialog"

interface ProfileUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContinue: () => void
  data: any
}

export const ProfileUpdateDialog = ({ open, onOpenChange, onContinue, data }: ProfileUpdateDialogProps) => {
  const [formData, setFormData] = useState({
    fullName: data?.fullName || "",
    dateOfBirth: "",
    gender: data?.gender?.toLowerCase() || "",
    mobileNumber: data?.mobileNumber || "",
    email: data?.email || ""
  })
  const [newMobileNumber, setNewMobileNumber] = useState(data?.mobileNumber || "")
  const [newEmail, setNewEmail] = useState(data?.email || "")
  const { updateInvestor, loading, error } = useUpdateInvestorApi()
  const [step, setStep] = useState<"phoneNumber" | "email" | "phoneOtp" | "emailOtp" | null>(null)

  useEffect(() => {
    if (open && data) {
      const formattedDate = data.dateOfBirth 
        ? format(parseISO(data.dateOfBirth), 'yyyy-MM-dd')
        : "";
      
      setFormData({
        fullName: data.fullName || "",
        dateOfBirth: formattedDate,
        gender: data.gender?.toLowerCase() || "",
        mobileNumber: data.mobileNumber || "",
        email: data.email || ""
      })
      setNewMobileNumber(data.mobileNumber || "")
      setNewEmail(data.email || "")
    }
  }, [open, data])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isOver18 = (dateString: string) => {
    if (!dateString) return false
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age >= 18
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required")
      return false
    }
    if (!formData.dateOfBirth) {
      toast.error("Date of birth is required")
      return false
    }
    if (!isOver18(formData.dateOfBirth)) {
      toast.error("You must be at least 18 years old")
      return false
    }
    if (!formData.gender) {
      toast.error("Gender is required")
      return false
    }
    if (!formData.mobileNumber.trim()) {
      toast.error("Mobile number is required")
      return false
    }
    if (!formData.email.trim()) {
      toast.error("Email is required")
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      const response = await updateInvestor({
        fullName: formData.fullName.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender.toLowerCase().replace(/\s+/g, '-') as 'male' | 'female' | 'other',
        country: "India",
        countryCode: "+91",
        avatar: data?.avatar || "",
        type: "individual"
      })
      
      if (response) {
        toast.success("Profile updated successfully")
        onContinue()
        onOpenChange(false)
      } else {
        toast.error("Failed to update profile")
      }
    } catch (err) {
      toast.error("Failed to update profile")
    }
  }

  const handlePhoneNumberUpdate = (mobileNumber: string) => {
    if (mobileNumber) {
      setNewMobileNumber(mobileNumber)
      setStep("phoneOtp")
    } else {
      setStep(null)
    }
  }

  const handlePhoneNumberVerify = () => {
    setFormData(prev => ({
      ...prev,
      mobileNumber: newMobileNumber
    }))
    setStep(null)
  }

  const handleEmailUpdate = (email: string) => {
    setNewEmail(email)
    setStep("emailOtp")
  }

  const handleEmailVerify = () => {
    setFormData(prev => ({
      ...prev,
      email: newEmail
    }))
    setStep(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="bg-gray-100 p-4 space-y-1">
          <div className="flex items-center gap-2">
            <User size={16} />
            <DialogTitle className="text-xl">Edit Profile</DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">Update your personal information below.</DialogDescription>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="pl-10 py-5 border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="dob" className="block text-sm font-medium">
              Date of Birth
            </label>
            <Input 
              type="date" 
              value={formData.dateOfBirth} 
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="py-5 border-gray-300 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="gender" className="block text-sm font-medium">
              Gender
            </label>
            <Select 
              value={formData.gender} 
              onValueChange={(value) => handleInputChange('gender', value)}
            >
              <SelectTrigger className="w-full py-5 border-gray-300 rounded-lg">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="phone"
                value={formData.mobileNumber}
                readOnly
                className="pl-10 py-5 border-gray-300 rounded-lg bg-gray-50"
              />
              <Button 
                variant="outline" 
                className="absolute right-0 top-0 mt-0.5 mr-1" 
                onClick={() => setStep("phoneNumber")}
              > 
                <Edit size={16}/> 
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center justify-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                value={formData.email}
                readOnly
                className="pl-10 py-5 border-gray-300 rounded-lg bg-gray-50"
              />
              <Button 
                variant="outline" 
                className="absolute right-0 top-0 mt-0.5 mr-1" 
                onClick={() => setStep("email")}
              > 
                <Edit size={16}/> 
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="rounded-lg px-6"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading} 
            className="bg-[#725ace] hover:bg-[#725ace]/80 text-white rounded-lg px-6"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>

      <PhoneNumberUpdateDialog 
        open={step === "phoneNumber"} 
        onOpenChange={() => setStep(null)} 
        mobileNumber={formData.mobileNumber} 
        onContinue={handlePhoneNumberUpdate}
      />
      
      <PhoneNumberOtp 
        open={step === "phoneOtp"} 
        mobileNumber={newMobileNumber}  
        onVerify={handlePhoneNumberVerify}
        onOpenChange={() => setStep(null)} 
      />
      
      <EmailUpdateDialog 
        open={step === "email"} 
        onOpenChange={() => setStep(null)} 
        mail={formData.email} 
        onContinue={handleEmailUpdate}
      />
      
      <EmailOtp 
        open={step === "emailOtp"} 
        email={newEmail} 
        onVerify={handleEmailVerify}
        onOpenChange={() => setStep(null)}
      />
    </Dialog>
  )
}
