import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/" className="breadcrumb-item" title="Home">
        <Home size={15} />
        <span>Home</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight size={14} className="breadcrumb-separator" />
            {isLast || !item.to ? (
              <span className="breadcrumb-item active" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link to={item.to} className="breadcrumb-item">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
