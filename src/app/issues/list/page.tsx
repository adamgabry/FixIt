'use client';

import { useMemo, useState } from 'react';

import { IssueListItem } from '@/components/list/issue-list-item';
import {
	DEFAULT_FILTERS,
	filterIssues,
	type IssueFilters
} from '@/lib/issue-utils';
import { type Issue, IssueStatus, IssueType } from '@/modules/issue/schema';
import { FloatingAddButton } from '@/components/floating-add-button';
import { RowFilter } from '@/components/filters/row-filter';

const MOCK_ISSUES: Issue[] = [
	{
		id: 1,
		title: 'Graffiti on City Hall',
		description: 'Vandalism with spray paint on the main entrance.',
		location: '48.1486, 17.1077',
		status: IssueStatus.OPEN,
		type: IssueType.HOOLIGANISM,
		pictures: '',
		createdAt: new Date(),
		updatedAt: new Date(),
		reportedBy: 1,
		numberOfUpvotes: 5
	},
	{
		id: 2,
		title: 'Add bike lane on Oak Avenue',
		description: 'Request to add a dedicated bike lane for safer cycling.',
		location: '48.1520, 17.1120',
		status: IssueStatus.IN_PROGRESS,
		type: IssueType.IMPROVEMENT_IDEA,
		pictures: '',
		createdAt: new Date(),
		updatedAt: new Date(),
		reportedBy: 2,
		numberOfUpvotes: 12
	},
	{
		id: 3,
		title: 'Fallen tree blocking path',
		description:
			'Large tree fell during storm, blocking the walking path in central park.',
		location: '48.1450, 17.1040',
		status: IssueStatus.OPEN,
		type: IssueType.NATURE_PROBLEM,
		pictures: '',
		createdAt: new Date(),
		updatedAt: new Date(),
		reportedBy: 3,
		numberOfUpvotes: 8
	},
	{
		id: 4,
		title: 'Broken park bench',
		description: 'Bench in central park has broken slats, unsafe to sit on.',
		location: '48.1500, 17.1000',
		status: IssueStatus.CLOSED,
		type: IssueType.BROKEN,
		pictures: '',
		createdAt: new Date(),
		updatedAt: new Date(),
		reportedBy: 1,
		numberOfUpvotes: 3
	},
	{
		id: 5,
		title: 'Large pothole on Main Street',
		description: 'Deep pothole causing damage to vehicles, safety hazard.',
		location: '48.1530, 17.1060',
		status: IssueStatus.OPEN,
		type: IssueType.ROAD,
		pictures: '',
		createdAt: new Date(),
		updatedAt: new Date(),
		reportedBy: 4,
		numberOfUpvotes: 15
	},
	{
		id: 6,
		title: 'Install new playground equipment',
		description: 'Request for new playground equipment in the community park.',
		location: '48.1470, 17.1150',
		status: IssueStatus.IN_PROGRESS,
		type: IssueType.IMPROVEMENT_IDEA,
		pictures: '',
		createdAt: new Date(),
		updatedAt: new Date(),
		reportedBy: 5,
		numberOfUpvotes: 20
	},
	{
		id: 7,
		title: 'Broken streetlight',
		description:
			'Streetlight has been out for a week, safety concern at night.',
		location: '48.1495, 17.1095',
		status: IssueStatus.OPEN,
		type: IssueType.BROKEN,
		pictures: '',
		createdAt: new Date(),
		updatedAt: new Date(),
		reportedBy: 6,
		numberOfUpvotes: 10
	},
	{
		id: 8,
		title: 'Overgrown vegetation blocking sidewalk',
		description: 'Bushes have overgrown and are blocking pedestrian path.',
		location: '48.1510, 17.1030',
		status: IssueStatus.OPEN,
		type: IssueType.NATURE_PROBLEM,
		pictures: '',
		createdAt: new Date(),
		updatedAt: new Date(),
		reportedBy: 7,
		numberOfUpvotes: 4
	}
];

const IssuesListPage = () => {
	const [filters, setFilters] = useState<IssueFilters>(DEFAULT_FILTERS);

	const issues = MOCK_ISSUES as Issue[];
	const filteredIssues = useMemo(
		() => filterIssues(issues, filters),
		[issues, filters]
	);
	return (
		<div>
			<RowFilter filters={filters} onFiltersChangeAction={setFilters} />
			<ul className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				{filteredIssues.map(issue => (
					<IssueListItem key={issue.id} issue={issue} />
				))}
			</ul>
			<FloatingAddButton />
		</div>
	);
};

export default IssuesListPage;
