'use client';

import { ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { toggleUpvoteAction } from '@/modules/issueLike/actions';
import { cn } from '@/lib/cn';

interface IssueUpvoteButtonProps {
	issueId: number;
	reporterId: string;
	currentUserId: string | null;
	initialUpvoteCount: number;
	initialIsUpvoted: boolean;
	variant?: 'default' | 'compact';
}

export function IssueUpvoteButton({
	issueId,
	reporterId,
	currentUserId,
	initialUpvoteCount,
	initialIsUpvoted,
	variant = 'default'
}: IssueUpvoteButtonProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isUpvoted, setIsUpvoted] = useState(initialIsUpvoted);
	const [upvoteCount, setUpvoteCount] = useState(initialUpvoteCount);
	const [error, setError] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);

	// Check if the current user is the issue reporter
	const isOwnIssue = currentUserId === reporterId;
	const isDisabled = !currentUserId || isOwnIssue || isPending;

	const handleToggle = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (isDisabled) return;

		// Clear any existing error
		setError(null);

		// Optimistic update
		const previousUpvoted = isUpvoted;
		const previousCount = upvoteCount;
		const newIsUpvoted = !isUpvoted;
		const newCount = isUpvoted ? upvoteCount - 1 : upvoteCount + 1;
		
		setIsUpvoted(newIsUpvoted);
		setUpvoteCount(newCount);
		setIsPending(true);

		// Optimistically update React Query cache if available
		try {
			queryClient.setQueryData(['issues'], (oldData: any) => {
				if (!oldData) return oldData;
				return oldData.map((issue: any) =>
					issue.id === issueId
						? { 
							...issue, 
							numberOfUpvotes: newCount,
							upvoters: newIsUpvoted 
								? [...issue.upvoters, { id: currentUserId }]
								: issue.upvoters.filter((u: any) => u.id !== currentUserId)
						}
						: issue
				);
			});
		} catch {
			// QueryClient not available (detail page without React Query provider)
		}

		try {
			const result = await toggleUpvoteAction(issueId, currentUserId!);

			if (!result.success) {
				// Revert optimistic updates on error
				setIsUpvoted(previousUpvoted);
				setUpvoteCount(previousCount);
				setError(result.error || 'Failed to toggle upvote');
				
				// Revert cache if available
				try {
					queryClient.invalidateQueries({ queryKey: ['issues'] });
				} catch {
					// No cache to revert
				}
				
				setTimeout(() => setError(null), 3000);
			} else {
				// Sync with server state
				setIsUpvoted(result.isUpvoted);
				// Invalidate to ensure consistency
				try {
					queryClient.invalidateQueries({ queryKey: ['issues'] });
				} catch {
					// QueryClient not available
				}
				router.refresh();
			}
		} catch (err) {
			// Revert on error
			setIsUpvoted(previousUpvoted);
			setUpvoteCount(previousCount);
			setError('Something went wrong. Please try again.');
			
			try {
				queryClient.invalidateQueries({ queryKey: ['issues'] });
			} catch {
				// QueryClient not available
			}
			
			setTimeout(() => setError(null), 3000);
		} finally {
			setIsPending(false);
		}
	};

	const getAriaLabel = () => {
		if (isOwnIssue) {
			return "You can't upvote your own issue";
		}
		if (!currentUserId) {
			return 'Sign in to upvote';
		}
		if (isUpvoted) {
			return `Remove upvote (${upvoteCount} upvote${upvoteCount !== 1 ? 's' : ''})`;
		}
		return `Upvote issue (${upvoteCount} upvote${upvoteCount !== 1 ? 's' : ''})`;
	};

	const isCompact = variant === 'compact';

	return (
		<div className="relative flex flex-col items-end">
			<button
				onClick={handleToggle}
				disabled={isDisabled}
				aria-pressed={isUpvoted}
				aria-label={getAriaLabel()}
				aria-busy={isPending}
				aria-disabled={isDisabled}
				title={isOwnIssue ? "You can't upvote your own issue" : undefined}
				className={cn(
					'inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-all duration-200',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
					isCompact ? 'p-2 min-h-11 min-w-11' : 'px-3 py-2 min-h-11',
					!isDisabled && 'hover:bg-orange-50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer',
					isUpvoted && !isDisabled && 'text-orange-500',
					!isUpvoted && !isDisabled && 'text-gray-600',
					isDisabled && 'opacity-40 cursor-not-allowed',
					isPending && 'cursor-wait opacity-60',
					error && 'animate-shake'
				)}
			>
				<ThumbsUp
					className={cn(
						'transition-all duration-200',
						isCompact ? 'w-5 h-5 md:w-4 md:h-4' : 'w-4 h-4',
						isUpvoted && 'fill-current'
					)}
				/>
				<span className={cn('font-medium', isCompact && 'text-xs md:text-sm')}>
					{upvoteCount}
				</span>
			</button>

			{error && (
				<div
					role="alert"
					className="absolute top-full mt-1 right-0 z-10 px-3 py-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md shadow-lg whitespace-nowrap animate-fade-in"
				>
					{error}
				</div>
			)}
		</div>
	);
}
