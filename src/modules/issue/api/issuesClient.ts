import { type Issue, type IssueType, type IssueStatus } from '../schema';

export const fetchFilteredIssues = async (
	types: IssueType[],
	statuses: IssueStatus[]
): Promise<Issue[]> => {
	const params = new URLSearchParams();
	if (types.length) params.append('types', types.join(','));
	if (statuses.length) params.append('statuses', statuses.join(','));

	const res = await fetch(`/api/issues?${params.toString()}`);
	if (!res.ok) throw new Error('Failed to fetch issues');
	return res.json();
};
