import {
    FaFileAlt,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle
} from 'react-icons/fa';

export const AdminStatsCard = ({ stats }) => {
    const cards = [
        { key: 'total', label: 'Total Laporan', icon: FaFileAlt, color: 'total', value: stats.total },
        { key: 'pending', label: 'Sedang Diproses', icon: FaClock,color: 'pending', value:(stats.pending || 0) +(stats.reviewed || 0) + (stats.inProgress || 0)},
        { key: 'resolved', label: 'Selesai', icon: FaCheckCircle, color: 'resolved', value: stats.resolved },
        { key: 'highPriority', label: 'Prioritas Tinggi', icon: FaExclamationTriangle, color: 'high', value: stats.priority?.high }
    ];

    return (
        <div className="stats-grid">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div key={card.key} className="stat-card">
                        <div className={`stat-icon ${card.color}`}>
                            <Icon />
                        </div>
                        <div>
                            <div className="stat-number">{card.value?.toLocaleString() || 0}</div>
                            <div className="stat-label">{card.label}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};