import { Camera, Upload, X, } from 'lucide-react'
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import React, { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import useInvestorApi from '@/hooks/user/useInvestorApi'
interface ProfilePhotoUploadProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpload?: (file: File) => void
    loading?: boolean
}

export default function ProfilePhotoUpload({ open, onOpenChange, onUpload, loading = false }: ProfilePhotoUploadProps) {
    const [dragActive, setDragActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { data, loading: imageLoading } = useInvestorApi()

    // Generate preview URL when file is selected
    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreviewUrl(objectUrl)

        // Free memory when this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleUpload = () => {
        if (selectedFile && onUpload) {
            onUpload(selectedFile)
            onOpenChange(false)
        }
    }

    const handleCancel = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
        onOpenChange(false)
    }

    const handleRemoveFile = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-row items-center space-y-0 space-x-2">
                    <Camera className="h-5 w-5" />
                    <DialogTitle className="text-xl font-bold">Update Profile Photo</DialogTitle>
              
                </DialogHeader>

                <p className="text-muted-foreground mt-0">
                    Upload a new profile photo. The image should be square for best results.
                </p>

                {previewUrl ? (
                    <div className="mt-4 flex flex-col items-center space-y-4">
                        <div className="relative">
                            <Image
                                src={previewUrl}
                                alt="Profile preview"
                                width={208}
                                height={208}
                                className="h-52 w-52 rounded-lg object-cover"
                            />
                            <Button
                                variant="secondary"
                                size="icon"
                                className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                                onClick={handleRemoveFile}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                        <p className="text-sm text-gray-500">
                            {selectedFile?.name} ({(selectedFile?.size || 0 / 1024).toFixed(1)} KB)
                        </p>
                        <Button variant="outline" onClick={handleButtonClick} className="rounded-full">
                            Choose Different Photo
                        </Button>
                    </div>
                ) : data?.avatar ? (
                    <div className="mt-4 flex flex-col items-center space-y-4">
                        <div className="relative">
                            <Image
                                src={data.avatar}
                                alt="Current profile"
                                width={208}
                                height={208}
                                className="h-52 w-52 rounded-lg object-cover"
                            />
                        </div>
                        <Button variant="outline" onClick={handleButtonClick} className="rounded-full">
                            Change Photo
                        </Button>
                    </div>
                ) : (
                    <div
                        className={`mt-4 border-2 border-dashed rounded-lg p-12 text-center ${
                            dragActive ? "border-primary bg-primary/5" : "border-gray-300"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="rounded-full bg-gray-100 p-3">
                                <Upload className="h-6 w-6 text-gray-500" />
                            </div>
                            <p className="text-gray-600">Drag and drop your image here, or click to select a file</p>
                            <p className="text-sm text-gray-500">Recommended aspect ratio: 1:1</p>
                            <Button variant="outline" onClick={handleButtonClick} className="mt-2 rounded-full">
                                Select File
                            </Button>
                        </div>
                    </div>
                )}

                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />

                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button variant="outline" onClick={handleCancel} className="rounded-full" disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || loading}
                        className="rounded-full bg-gray-500 hover:bg-gray-600"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Uploading...</span>
                            </div>
                        ) : (
                            "Upload Photo"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
