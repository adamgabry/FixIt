'use client';
// TODO rework + move
import React, { useState } from 'react';

import { IssueType, IssueStatus } from '@/modules/issue/schema';
import {
	ISSUE_TYPE_LABELS,
	ISSUE_STATUS_LABELS,
	ISSUE_TYPE_COLORS,
	type IssueFilters
} from '@/lib/issue-utils';
import { Button } from '@/components/button';
import { cn } from '@/lib/cn';
import { SearchFilter } from '@/components/filters/search-filter';

type SidebarFilterProps = {
	filters: IssueFilters;
	onFiltersChangeAction: (filters: IssueFilters) => void;
	issueCount: number;
	filteredCount: number;
};

export const SidebarFilter = ({
	filters,
	onFiltersChangeAction,
	issueCount,
	filteredCount
}: SidebarFilterProps) => {
	const [isCollapsed, setIsCollapsed] = useState(false);

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
		<div
			className={cn(
				'bg-gray-900 border-r border-gray-700 transition-all duration-300 flex flex-col',
				isCollapsed ? 'w-12' : 'w-72'
			)}
		>
			{/* Header with collapse toggle */}
			<div className="p-3 border-b border-gray-700 flex items-center justify-between">
				{!isCollapsed && (
					<h2 className="text-lg font-semibold text-white">Filters</h2>
				)}
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="text-gray-400 hover:text-white"
					aria-label={isCollapsed ? 'Expand filters' : 'Collapse filters'}
				>
					{isCollapsed ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="9 18 15 12 9 6" />
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="15 18 9 12 15 6" />
						</svg>
					)}
				</Button>
			</div>

			{!isCollapsed && (
				<div className="flex-1 overflow-y-auto p-4 space-y-6">
					{/* Issue count */}
					<div className="text-sm text-gray-400">
						Showing {filteredCount} of {issueCount} issues
					</div>

					{/* Search */}
					<SearchFilter
						value={filters.searchQuery}
						onChangeAction={value =>
							onFiltersChangeAction({ ...filters, searchQuery: value })
						}
					/>

					{/* Type filter */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-300">
							Issue Type
						</label>
						<div className="space-y-1">
							{Object.values(IssueType).map(type => (
								<button
									key={type}
									onClick={() => toggleType(type)}
									className={cn(
										'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
										filters.types.includes(type)
											? 'bg-gray-700 text-white'
											: 'text-gray-400 hover:bg-gray-800'
									)}
								>
									<span
										className="w-3 h-3 rounded-full"
										style={{
											backgroundColor: ISSUE_TYPE_COLORS[type]
										}}
									/>
									<span>{ISSUE_TYPE_LABELS[type]}</span>
									{filters.types.includes(type) && (
										<svg
											className="ml-auto w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									)}
								</button>
							))}
						</div>
					</div>

					{/* Status filter */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-300">Status</label>
						<div className="space-y-1">
							{Object.values(IssueStatus).map(status => (
								<button
									key={status}
									onClick={() => toggleStatus(status)}
									className={cn(
										'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
										filters.statuses.includes(status)
											? 'bg-gray-700 text-white'
											: 'text-gray-400 hover:bg-gray-800'
									)}
								>
									<span>{ISSUE_STATUS_LABELS[status]}</span>
									{filters.statuses.includes(status) && (
										<svg
											className="ml-auto w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									)}
								</button>
							))}
						</div>
					</div>

					{/* Reset button */}
					<Button
						variant="outline"
						className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
						onClick={resetFilters}
					>
						Reset Filters
					</Button>
				</div>
			)}
		</div>
	);
};
