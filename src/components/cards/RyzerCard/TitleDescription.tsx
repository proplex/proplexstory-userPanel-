"use client";

import NothingFound from '@/components/common/NothingFound';
import React, { useState } from 'react'

interface ITitleDescriptionProps{
    titleDescriptions: any[]
}

const TitleDescription: React.FC<ITitleDescriptionProps> = ({ titleDescriptions }) => {
  const [showAll, setShowAll] = useState(false);
  const initialItems = 3;

  return (
    <div className='flex flex-col gap-3 w-full border border-gray-200 p-4 mx-auto rounded-sm'>
      {titleDescriptions.length === 0 ? (
        <NothingFound text="No data found" />
      ) : (
        <>
          {(showAll ? titleDescriptions : titleDescriptions.slice(0, initialItems)).map((titleDescription, index) => (
            <div key={index} className='border-b border-gray-200 pb-2'>
              <h2 className='text-lg font-semibold text-black'>{titleDescription.name}</h2>
              <p className='text-sm text-gray-700'>{titleDescription.description}</p>
            </div>
          ))}
          {titleDescriptions.length > initialItems && (
            <button
              onClick={() => setShowAll(!showAll)}
              className='text-blue-600 hover:text-blue-800 font-medium mt-2'
            >
              {showAll ? 'Show Less' : 'See More'}
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default TitleDescription