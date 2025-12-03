'server-only';

import { users, issues, likes } from './schema';

import { db } from './index';
import { IssueStatus, IssueType } from '@/modules/issue/schema';

export const seedDatabase = async () => {
	// Clear existing data
	await db.delete(issues);
	await db.delete(likes);
	await db.delete(users);

	// Insert users
	await db.insert(users).values([
		{
			id: '1',
			name: 'User',
			username: 'user',
			password: 'user123',
			role: 'user',
			isLoggedIn: false
		},
		{
			id: '2',
			name: 'Stuff',
			username: 'stuff',
			password: 'stuff123',
			role: 'stuff',
			isLoggedIn: false
		},
		{
			id: '3',
			name: 'Admin',
			username: 'admin',
			password: 'admin123',
			role: 'admin',
			isLoggedIn: false
		}
	]);

	// Insert issues
	await db.insert(issues).values([
		{
			id: '1',
			title: 'Graffiti on City Hall',
			description: 'Vandalism with spray paint on the main entrance.',
			latitude: 48.1486,
			longitude: 17.1077,
			status: IssueStatus.REPORTED,
			type: IssueType.HOOLIGANISM,
			pictures: ['1'],
			createdBy: '1',
		},
		{
			id: '2',
			title: 'Fallen tree blocking path',
			description: 'Large tree fell during storm, blocking the walking path in central park.',
			latitude: 48.1520,
			longitude: 17.1120,
			status: IssueStatus.REPORTED,
			type: IssueType.NATURE_PROBLEM,
			pictures: ['2'],
			createdBy: '1',
		},
		{
			id: '3',
			title: 'Large pothole on Main Street',
			description: 'Deep pothole causing damage to vehicles, safety hazard.',
			latitude: 48.1500,
			longitude: 17.1000,
			status: IssueStatus.REPORTED,
			type: IssueType.ROAD,
			pictures: ['3'],
			createdBy: '1',
		},
	]);
};
