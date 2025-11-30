import * as React from 'react';
import { Pencil } from 'lucide-react';
import { Button, type ButtonProps } from './button';

export type EditButtonProps = Omit<ButtonProps, 'variant'> & {
	showIcon?: boolean;
};

const EditButton = React.forwardRef<HTMLButtonElement, EditButtonProps>(
	({ children, showIcon = true, ...props }, ref) => {
		return (
			<Button variant="secondary" ref={ref} {...props}>
				{showIcon && <Pencil />}
				{children}
			</Button>
		);
	}
);
EditButton.displayName = 'EditButton';

export { EditButton };

