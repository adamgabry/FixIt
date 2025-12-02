import * as React from 'react';
import { Trash2 } from 'lucide-react';

import { Button, type ButtonProps } from './button';

export type DeleteButtonProps = Omit<ButtonProps, 'variant'> & {
	showIcon?: boolean;
};

const DeleteButton = React.forwardRef<HTMLButtonElement, DeleteButtonProps>(
	({ children, showIcon = true, ...props }, ref) => (
		<Button variant="destructive" ref={ref} {...props}>
			{showIcon && <Trash2 />}
			{children}
		</Button>
	)
);
DeleteButton.displayName = 'DeleteButton';

export { DeleteButton };
