"use client";

import React from "react";

interface SocialIconProps {
    icon: JSX.Element;
}

const SocailIcon: React.FC<SocialIconProps> = ({icon}) => {
  return (
    <div className="p-4 rounded-full text-blue-500 bg-white">
        {icon}
    </div>
  )
}

export default SocailIcon