import { IssueList } from '@/modules/issue/components/issue-list';
import { IssuesListClient } from './issues-list-client';

const IssuesListPage = () => (
	/*
	const [filters, setFilters] = useState<IssueFilters>(DEFAULT_FILTERS);

	const issues = MOCK_ISSUES as Issue[];
	const filteredIssues = useMemo(
		() => filterIssues(issues, filters),
		[issues, filters]
	);
	*/
	<div>
		{
			// <RowFilter filters={filters} onFiltersChangeAction={setFilters} />
		}
		<IssueList />
		<IssuesListClient />
	</div>
);
export default IssuesListPage;
