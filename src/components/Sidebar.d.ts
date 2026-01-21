import React from 'react';
import { ViewType } from '../types';
interface SidebarProps {
    activeView: ViewType;
    setActiveView: (view: ViewType) => void;
}
export declare const Sidebar: React.FC<SidebarProps>;
export {};
