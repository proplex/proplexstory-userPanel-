'use client'

import { Input } from '@/components/ui/input'
import { MapPin, Home, Building, Plus, Edit, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { format, parseISO } from 'date-fns'
import { ProfileUpdateDialog } from './DialogBoxes/ProfileUpdateDialog'
import AddressDialog from './DialogBoxes/AddressDialog'
import useUpdateInvestorApi from '@/hooks/user/useUpdateInvestorApi'

interface ProfileTabProps {
  data?: any;
  onProfileUpdate: () => void;
}

const ProfileTab = ({ data, onProfileUpdate }: ProfileTabProps) => {
  const [isAddressEdit, setIsAddressEdit] = React.useState(false);
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);
  const { updateInvestor } = useUpdateInvestorApi();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'dd MMM yyyy');
    } catch (error) {
      console.error('Date parsing error:', error);
      return dateString;
    }
  };

  const handleAddressUpdate = () => {
    setIsAddressEdit(false);
    onProfileUpdate();
  }
  const handleDeleteAddress = async () => {
    try {
      const response = await updateInvestor({
        address: null
      })

      if (response) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error('Failed to update address:', error)
    }
    onProfileUpdate();
  };


  return (
    <div className="px-6 py-4]">
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <Input defaultValue={localData?.fullName} className="bg-gray-50" readOnly />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <Input defaultValue={formatDate(localData?.dateOfBirth)} className="bg-gray-50" readOnly />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <Input
            defaultValue={localData?.gender?.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            className="bg-gray-50"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
          <Input value={localData?.countryCode + ' ' + localData?.mobileNumber || 'Please update your mobile number'} className="bg-gray-50" readOnly />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input value={localData?.email || 'Please update your email'} className="bg-gray-50" readOnly />
        </div>
      </div> */}

      <div className=" mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <h2 className="text-xl font-bold">Address Management</h2>
        </div>
        <Button variant="outline" className="bg-transparent text-[#725ace]  rounded-lg" onClick={() => setIsAddressEdit(true)} >
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>
      <div id="address-container" className="space-y-4">
        {localData?.address ? (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-medium">Current Address</h3>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <p className="text-gray-600">{localData.address.street}</p>
                  <p className="text-gray-600">{localData.address.city}, {localData.address.state}</p>
                  <p className="text-gray-600">{localData.address.country} - {localData.address.postalCode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsAddressEdit(true)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => handleDeleteAddress()}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No address added yet
          </div>
        )}
      </div>
      <AddressDialog
        open={isAddressEdit}
        onOpenChange={setIsAddressEdit}
        onContinue={handleAddressUpdate}
        data={localData}
      />
    </div>
  )
}

export default ProfileTab
