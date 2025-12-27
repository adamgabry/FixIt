import { Loader } from 'lucide-react';

import { Button } from '@/components/buttons/button';

type SubmitButtonProps = {
	isLoading?: boolean;
	children?: React.ReactNode;
	className?: string;
};

export const SubmitButton = ({
	isLoading = false,
	children,
	className
}: SubmitButtonProps) => (
	<Button type="submit" disabled={isLoading} className={className}>
		{isLoading && <Loader className="animate-spin" />}
		{children || <span>Submit</span>}
	</Button>
);

