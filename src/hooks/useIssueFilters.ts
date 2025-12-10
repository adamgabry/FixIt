'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { DEFAULT_FILTERS } from '@/lib/issue-utils';
import { fetchFilteredIssues } from '@/modules/issue/api/issuesClient';
import {
	type Issue,
	type IssueType,
	type IssueStatus
} from '@/modules/issue/schema';

export type SortField = 'upvotes' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export const useIssueFilters = (initialIssues: Issue[]) => {
	const [types, setTypes] = useState<IssueType[]>(DEFAULT_FILTERS.types);
	const [statuses, setStatuses] = useState<IssueStatus[]>(
		DEFAULT_FILTERS.statuses
	);
	const [search, setSearchAction] = useState('');
	const [sortBy, setSortBy] = useState<{ field: SortField; order?: SortOrder }>(
		{
			field: 'createdAt',
			order: 'desc'
		}
	);

	const toggleTypeAction = (t: IssueType) =>
		setTypes(prev =>
			prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
		);

	const toggleStatusAction = (s: IssueStatus) =>
		setStatuses(prev =>
			prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
		);

	const resetFiltersAction = () => {
		setTypes(DEFAULT_FILTERS.types);
		setStatuses(DEFAULT_FILTERS.statuses);
		setSearchAction('');
		setSortBy({ field: 'createdAt', order: 'desc' });
	};

	const setSortAction = (field: SortField, order?: SortOrder) => {
		setSortBy({ field, order });
	};

	const {
		data: issues = initialIssues,
		isLoading,
		refetch
	} = useQuery({
		queryKey: ['issues', types, statuses],
		queryFn: () => fetchFilteredIssues(types, statuses),
		initialData: initialIssues
	});

	const filteredIssues = useMemo(() => {
		let filtered = issues;

		if (search.trim()) {
			const lower = search.toLowerCase();
			filtered = filtered.filter(
				i =>
					i.title.toLowerCase().includes(lower) ||
					i.description.toLowerCase().includes(lower)
			);
		}

		filtered.sort((a, b) => {
			const { field, order } = sortBy;

			if (field === 'upvotes') {
				return order === 'asc'
					? a.numberOfUpvotes - b.numberOfUpvotes
					: b.numberOfUpvotes - a.numberOfUpvotes;
			}

			if (field === 'createdAt') {
				return order === 'asc'
					? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					: new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			}

			return 0;
		});
		return filtered;
	}, [issues, search, sortBy]);

	return {
		types,
		statuses,
		search,
		setSearchAction,
		toggleTypeAction,
		toggleStatusAction,
		resetFiltersAction,
		filteredIssues,
		isLoading,
		refetch,
		sortBy,
		setSortAction
	};
};
