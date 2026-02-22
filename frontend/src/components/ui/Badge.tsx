import React from 'react';

type BadgeVariant = 'approve' | 'reject' | 'served' | 'appoint' | 'waiting' | 'active' | 'paused' | 'ended';

interface BadgeProps {
    variant: BadgeVariant;
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
    const variantClasses = {
        approve: 'badge-approve',
        reject: 'badge-reject',
        served: 'badge-served',
        appoint: 'badge-appoint',
        waiting: 'badge-waiting',
        active: 'badge-active',
        paused: 'badge-paused',
        ended: 'badge-ended',
    };

    return (
        <span className={`badge ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
};
