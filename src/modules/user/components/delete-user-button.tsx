'use client';

import { deleteUserAction } from '@/modules/user/actions';

type DeleteUserButtonProps = {
	userId: number;
};

export const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
	const handleDelete = async () => {
		await deleteUserAction(userId);
	};

	return (
		<div>
			<button onClick={handleDelete}>Delete</button>
		</div>
	);
};
