import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default:
					'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg border-2 border-orange-400/60 hover:border-orange-500',
				secondary:
					'bg-gray-100 text-gray-900 hover:bg-gray-200 border-2 border-gray-300/60 hover:border-gray-400 shadow-sm hover:shadow-md',
				destructive:
					'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-2 border-red-500/60 hover:border-red-600 shadow-md hover:shadow-lg shadow-red-500/20',
				outline:
					'border-2 border-orange-200 bg-white/80 hover:bg-orange-50 hover:border-orange-300 backdrop-blur-sm',
				ghost:
					'hover:bg-orange-50 hover:text-orange-900 text-gray-700',
				link: 'text-orange-600 underline-offset-4 hover:underline hover:text-orange-700',
				success:
					'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg border-2 border-orange-400/60 hover:border-orange-500'
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 px-3 text-sm',
				lg: 'h-11 px-8 text-base',
				icon: 'h-10 w-10'
			},
			animation: {
				none: '',
				scale: 'hover:scale-[1.02] active:scale-[0.98]',
				lift: 'hover:-translate-y-0.5',
				rotate: 'hover:rotate-1 active:rotate-0'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
			animation: 'none'
		}
	}
);

export type ButtonProps = {
	asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
	VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className, variant, size, animation, asChild = false, ...props },
		ref
	) => {
		const Comp = asChild ? Slot : 'button';

		return (
			<Comp
				className={cn(buttonVariants({ variant, size, animation, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
