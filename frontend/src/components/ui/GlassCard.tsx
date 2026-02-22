import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    padding = 'md',
    hover = false,
    onClick
}) => {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div
            className={`glass-card ${paddingClasses[padding]} ${hover ? 'hover-lift' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
