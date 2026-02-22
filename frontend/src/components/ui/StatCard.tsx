import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    value: number | string;
    label: string;
    color?: 'blue' | 'green' | 'purple' | 'pink' | 'orange';
    onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
    icon,
    value,
    label,
    color = 'blue',
    onClick
}) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        pink: 'from-pink-500 to-pink-600',
        orange: 'from-orange-500 to-orange-600',
    };

    return (
        <div
            className="stat-card animate-slide-up"
            onClick={onClick}
        >
            <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-4 shadow-lg`}>
                    <div className="text-white text-3xl">
                        {icon}
                    </div>
                </div>

                {/* Value */}
                <div className="text-4xl font-bold text-white mb-2">
                    {value}
                </div>

                {/* Label */}
                <div className="text-sm text-white/80 font-medium">
                    {label}
                </div>
            </div>
        </div>
    );
};
