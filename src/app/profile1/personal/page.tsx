'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { Edit, Pencil, User } from 'lucide-react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import PhotoUploadDialog from '@/components/profile/DialogBoxes/PhotoUploadDialog';
import useInvestorApi from '@/hooks/user/useInvestorApi';
import useUpdateInvestorApi from '@/hooks/user/useUpdateInvestorApi';
import usegetImageURL from '@/hooks/user/usegetImageURL';
import { validateForm ,formatDob} from '@/constants/helper';
import api from '@/lib/httpClient';
import { toTitleCase } from '@/lib/format.utility';

interface ProfileFormValues {
  fullName: string;
  gender: 'male' | 'female' | 'other' | '';
  dob: string;
}

const ProfilePage: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data, fetchData, loading: investorLoading } = useInvestorApi();
  const { updateInvestor, loading: updateLoading } = useUpdateInvestorApi();
  const { getImageURL, loading: imageLoading } = usegetImageURL();

  console.log(data, 'Profile Data is here');

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: '',
      gender: '',
      dob: '',
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        fullName: data.fullName || '',
        gender: (data.gender as ProfileFormValues['gender']) || '',
        dob: data.dob ? data.dob.split('T')[0] : '', // Ensures YYYY-MM-DD format
      });
    }
  }, [data]);

  const handleSave = async () => {
    const values = form.getValues();

    if (!validateForm(values)) {
      toast.error('Please fill out all required fields correctly.');
      return;
    }

    try {
      const response = await updateInvestor({
        ...values,
        gender: values.gender as 'male' | 'female' | 'other',
        dateOfBirth: values.dob,
        avatar: data?.avatar || '',
        type: 'individual',
      });

      if (response) {
        toast.success('Profile updated successfully');
        setEditMode(false);
        fetchData();
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileData = {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        refId: data?._id || '',
        belongsTo: 'user' as const,
      };

      const uploadUrl = await getImageURL(fileData);

      await fetch(uploadUrl.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      const responseS3Url = await api.get(`/s3-file/${uploadUrl.s3Response}/s3Url`);
      await updateInvestor({ avatar: responseS3Url.data.s3Url });
      fetchData();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const isLoading = investorLoading || !data;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-0">
        {/* Header */}
        <div className="flex bg-blue-50/30 items-center justify-between mb-6 p-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <User className="text-gray-700" size={16} />
              {isLoading ? (
                <Skeleton className="w-40 h-6 rounded-md" />
              ) : (
                <h1 className="text-2xl font-semibold text-gray-800">Personal Details</h1>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="w-64 h-4" />
            ) : (
              <p className="text-sm text-muted-foreground">
                Manage your personal information here.
              </p>
            )}
          </div>
          {!editMode && !isLoading && (
            <Button variant="outline" onClick={() => setEditMode(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200 shadow-md">
              {uploading || isLoading ? (
                <Skeleton className="w-full h-full rounded-full" />
              ) : (
                <Image
                  src={data?.avatar || '/images/default-avatar.png'}
                  alt="Profile"
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            {!isLoading && (
              <button
                className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow hover:bg-gray-100"
                onClick={() => setDialogOpen(true)}
                disabled={uploading}
              >
                <Edit className="w-4 h-4 text-gray-700" />
              </button>
            )}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4">
          {editMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">Full Name</label>
                <Input placeholder="Full Name" {...form.register('fullName')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">Gender</label>
                <Select
                  value={form.watch('gender')}
                  onValueChange={(value) =>
                    form.setValue('gender', value as ProfileFormValues['gender'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">Date of Birth</label>
                <Input type="date" {...form.register('dob')} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-gray-100 p-2 rounded-md w-full">
              <div className="space-y-1">
                <h4 className="text-sm text-gray-500">Full Name</h4>
                <p className="text-base text-gray-800">{data?.fullName || 'Update your name'}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm text-gray-500">Gender</h4>
                <p className="text-base text-gray-800">{toTitleCase(data?.gender) || 'Update gender'}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm text-gray-500">Date of Birth</h4>
                <p className="text-base text-gray-800">{formatDob(data?.dob) || 'Update your DOB'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Save / Cancel buttons */}
        {!isLoading && editMode && (
          <div className="border-t p-6 mt-6 flex justify-end gap-2">
            <Button onClick={handleSave} disabled={updateLoading}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </div>
        )}

        {/* Photo Upload Dialog */}
        <PhotoUploadDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onUpload={handleUpload}
          loading={uploading || imageLoading || updateLoading}
        />
      </div>
    </>
  );
};

export default ProfilePage;