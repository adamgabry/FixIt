'use client';
import React, { type ReactNode, useState } from 'react';

import { cn } from '@/lib/cn';

type SidebarProps = {
	children: ReactNode;
	defaultWidth?: number;
	collapsedWidth?: number;
};

const sidebarWidth = 288;
const sidebarCollapsedWidth = sidebarWidth / 6;

export const SlidingSidebar: React.FC<SidebarProps> = ({
	children,
	defaultWidth = sidebarWidth,
	collapsedWidth = sidebarCollapsedWidth
}) => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<div
			className={cn('h-full flex flex-col transition-all duration-300 z-20')}
			style={{ width: isCollapsed ? collapsedWidth : defaultWidth }}
		>
			<div className="p-3 border-b flex items-center justify-between">
				{!isCollapsed && <span>Filters</span>}
				<button onClick={() => setIsCollapsed(!isCollapsed)}>
					{isCollapsed ? '→' : '←'}
				</button>
			</div>
			{!isCollapsed && (
				<div className="flex-1 overflow-y-auto m-2">{children}</div>
			)}
		</div>
	);
};
