import React, { useState, useEffect } from 'react'
import { MapIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Country, State, City } from 'country-state-city'
import useUpdateInvestorApi from '@/hooks/user/useUpdateInvestorApi'

interface AddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContinue: () => void
  data?: any
}

const AddressDialog = ({ open, onOpenChange, onContinue }: AddressDialogProps) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState('')
  const [selectedStateCode, setSelectedStateCode] = useState('')
  const [cities, setCities] = useState<string[]>([])

  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
    streetAddress: '',
    pincode: ''
  })

  const countries = Country.getAllCountries()
  const states = State.getStatesOfCountry(selectedCountryCode)

  const { updateInvestor, loading } = useUpdateInvestorApi()

  useEffect(() => {
    if (selectedCountryCode && selectedStateCode) {
      const cityList = City.getCitiesOfState(selectedCountryCode, selectedStateCode)
      setCities(cityList.map(c => c.name))
    } else {
      setCities([])
    }
  }, [selectedCountryCode, selectedStateCode])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCountryChange = (code: string) => {
    const selected = countries.find(c => c.isoCode === code)
    setSelectedCountryCode(code)
    setSelectedStateCode('')
    setFormData(prev => ({
      ...prev,
      country: selected?.name || '',
      state: '',
      city: ''
    }))
  }

  const handleStateChange = (code: string) => {
    const selected = states.find(s => s.isoCode === code)
    setSelectedStateCode(code)
    setFormData(prev => ({
      ...prev,
      state: selected?.name || '',
      city: ''
    }))
  }

  const handleCityChange = (name: string) => {
    setFormData(prev => ({ ...prev, city: name }))
  }

  const handleSubmit = async () => {
    try {
      const response = await updateInvestor({
        address: {
          street: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.pincode
        }
      })

      if (response) {
        onContinue()
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Failed to update address:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="bg-gray-100 p-4 space-y-1">
          <div className="flex items-center gap-2">
            <MapIcon size={16} />
            <DialogTitle className="text-xl">Add New Address</DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            Enter your address details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 p-4">
          <div>
            <Label>Country</Label>
            <Select onValueChange={handleCountryChange} value={selectedCountryCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((option) => (
                  <SelectItem key={option.isoCode} value={option.isoCode}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>State</Label>
            <Select onValueChange={handleStateChange} value={selectedStateCode} disabled={!selectedCountryCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((option) => (
                  <SelectItem key={option.isoCode} value={option.isoCode}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>City</Label>
            <Select onValueChange={handleCityChange} value={formData.city} disabled={!selectedStateCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Street Address</Label>
            <Input
              type="text"
              value={formData.streetAddress}
              onChange={(e) => handleInputChange('streetAddress', e.target.value)}
            />
          </div>

          <div>
            <Label>Pincode</Label>
            <Input
              type="text"
              inputMode="numeric"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="bg-gray-100 p-4 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button className="bg-black text-white" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Add Address'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddressDialog
