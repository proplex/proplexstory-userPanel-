"use client";
import Icon from './Icon';

const SecurityAcknowledgment = () => {
    return (
        <p className='flex items-center gap-2 text-sm text-gray-500 text-center'>
            <span className='p-2 flex items-center justify-center bg-purple-50 rounded-full'><Icon name="check-shield" type='solid' className='text-emerald-600' /></span>
            <span className='text-gray-500'>Your unit is legally protected!</span>
            <span className='text-base flex items-center justify-center'><Icon name="info-circle" className='text-gray-600' /></span>
        </p>
    )
}

export default SecurityAcknowledgment;