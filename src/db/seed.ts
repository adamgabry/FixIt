import 'dotenv/config.js';
import { IssueStatus, IssueType } from '@/modules/issue/schema';
import { issueLikes } from '@/db/schema/likes';
import { users } from '@/db/schema/users';
import { issues } from '@/db/schema/issues';

import { db } from './index';

export const seedDatabase = async () => {
	// Clear existing data
	await db.delete(issues);
	await db.delete(issueLikes);
	await db.delete(users);

	// Insert users
	await db.insert(users).values([
		{
			id: 1,
			name: 'User',
			email: 'user@user.sk',
			password: 'user123',
			role: 'user'
		},
		{
			id: 2,
			name: 'Stuff',
			email: 'staff@staff.sk',
			password: 'staff123',
			role: 'staff'
		},
		{
			id: 3,
			name: 'Admin',
			email: 'admin@admin.sk',
			password: 'admin123',
			role: 'admin'
		}
	]);

	// Insert issues
	await db.insert(issues).values([
		{
			id: 1,
			title: 'Graffiti on City Hall',
			description: 'Vandalism with spray paint on the main entrance.',
			latitude: 48.1486,
			longitude: 17.1077,
			status: IssueStatus.REPORTED,
			type: IssueType.HOOLIGANISM,
			reporterId: 1,
			createdAt: 1,
			updatedAt: 1
		},
		{
			id: 2,
			title: 'Fallen tree blocking path',
			description:
				'Large tree fell during storm, blocking the walking path in central park.',
			latitude: 48.152,
			longitude: 17.112,
			status: IssueStatus.REPORTED,
			type: IssueType.NATURE_PROBLEM,
			reporterId: 2,
			createdAt: 1,
			updatedAt: 1
		},
		{
			id: 3,
			title: 'Large pothole on Main Street',
			description: 'Deep pothole causing damage to vehicles, safety hazard.',
			latitude: 48.15,
			longitude: 17.1,
			status: IssueStatus.REPORTED,
			type: IssueType.NATURE_PROBLEM,
			reporterId: 1,
			createdAt: 1,
			updatedAt: 1
		}
	]);

	// Insert likes
	await db.insert(issueLikes).values([
		// User 1 likes issues 1 and 2
		{
			userId: '1',
			issueId: '1'
		},
		{
			userId: '1',
			issueId: '2'
		},

		// User 2 likes issues 1 and 3
		{
			userId: '2',
			issueId: '1'
		},
		{
			userId: '2',
			issueId: '3'
		},

		// User 3 likes issue 2
		{
			userId: '3',
			issueId: '2'
		}
	]);
};
