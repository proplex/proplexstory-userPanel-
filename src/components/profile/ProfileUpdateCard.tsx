'use client'
import { Mail, Phone, MapPin, Edit, User, Calendar } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import useInvestorApi from '@/hooks/user/useInvestorApi'
import { ProfileUpdateDialog } from './DialogBoxes/ProfileUpdateDialog'
import AddressDialog from './DialogBoxes/AddressDialog'
import PhotoUploadDialog from './DialogBoxes/PhotoUploadDialog'
import usegetImageURL from '@/hooks/user/usegetImageURL'
import api from '@/lib/httpClient'
import useUpdateInvestorApi from '@/hooks/user/useUpdateInvestorApi'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
const ProfileUpdateCard = () => {
    const { data, fetchData } = useInvestorApi()
    const [isEdit, setIsEdit] = useState(false)
    const [open, setOpen] = useState(false)
    const { getImageURL, loading: imageLoading } = usegetImageURL()
    const { updateInvestor, loading: updateLoading } = useUpdateInvestorApi()
    const [uploading, setUploading] = useState(false)

    const handleProfileUpdate = () => {
        setIsEdit(false);
        fetchData();
    }


    const handleUpload = async (file: File) => {
        setUploading(true)
        try {
            const fileData = {
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
                refId: data?._id || '',
                belongsTo: 'user' as const
            }

            // Get the S3 upload URL
            const uploadUrl = await getImageURL(fileData)

            // Upload file to S3
            await fetch(uploadUrl.uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type
                }
            })

            // Update profile with the final image URL
            const responseS3Url = await api.get(`/s3-file/${uploadUrl.s3Response}/s3Url`)
            await updateInvestor({
                avatar: responseS3Url.data.s3Url
            })
            fetchData()
            setOpen(false)
        } catch (error) {
            console.error('Error uploading file:', error)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            <div className="flex flex-col items-center max-w-md mx-auto p-6 bg-white rounded-lg">
                <div className="relative mb-4">
                    <div className="w-52 h-52 rounded-full border-2 border-white shadow-lg overflow-hidden relative">
                        {uploading ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <Skeleton className="w-52 h-52 rounded-full mb-4 animate-pulse"  />
                            </div>
                        ) : (
                            <Image
                                src={data?.avatar || "/images/default-avatar.png"}
                                alt="Profile picture"
                                width={208}
                                height={208}
                                className="object-cover w-full h-full"
                                priority
                            />
                        )}
                    </div>
                    <button
                        className="absolute bottom-3 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        aria-label="Edit profile picture"
                        onClick={() => setOpen(true)}
                        disabled={uploading}
                    >
                        <Edit className="w-4 h-4 text-gray-700" />
                    </button>
                </div>

                {/* Name and Status */}
                <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl font-semibold text-gray-900">{data?.fullName.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h1>

                    {
                        data?.isEmailVerified && (
                            <span className="w-3 h-3 rounded-full bg-green-400"></span>
                        )
                    }
                </div>

                {/* Gender */}

                {/* Contact Information */}
                <div className="w-full space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                        <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <span className="text-sm">{data?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <span className="text-sm">{data?.mobileNumber}</span>
                        {
                            data?.isMobileVerified ? (
                                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            ) : (
                                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                            )
                        }
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <User className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <span className="text-sm">{data?.gender || "Please update your gender"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <span className="text-sm">{formatDate(data?.dateOfBirth) || "Please update your date of birth"}</span>
                    </div>
                </div>

                <button className="w-full bg-[#725ace] text-white p-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#725ace]/80 transition-colors" onClick={() => setIsEdit(true)}>
                    <Edit className="w-4 h-4" />
                    <span className="text-base  font-medium" >Edit Profile</span>
                </button>
            </div>
            <PhotoUploadDialog
                open={open}
                onOpenChange={setOpen}
                onUpload={handleUpload}
                loading={uploading || imageLoading || updateLoading}
            />
            <ProfileUpdateDialog
                open={isEdit}
                onOpenChange={setIsEdit}
                onContinue={handleProfileUpdate}
                data={data}
            />

        </div>
    )
}

export default ProfileUpdateCard
