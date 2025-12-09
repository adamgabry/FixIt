'use client';

import { useState } from 'react';
import { RotateCcw, Filter, ChevronDown, ChevronUp } from 'lucide-react';

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
	// Collapsed by default on mobile, always expanded on desktop
	const [isExpanded, setIsExpanded] = useState(false);

	const hasActiveFilters =
		types.length < Object.values(IssueType).length ||
		statuses.length < Object.values(IssueStatus).length ||
		search.trim().length > 0;

	const toggleExpanded = () => setIsExpanded(!isExpanded);

	return (
		<Card variant="elevated" className="mb-6 w-full">
			<div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-orange-200/50">
				<button
					onClick={toggleExpanded}
					className="flex items-center gap-1.5 md:gap-2 md:cursor-default flex-1 min-w-0"
					type="button"
				>
					<Filter className="w-4 h-4 md:w-5 md:h-5 text-orange-600 shrink-0" />
					<h2 className="text-base md:text-lg font-semibold text-gray-900 whitespace-nowrap">Filters</h2>
					{hasActiveFilters && (
						<span className="px-1.5 md:px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full whitespace-nowrap shrink-0">
							Active
						</span>
					)}
					{/* Mobile toggle icon */}
					<span className="md:hidden ml-auto text-gray-600 shrink-0">
						{isExpanded ? (
							<ChevronUp className="w-5 h-5" />
						) : (
							<ChevronDown className="w-5 h-5" />
						)}
					</span>
				</button>
				<Button
					variant="ghost"
					size="sm"
					animation="scale"
					onClick={resetFiltersAction}
					disabled={!hasActiveFilters}
					className="text-gray-600 hover:text-orange-600 shrink-0 px-2! md:px-3!"
				>
					<RotateCcw className="w-4 h-4" />
					<span className="hidden md:inline ml-1">Reset</span>
				</Button>
			</div>

			{/* Mobile: collapsible, Desktop: always visible */}
			<div
				className={`
					md:block
					${isExpanded ? 'block' : 'hidden'}
				`}
			>
				<div className="space-y-6 mt-4">
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
			</div>
		</Card>
	);
};
