import { type PropsWithChildren } from 'react';

import { cn } from '@/lib/cn';

export const LabeledItem = ({
	label,
	children,
	className
}: PropsWithChildren<{ label: string; className?: string }>) => (
	<div className={cn(className)}>
		{children && (
			<>
				<span className="text-sm text-gray-500">{label}</span>
				<div className="truncate text-2xl">{children}</div>
			</>
		)}
	</div>
);
