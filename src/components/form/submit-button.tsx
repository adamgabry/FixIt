import { Loader } from 'lucide-react';

import { Button } from '../button';

export const SubmitButton = ({
	isLoading = false
}: {
	isLoading?: boolean;
}) => (
	<Button type="submit" disabled={isLoading}>
		{isLoading && <Loader className="animate-spin" />}
		<span>Submit</span>
	</Button>
);
