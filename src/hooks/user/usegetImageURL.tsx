import api from '@/lib/httpClient'
import React, { useState } from 'react'

interface FileData {
    fileName: string;
    fileSize: number;
    mimeType: string;
    refId: string;
    belongsTo: 'asset' | 'user' | 'company' | 'other';
}

const usegetImageURL = () => {
    const [imageURL, setImageURL] = useState<string | null>(null)
    const [s3Response, setS3Response] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const getImageURL = async (fileData: FileData) => {
        setLoading(true)
        setError(null)
        setImageURL(null)
        try {
            const response = await api.post('/s3-file/upload-single', fileData)
            console.log("response", response.data.uploadUrl)
            setImageURL(response.data.uploadUrl)
            setS3Response(response.data?.savedS3Object?._id);
            return {
                uploadUrl: response.data.uploadUrl,
                s3Response: response.data?.savedS3Object?._id
            }

        } catch (error) {
            setError(error as string)
            throw error
        } finally {
            setLoading(false)
        }
    }
    return {getImageURL, imageURL, loading, error}
}

export default usegetImageURL
