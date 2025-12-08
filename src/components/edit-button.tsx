import * as React from 'react';
import { Pencil } from 'lucide-react';

import { cn } from '@/lib/cn';

import { Button, type ButtonProps } from './button';

export type EditButtonProps = Omit<ButtonProps, 'variant'> & {
	showIcon?: boolean;
};

const EditButton = React.forwardRef<HTMLButtonElement, EditButtonProps>(
	({ children, showIcon = true, className, size, ...props }, ref) => {
		const buttonSize = size ?? 'default';

		return (
			<Button
				variant="secondary"
				size={buttonSize}
				className={cn(
					'group relative transition-all duration-300 ease-out',
					'border-2 border-secondary/60',
					'shadow-md hover:shadow-lg',
					'hover:scale-[1.02] active:scale-[0.98]',
					'hover:border-secondary',
					'hover:bg-secondary/90',
					'rounded-lg',
					'backdrop-blur-sm',
					'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
					'active:shadow-inner',
					className
				)}
				ref={ref}
				{...props}
			>
				{showIcon && (
					<Pencil
						className={cn(
							'transition-transform duration-300 ease-out',
							'group-hover:rotate-12 group-hover:scale-110',
							'group-active:rotate-0 group-active:scale-100'
						)}
					/>
				)}
				{children ?? 'Edit'}
			</Button>
		);
	}
);
EditButton.displayName = 'EditButton';

export { EditButton };
