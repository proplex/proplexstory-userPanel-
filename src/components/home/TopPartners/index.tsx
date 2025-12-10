"use client";

import React from 'react';
import Image from 'next/image';
import { TopPartners } from './top-partners-data';

const TopPartnersComponent = () => {
  return (
    <section className='w-full px-4 py-8 mx-auto max-w-7xl'>
      <h2 className='text-2xl font-semibold text-left mb-6 md:text-3xl lg:text-4xl'>
        Top Partners
      </h2>
      <div className='grid grid-cols-4 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-2'>
        {TopPartners.map((partner, index) => (
          <article 
            key={index} 
            className='flex flex-col p-3 transition-all duration-300 bg-white rounded-xl shadow-sm hover:shadow-md group'
            aria-label={`Partner: ${partner.name}`}
          >
            <div className='relative w-full aspect-video mb-2'>
              <Image 
                src={partner.thumbnail} 
                alt={partner.name} 
                fill 
                className='object-cover rounded-lg transition-transform duration-300 group-hover:scale-105'
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw "
              />
            </div>
            <div className='hidden lg:flex flex-col flex-grow justify-center'>
              <h3 className='text-base  font-medium lg:font-semibold md:font-semibold md:text-lg mb-1'>
                {partner.name}
              </h3>
              <p className='text-xs text-gray-600 md:text-sm'>
                {partner.noOfProjects}+ Projects Found
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TopPartnersComponent;

