import * as React from 'react';
import { Trash2 } from 'lucide-react';

import { cn } from '@/lib/cn';

import { Button, type ButtonProps } from './button';

export type DeleteButtonProps = Omit<ButtonProps, 'variant'> & {
	showIcon?: boolean;
};

const DeleteButton = React.forwardRef<HTMLButtonElement, DeleteButtonProps>(
	({ children, showIcon = true, className, size, ...props }, ref) => {
		const buttonSize = size ?? 'default';

		return (
			<Button
				variant="destructive"
				size={buttonSize}
				className={cn(
					'group relative transition-all duration-300 ease-out',
					'bg-red-600 hover:bg-red-700 active:bg-red-800',
					'text-white',
					'border-2 border-red-500/60 hover:border-red-600',
					'shadow-md hover:shadow-lg shadow-red-500/20',
					'hover:scale-[1.02] active:scale-[0.98]',
					'rounded-lg',
					'backdrop-blur-sm',
					'focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
					'active:shadow-inner',
					className
				)}
				ref={ref}
				{...props}
			>
				{showIcon && (
					<Trash2
						className={cn(
							'transition-transform duration-300 ease-out',
							'group-hover:rotate-12 group-hover:scale-110',
							'group-active:rotate-0 group-active:scale-100'
						)}
					/>
				)}
				{children ?? 'Delete'}
			</Button>
		);
	}
);
DeleteButton.displayName = 'DeleteButton';

export { DeleteButton };
