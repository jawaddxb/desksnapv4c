/**
 * PrototypeLayout Component
 *
 * Wrapper component that provides the switcher and outlet for prototype routes.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { PrototypeSwitcher } from './PrototypeSwitcher';

export const PrototypeLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <PrototypeSwitcher />
      <Outlet />
    </div>
  );
};

export default PrototypeLayout;
