'use client';
import React, { type ReactNode, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/cn';

type SidebarProps = {
	children: ReactNode;
	defaultWidth?: number;
	collapsedWidth?: number;
};

const sidebarWidth = 288;
const sidebarCollapsedWidth = 48;

export const SlidingSidebar: React.FC<SidebarProps> = ({
	children,
	defaultWidth = sidebarWidth,
	collapsedWidth = sidebarCollapsedWidth
}) => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<div
			className={cn('h-full flex flex-col z-20')}
			style={{ width: isCollapsed ? collapsedWidth : defaultWidth }}
		>
			<div className="p-3 border-b border-orange-200/50 flex items-center justify-end">
				<button 
					onClick={() => setIsCollapsed(!isCollapsed)}
					className={cn(
						'p-2 rounded-lg transition-colors',
						'bg-white hover:bg-orange-50 border-2 border-orange-200',
						'text-orange-600 hover:text-orange-700',
						'shadow-sm hover:shadow-md active:scale-95 transition-transform'
					)}
					aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				>
					{isCollapsed ? (
						<ChevronRight className="w-4 h-4" />
					) : (
						<ChevronLeft className="w-4 h-4" />
					)}
				</button>
			</div>
			<div className={cn('flex-1 overflow-y-auto m-2', isCollapsed && 'hidden')}>
				{children}
			</div>
		</div>
	);
};
