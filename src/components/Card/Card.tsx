import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Card Component
 * 
 * A versatile card component for displaying content
 */
export const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  className = '',
}) => {
  return (
    <div className={`${styles.card} ${className}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Card;
