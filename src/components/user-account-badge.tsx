import { Circle } from 'lucide-react';

export const UserAccountBadge = () => (
	<div className="flex items-center gap-6">
		<Circle fill="white" />
		<div>
			<div>Name Surname</div>
			<div>role</div>
		</div>
	</div>
);
