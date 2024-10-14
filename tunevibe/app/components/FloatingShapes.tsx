import React from 'react';

interface FloatingShapesProps {
  color1?: string;
  color2?: string;
}

const FloatingShapes: React.FC<FloatingShapesProps> = ({ color1 = 'bg-blue-400', color2 = 'bg-red-600' }) => {
  return (
    <div className="absolute inset-0 z-10">
      <div className="inset-0 bg-background/80 backdrop-blur-3xl absolute z-[9]" />
      <div className="max-w-4xl mx-auto absolute inset-0">
        <div className={`inset-0 size-96 ${color1} rounded-full absolute z-[7] animate-circularRight`} />
        <div className={`inset-0 left-20 top-20 size-96 ${color2} rounded-full absolute z-[8] animate-circularLeft`} />
      </div>
    </div>
  );
};

export default FloatingShapes;
