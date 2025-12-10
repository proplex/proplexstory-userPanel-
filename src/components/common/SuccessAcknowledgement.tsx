"use client";

import Icon from '@/components/common/Icon';
import React from 'react';

interface SuccessAcknowledgementProps {
    successMessageTitle?: string;
    successMessageDescription?: string;
}

const SuccessAcknowledgement: React.FC<SuccessAcknowledgementProps> = ({ successMessageTitle, successMessageDescription }) => {
  return (
    <div className="w-96 flex-1 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center w-40 h-40 rounded-full bg-emerald-500/10">
            <div className="flex items-center justify-center w-32 h-32 rounded-full bg-emerald-500/10">
                <Icon name='check-circle' type='solid' className='text-emerald-500 text-9xl'/>
            </div>
        </div>
        {
            successMessageTitle && (    
                <p className='text-2xl font-semibold text-black-500'>{successMessageTitle}</p>
            )
        }
        {
            successMessageDescription && (
                <p className='text-gray-500'>{successMessageDescription}</p>
            )
        }
    </div>
  )
}

export default SuccessAcknowledgement;
