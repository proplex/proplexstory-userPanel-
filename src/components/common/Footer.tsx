'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Twitter, Linkedin } from 'lucide-react'

const footerLinks = {
  about: ['About us', 'Blog', 'Agents', 'New Property'],
  service: ['Payment & Tax', 'Features', 'View Booking', 'Contact Us'],
}

const Footer = () => {
  return (
    <footer className="bg-[#1D2939] text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Image 
              src="/Ryzer-Logo.svg" 
              alt="Fandora" 
              width={120} 
              height={32} 
              className="h-auto w-auto"
            />
            <p className="text-sm text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, imperdiet tempus
              duis vitae sit et tristique.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Service</h3>
            <ul className="space-y-2">
              {footerLinks.service.map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Our Location</h3>
            <p className="text-sm text-gray-400 mb-4">
              2972 Westheimer Rd. Santa Ana, Illinois 85486
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-400">
          <p className="text-sm text-gray-400">
            Copyright 2022 flora. All Rights Reserved
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-gray-400 hover:text-white">
              Terms & Conditions
            </Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;