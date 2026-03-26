import React from 'react'

export const metadata = {
  title: 'Statistics - QodeQuiz',
  description: 'Your statistics',
};

import StatisticsContent from '@/components/statistics/statistics-content';


const StatisticsPage:React.FC = () => {
  return <StatisticsContent />
}


export default StatisticsPage