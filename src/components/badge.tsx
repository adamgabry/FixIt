import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const badgeVariants = cva(
	'inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-medium transition-colors',
	{
		variants: {
			variant: {
				default:
					'bg-orange-100 border border-orange-300/60 text-orange-800',
				secondary:
					'bg-gray-100 border border-gray-300/60 text-gray-800',
				success:
					'bg-green-100 border border-green-300/60 text-green-800',
				warning:
					'bg-yellow-100 border border-yellow-300/60 text-yellow-800',
				danger:
					'bg-red-100 border border-red-300/60 text-red-800',
				info:
					'bg-blue-100 border border-blue-300/60 text-blue-800',
				outline:
					'bg-transparent border border-current'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
	VariantProps<typeof badgeVariants>;

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
	({ className, variant, ...props }, ref) => {
		return (
			<span
				ref={ref}
				className={cn(badgeVariants({ variant }), className)}
				{...props}
			/>
		);
	}
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
