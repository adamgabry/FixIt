import { IssueType, IssueStatus, type Issue } from '@/modules/issue/schema';

/**
 * Color mapping for issue types
 */
export const ISSUE_TYPE_COLORS: Record<IssueType, string> = {
	[IssueType.HOOLIGANISM]: '#ef4444', // red - vandalism/hooliganism
	[IssueType.IMPROVEMENT_IDEA]: '#22c55e', // green - ideas for improvement
	[IssueType.NATURE_PROBLEM]: '#10b981', // emerald - nature/environment issues
	[IssueType.BROKEN]: '#f59e0b', // amber - broken infrastructure
	[IssueType.ROAD]: '#6366f1' // indigo - road issues
};

/**
 * Human-readable labels for issue types
 */
export const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
	[IssueType.HOOLIGANISM]: 'Hooliganism',
	[IssueType.IMPROVEMENT_IDEA]: 'Improvement Idea',
	[IssueType.NATURE_PROBLEM]: 'Nature Problem',
	[IssueType.BROKEN]: 'Broken',
	[IssueType.ROAD]: 'Road Issue'
};

/**
 * Human-readable labels for issue statuses
 */
export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
	[IssueStatus.OPEN]: 'Open',
	[IssueStatus.IN_PROGRESS]: 'In Progress',
	[IssueStatus.CLOSED]: 'Closed'
};

/**
 * Filter options for the sidebar
 */
export type IssueFilters = {
	types: IssueType[];
	statuses: IssueStatus[];
	searchQuery: string;
};

/**
 * Default filter state (all options selected)
 */
export const DEFAULT_FILTERS: IssueFilters = {
	types: Object.values(IssueType),
	statuses: Object.values(IssueStatus),
	searchQuery: ''
};

/**
 * Filter issues based on the provided filters
 */
export const filterIssues = (issues: Issue[], filters: IssueFilters): Issue[] =>
	issues.filter(issue => {
		// Filter by type
		if (!filters.types.includes(issue.type as IssueType)) {
			return false;
		}

		// Filter by status
		if (!filters.statuses.includes(issue.status as IssueStatus)) {
			return false;
		}

		// Filter by search query (title or description)
		if (filters.searchQuery) {
			const query = filters.searchQuery.toLowerCase();
			const matchesTitle = issue.title.toLowerCase().includes(query);
			const matchesDescription = issue.description
				.toLowerCase()
				.includes(query);
			if (!matchesTitle && !matchesDescription) {
				return false;
			}
		}

		return true;
	});

/**
 * Create a colored SVG marker icon for Leaflet
 */
export const createColoredMarkerSvg = (color: string): string => {
	const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path fill="${color}" stroke="#333" stroke-width="1" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z"/>
      <circle fill="white" cx="12" cy="12" r="5"/>
    </svg>
  `;
	return `data:image/svg+xml;base64,${btoa(svg)}`;
};
