'use client';

import {
	ISSUE_TYPE_LABELS,
	ISSUE_TYPE_COLORS,
	ISSUE_STATUS_LABELS
} from '@/lib/issue-utils';
import { FilterRow } from '@/components/filters/filter-row';
import { SearchFilter } from '@/components/filters/search-filter';
import { Button } from '@/components/button';
import { IssueType, IssueStatus } from '@/modules/issue/schema';

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
}: IssueFiltersProps) => (
	<div className="space-y-4">
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

		<Button variant="outline" onClick={resetFiltersAction}>
			Reset Filters
		</Button>
	</div>
);
