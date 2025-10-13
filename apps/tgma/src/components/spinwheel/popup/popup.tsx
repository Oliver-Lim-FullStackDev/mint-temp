'use client';

import React from 'react';
import './popup.css'; // import the CSS module or global style

type PopupProps = {
  children: React.ReactNode;
};

export const Popup: React.FC<PopupProps> = ({ children }) => {
  return <div className="popup">{children}</div>;
};
