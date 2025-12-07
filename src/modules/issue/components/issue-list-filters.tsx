'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { FloatingAddButton } from '@/components/floating-add-button';
import { IssueList } from '@/modules/issue/components/issue-list';
import { fetchFilteredIssues } from '@/modules/issue/api/issuesClient';
import {
	DEFAULT_FILTERS,
	ISSUE_STATUS_LABELS,
	ISSUE_TYPE_COLORS,
	ISSUE_TYPE_LABELS
} from '@/lib/issue-utils';
import { FilterRow } from '@/components/filters/filter-row';
import { Button } from '@/components/button';
import { SearchFilter } from '@/components/filters/search-filter';

import { type Issue, IssueType, IssueStatus } from '../schema';

type Props = {
	initialIssues?: Issue[];
};

export const IssueListFilters = ({ initialIssues = [] }: Props) => {
	const [types, setTypes] = useState<IssueType[]>(DEFAULT_FILTERS.types);
	const [statuses, setStatuses] = useState<IssueStatus[]>(
		DEFAULT_FILTERS.statuses
	);
	const [search, setSearch] = useState('');

	const toggleType = (type: IssueType) => {
		setTypes(prev =>
			prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
		);
	};

	const toggleStatus = (status: IssueStatus) => {
		setStatuses(prev =>
			prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
		);
	};

	const resetFilters = () => {
		setTypes(DEFAULT_FILTERS.types);
		setStatuses(DEFAULT_FILTERS.statuses);
		setSearch('');
	};

	const { data: issues, isLoading } = useQuery<
		Issue[],
		Error,
		Issue[],
		[string, IssueType[], IssueStatus[]]
	>({
		queryKey: ['issues', types, statuses],
		queryFn: () => fetchFilteredIssues(types, statuses),
		initialData: initialIssues
	});

	const filteredIssues = useMemo(() => {
		if (!search.trim()) return issues;
		return issues.filter(
			issue =>
				issue.title.toLowerCase().includes(search.toLowerCase()) ||
				issue.description.toLowerCase().includes(search.toLowerCase())
		);
	}, [issues, search]);

	return (
		<div className="space-y-4">
			<FilterRow
				label="Issue Type"
				options={Object.values(IssueType)}
				selected={types}
				onToggleAction={toggleType}
				getOptionLabelAction={type => ISSUE_TYPE_LABELS[type]}
				getOptionColorAction={type => ISSUE_TYPE_COLORS[type]}
			/>

			<FilterRow
				label="Status"
				options={Object.values(IssueStatus)}
				selected={statuses}
				onToggleAction={toggleStatus}
				getOptionLabelAction={status => ISSUE_STATUS_LABELS[status]}
			/>

			<SearchFilter value={search} onChangeAction={setSearch} />

			<Button variant="outline" onClick={resetFilters}>
				Reset Filters
			</Button>

			{isLoading ? <p>Loading...</p> : <IssueList issues={filteredIssues} />}
			<FloatingAddButton />
		</div>
	);
};
