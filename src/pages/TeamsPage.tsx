import React from 'react';
import { TeamsList } from '@/components/worldcup/TeamsList';

export const TeamsPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 md:py-12">
       <TeamsList />
    </div>
  );
};
