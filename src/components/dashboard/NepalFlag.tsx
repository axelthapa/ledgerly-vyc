
import React from "react";

const NepalFlag: React.FC = () => {
  return (
    <div className="nepal-flag animate-flag-wave h-24 w-20 origin-bottom-left relative">
      <svg viewBox="0 0 300 350" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#DC143C"
          d="M0,0 L300,0 L150,150 L300,300 L0,300 z"
        />
        <path
          fill="#003893"
          d="M0,0 L250,0 L125,125 L250,250 L0,250 z"
        />
        <circle cx="125" cy="80" r="40" fill="#fff" />
        <circle cx="110" cy="95" r="40" fill="#DC143C" />
        <path
          fill="#fff"
          d="M110,55 L125,95 L90,70 L130,70 L95,95 z"
        />
        <circle cx="125" cy="170" r="40" fill="#fff" />
        <circle cx="110" cy="185" r="40" fill="#DC143C" />
        <path
          fill="#fff"
          d="M110,145 L125,185 L90,160 L130,160 L95,185 z"
        />
      </svg>
    </div>
  );
};

export default NepalFlag;
