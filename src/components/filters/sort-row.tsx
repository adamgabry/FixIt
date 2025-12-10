import { cn } from '@/lib/cn';
import { type SortField, type SortOrder } from '@/hooks/useIssueFilters';
import { Button } from '@/components/buttons/button';

type SortRowProps = {
	currentSort: { field: SortField; order?: SortOrder };
	setSort: (field: SortField, order?: SortOrder) => void;
};

const SORT_OPTIONS: {
	label: string;
	field: SortField;
	order?: SortOrder;
}[] = [
	{ label: 'Newest', field: 'createdAt', order: 'desc' },
	{ label: 'Oldest', field: 'createdAt', order: 'asc' },
	{ label: 'Most Upvotes', field: 'upvotes', order: 'desc' },
	{ label: 'Least Upvotes', field: 'upvotes', order: 'asc' }
];

export const SortRow = ({ currentSort, setSort }: SortRowProps) => (
	<div className="space-y-3">
		<label className="text-sm font-semibold text-gray-700">Sort By</label>
		<div className="flex flex-wrap gap-2">
			{SORT_OPTIONS.map(option => {
				const isSelected =
					currentSort.field === option.field &&
					(currentSort.order ?? 'none') === (option.order ?? 'none');

				return (
					<Button
						key={option.label}
						onClick={() => setSort(option.field, option.order)}
						className={cn(
							'group relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
							'border-2 backdrop-blur-sm active:scale-95',
							isSelected
								? 'bg-orange-50 text-orange-900 border-orange-400 shadow-sm hover:shadow-md hover:bg-orange-100'
								: 'bg-white/80 text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-900'
						)}
					>
						<span>{option.label}</span>
					</Button>
				);
			})}
		</div>
	</div>
);
