'use client';

import React from 'react';

import { IssueType, IssueStatus } from '@/modules/issue/schema';
import { type IssueFilters } from '@/lib/issue-utils';
import { Button } from '@/components/button';
import { SearchFilter } from '@/components/filters/search-filter';
import { StatusFilterRow } from '@/components/filters/status-filter-row';
import { TypeFilterRow } from '@/components/filters/type-filter-row';

type RowFilterProps = {
	filters: IssueFilters;
	onFiltersChangeAction: (filters: IssueFilters) => void; // renamed
};

export const RowFilter = ({
	filters,
	onFiltersChangeAction
}: RowFilterProps) => {
	const toggleType = (type: IssueType) => {
		const newTypes = filters.types.includes(type)
			? filters.types.filter(t => t !== type)
			: [...filters.types, type];
		onFiltersChangeAction({ ...filters, types: newTypes });
	};

	const toggleStatus = (status: IssueStatus) => {
		const newStatuses = filters.statuses.includes(status)
			? filters.statuses.filter(s => s !== status)
			: [...filters.statuses, status];
		onFiltersChangeAction({ ...filters, statuses: newStatuses });
	};

	const resetFilters = () => {
		onFiltersChangeAction({
			types: Object.values(IssueType),
			statuses: Object.values(IssueStatus),
			searchQuery: ''
		});
	};

	return (
		<div className="flex-1 overflow-y-auto p-4 space-y-6">
			<SearchFilter
				value={filters.searchQuery}
				onChangeAction={value =>
					onFiltersChangeAction({ ...filters, searchQuery: value })
				}
			/>
			<TypeFilterRow types={filters.types} onToggleAction={toggleType} />
			<StatusFilterRow
				statuses={filters.statuses}
				onToggleAction={toggleStatus}
			/>

			<Button variant="outline" onClick={resetFilters}>
				Reset Filters
			</Button>
		</div>
	);
};
