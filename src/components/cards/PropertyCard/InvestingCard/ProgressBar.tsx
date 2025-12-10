import React from 'react';

interface ProgressBarProps {
  totalTokens: number;
  availableTokens: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ totalTokens, availableTokens, total }) => {
  const totalBars = 100;
  const filledBars = Math.round((totalTokens - availableTokens) / totalTokens * totalBars);

  return (
    <div
      style={{
        display: 'flex',
        gap: '3px',
        padding: '5px',
        opacity: 1,
        transform: 'rotate(0deg)',
        maxWidth: '100%',
      }}
    >
      {[...Array(totalBars)].map((_, index) => (
        <div
          key={index}
          style={{
            width: '4px',
            height: '30px',
            borderRadius: '4px',
            backgroundColor: index < filledBars ? '#4caf50' : '#e0e0e0',
          }}
        />
      ))}
    </div>
  );
};

export default ProgressBar;
