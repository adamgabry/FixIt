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

export const useIssueFilters = (initialIssues: Issue[]) => {
	const [types, setTypes] = useState<IssueType[]>(DEFAULT_FILTERS.types);
	const [statuses, setStatuses] = useState<IssueStatus[]>(
		DEFAULT_FILTERS.statuses
	);
	const [search, setSearchAction] = useState('');

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
		if (!search.trim()) return issues;
		return issues.filter(
			i =>
				i.title.toLowerCase().includes(search.toLowerCase()) ||
				i.description.toLowerCase().includes(search.toLowerCase())
		);
	}, [issues, search]);

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
		refetch
	};
};
