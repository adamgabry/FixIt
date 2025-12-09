'use client';

import { RotateCcw, Filter } from 'lucide-react';

import {
	ISSUE_TYPE_LABELS,
	ISSUE_TYPE_COLORS,
	ISSUE_STATUS_LABELS
} from '@/lib/issue-utils';
import { FilterRow } from '@/components/filters/filter-row';
import { SearchFilter } from '@/components/filters/search-filter';
import { Button } from '@/components/button';
import { IssueType, IssueStatus } from '@/modules/issue/schema';
import { Card } from '@/components/card';

type IssueFiltersProps = {
	types: IssueType[];
	statuses: IssueStatus[];
	search: string;

	toggleTypeAction: (t: IssueType) => void;
	toggleStatusAction: (s: IssueStatus) => void;

	setSearchAction: (value: string) => void;
	resetFiltersAction: () => void;
};

export const IssueFilters = ({
	types,
	statuses,
	search,
	toggleTypeAction,
	toggleStatusAction,
	setSearchAction,
	resetFiltersAction
}: IssueFiltersProps) => {
	const hasActiveFilters =
		types.length < Object.values(IssueType).length ||
		statuses.length < Object.values(IssueStatus).length ||
		search.trim().length > 0;

	return (
		<Card variant="elevated" className="mb-6">
			<div className="flex items-center justify-between mb-4 pb-3 border-b border-orange-200/50">
				<div className="flex items-center gap-2">
					<Filter className="w-5 h-5 text-orange-600" />
					<h2 className="text-lg font-semibold text-gray-900">Filters</h2>
					{hasActiveFilters && (
						<span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
							Active
						</span>
					)}
				</div>
				<Button
					variant="ghost"
					size="sm"
					animation="scale"
					onClick={resetFiltersAction}
					disabled={!hasActiveFilters}
					className="text-gray-600 hover:text-orange-600"
				>
					<RotateCcw className="w-4 h-4" />
					Reset
				</Button>
			</div>

			<div className="space-y-6">
				<FilterRow
					label="Issue Type"
					options={Object.values(IssueType)}
					selected={types}
					onToggleAction={toggleTypeAction}
					getOptionLabelAction={t => ISSUE_TYPE_LABELS[t]}
					getOptionColorAction={t => ISSUE_TYPE_COLORS[t]}
				/>

				<FilterRow
					label="Status"
					options={Object.values(IssueStatus)}
					selected={statuses}
					onToggleAction={toggleStatusAction}
					getOptionLabelAction={s => ISSUE_STATUS_LABELS[s]}
				/>

				<SearchFilter value={search} onChangeAction={setSearchAction} />
			</div>
		</Card>
	);
};
