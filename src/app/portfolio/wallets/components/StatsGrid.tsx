'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  type: 'available' | 'upcoming' | 'pnl' | 'rewards';
  viewLink?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, type, viewLink }) => {
  const getBgColor = () => {
    switch (type) {
      case 'available':
        return 'bg-yellow-50';
      case 'upcoming':
        return 'bg-blue-50';
      case 'pnl':
        return 'bg-pink-50';
      case 'rewards':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className={`${getBgColor()} rounded-xl p-4`}>
      <div className="flex justify-between items-start">
        <span className="text-sm text-gray-600">{title}</span>
        {viewLink && (
          <button className="text-sm text-gray-600 hover:text-gray-900">View</button>
        )}
      </div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  );
};

interface StatsGridProps {
  available: string;
  upcomingEarnings: string;
  pnl24h: string;
  rewards: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  available,
  upcomingEarnings,
  pnl24h,
  rewards,
}) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <StatCard title="Available" value={available} type="available" />
      <StatCard title="Upcoming Earnings" value={upcomingEarnings} type="upcoming" />
      <StatCard title="24h PnL" value={pnl24h} type="pnl" />
      <StatCard title="Rewards" value={rewards} type="rewards" viewLink />
    </div>
  );
};