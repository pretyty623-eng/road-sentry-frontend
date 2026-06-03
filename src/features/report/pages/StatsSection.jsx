import { forwardRef } from 'react';
import { AnimatedCounter } from './AnimatedCounter';

export const StatsSection = forwardRef(({ stats, animated }, ref) => {
  const statsData = [
    { key: 'total', label: 'Total Laporan' },
    { key: 'pending', label: 'Sedang Diproses' },
    { key: 'resolved', label: 'Telah Ditangani' }
  ];

  return (
    <div className="stats-bar" ref={ref}>
      {statsData.map((stat) => (
        <div key={stat.key} className="stat-card">
          <div className="stat-number">
            {animated ? (
              <AnimatedCounter target={stats[stat.key]} />
            ) : (
              stats[stat.key]
            )}
          </div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
});

StatsSection.displayName = 'StatsSection';