"use client";
import React, { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import useAuthTokenStore from '@/store/authTokenStore';


interface AddBalanceDialogProps {
    children: React.ReactNode;
}

const AddBalanceDialog: React.FC<AddBalanceDialogProps> = ({
    children
}) => {
    const [amount, setAmount] = useState<string>("");
    const { getAuthToken } = useAuthTokenStore();
    const navigate = useRouter();

    const addBalance = async(e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/escrow/deposit`, {
                headers: {
                    "Authorization": `Bearer ${getAuthToken()}`,
                    "Content-Type": "application/json",
                },
                method: 'POST',
                body: JSON.stringify({ amount: Number(amount) }),
            });
            const jsonData = await response.json();
            const redirectURL = jsonData?.data?.payment_url?.url;
            if(redirectURL) {
                navigate.push(redirectURL);

                // window.open(redirectURL, '_blank', 'noopener,noreferrer');
            }

            // window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-semibold flex flex-col gap-2">
                        <h2 className="text-xl font-bold">
                            Add Funds to Escrow
                        </h2>
                        <p className='text-sm text-gray-600'>Enter the amount(in INR) you want to add to your escrow account.</p>
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={addBalance} className="w-full flex flex-col gap-2">
                    <input
                        placeholder="Enter Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="border border-gray-300 rounded-md p-2"
                    />
                    <Button type='submit' className="bg-fprimary text-white">
                        Add Funds
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
export default AddBalanceDialog