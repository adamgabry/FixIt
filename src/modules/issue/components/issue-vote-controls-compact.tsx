'use client';

import { useState, useTransition } from 'react';
import { toggleVoteAction } from '@/modules/issueLike/actions';

type IssueVoteControlsCompactProps = {
	issueId: number;
	reporterId: number;
	currentUserId: number | null;
	initialVoteValue: number;
	initialScore: number;
	readonly?: boolean;
};

export const IssueVoteControlsCompact = ({
	issueId,
	reporterId,
	currentUserId,
	initialVoteValue,
	initialScore,
	readonly = false
}: IssueVoteControlsCompactProps) => {
	const [voteValue, setVoteValue] = useState(initialVoteValue);
	const [score, setScore] = useState(initialScore);
	const [isPending, startTransition] = useTransition();

	const isOwnIssue = currentUserId === reporterId;
	const isDisabled = readonly || !currentUserId || isOwnIssue || isPending;

	const handleVote = async (targetValue: 1 | -1) => {
		if (isDisabled) return;

		// Optimistic update logic
		const oldVoteValue = voteValue;
		const oldScore = score;

		let newVoteValue = 0;
		let scoreDelta = 0;

		if (voteValue === targetValue) {
			// Clicking same vote: remove it
			newVoteValue = 0;
			scoreDelta = -targetValue;
		} else if (voteValue === 0) {
			// No vote yet: add new vote
			newVoteValue = targetValue;
			scoreDelta = targetValue;
		} else {
			// Switching vote: change by 2
			newVoteValue = targetValue;
			scoreDelta = targetValue * 2;
		}

		// Apply optimistic update
		setVoteValue(newVoteValue);
		setScore(score + scoreDelta);

		startTransition(async () => {
			try {
				const result = await toggleVoteAction(
					currentUserId!,
					issueId,
					targetValue === 1 ? 'upvote' : 'downvote',
					reporterId
				);

				// Update with server response
				setVoteValue(result.voteValue);
				setScore(result.score);
			} catch (error) {
				// Rollback on error
				console.error('Vote failed:', error);
				setVoteValue(oldVoteValue);
				setScore(oldScore);
			}
		});
	};

	return (
		<div className="inline-flex items-center gap-1.5 bg-white rounded-full px-2 py-1 shadow-sm border border-gray-100">
			<button
				onClick={() => handleVote(1)}
				disabled={isDisabled}
				aria-label="Like"
				title={isOwnIssue ? "Can't vote on your own issue" : 'Like'}
				className={`relative p-1.5 rounded-full transition-all duration-200 ${
					isDisabled
						? 'opacity-40 cursor-not-allowed'
						: 'hover:scale-110 active:scale-95'
				} ${
					voteValue === 1
						? 'bg-green-50 scale-105'
						: 'hover:bg-green-50/50'
				}`}
			>
				<span
					className={`text-base transition-all duration-200 ${
						voteValue === 1
							? 'scale-110'
							: 'grayscale opacity-60'
					}`}
				>
					👍
				</span>
			</button>

			<span
				className={`min-w-[2ch] text-center text-sm font-bold transition-colors duration-200 ${
					score > 0
						? 'text-green-600'
						: score < 0
							? 'text-red-600'
							: 'text-gray-500'
				}`}
			>
				{score > 0 ? '+' : ''}
				{score}
			</span>

			<button
				onClick={() => handleVote(-1)}
				disabled={isDisabled}
				aria-label="Dislike"
				title={isOwnIssue ? "Can't vote on your own issue" : 'Dislike'}
				className={`relative p-1.5 rounded-full transition-all duration-200 ${
					isDisabled
						? 'opacity-40 cursor-not-allowed'
						: 'hover:scale-110 active:scale-95'
				} ${
					voteValue === -1
						? 'bg-red-50 scale-105'
						: 'hover:bg-red-50/50'
				}`}
			>
				<span
					className={`text-base transition-all duration-200 ${
						voteValue === -1
							? 'scale-110'
							: 'grayscale opacity-60'
					}`}
				>
					👎
				</span>
			</button>
		</div>
	);
};
