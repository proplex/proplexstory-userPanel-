import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Edit, Mail } from 'lucide-react'
import React, { useState, useEffect } from 'react'

const EmailUpdateDialog = ({ open, onOpenChange, mail, onContinue }: { open: boolean, onOpenChange: (open: boolean) => void, mail: string, onContinue: (mail: string) => void }) => {
    const [newEmail, setNewEmail] = useState(mail)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (open) {
            setNewEmail(mail)
            setError(null)
        }
    }, [open, mail])

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleEmailUpdate = () => {
        if (!newEmail.trim()) {
            setError('Email is required')
            return
        }
        if (!validateEmail(newEmail)) {
            setError('Please enter a valid email address')
            return
        }
        if (newEmail === mail) {
            setError('New email must be different from current email')
            return
        }
        setError(null)
        onContinue(newEmail)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[500px] max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="bg-gray-100 p-4 space-y-1">
                    <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <DialogTitle className="text-xl">Edit Email Address</DialogTitle>
                    </div>
                    <DialogDescription className="text-gray-600">Enter your new email address below.</DialogDescription>
                </DialogHeader>
                <div className="px-4 py-6 bg-white space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            id="email"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="pl-10 py-5 border-gray-300 rounded-lg"
                            placeholder="Enter your email address"
                        />
                        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                    </div>
                </div>
                <div className="w-full px-4 pb-2">
                    <Button 
                        onClick={handleEmailUpdate}
                        className="bg-black hover:bg-gray-800 rounded-full w-full"
                    >
                        Send OTP
                    </Button>
                </div>
                <DialogFooter className="px-4 py-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EmailUpdateDialog
