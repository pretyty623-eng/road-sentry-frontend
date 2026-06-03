import { AnimatedCounter } from './AnimatedCounter';

export const StatsSection = ({ stats, animated }) => {
    const statsData = [
        { key: 'total', label: 'Total Laporan' },
        { key: 'pending', label: 'Sedang Diproses' },
        { key: 'resolved', label: 'Telah Ditangani' }
    ];

    return (
        <div className="stats-bar">
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
};