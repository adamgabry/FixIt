import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const cardVariants = cva('rounded-xl transition-all duration-200 ease-out', {
	variants: {
		variant: {
			elevated:
				'bg-white border border-orange-200/50 shadow-md hover:shadow-lg',
			outlined:
				'bg-transparent border-2 border-orange-200/60 hover:border-orange-300/80',
			ghost: 'bg-transparent hover:bg-orange-50/30'
		},
		hover: {
			lift: 'hover:-translate-y-1',
			glow: 'hover:shadow-orange-200/30',
			none: ''
		},
		padding: {
			none: '',
			sm: 'p-3',
			md: 'p-4',
			lg: 'p-6'
		}
	},
	defaultVariants: {
		variant: 'elevated',
		hover: 'none',
		padding: 'md'
	}
});

export type CardProps = {
	clickable?: boolean;
	asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement> &
	VariantProps<typeof cardVariants>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(
	(
		{
			className,
			variant,
			hover,
			padding,
			clickable = false,
			children,
			...props
		},
		ref
	) => (
		<div
			ref={ref}
			className={cn(
				cardVariants({ variant, hover, padding }),
				clickable && 'cursor-pointer active:scale-[0.98]',
				className
			)}
			{...props}
		>
			{children}
		</div>
	)
);

Card.displayName = 'Card';

export { Card, cardVariants };
