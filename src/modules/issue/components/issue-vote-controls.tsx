'use client';

import { useState, useTransition } from 'react';
import { toggleVoteAction } from '@/modules/issueLike/actions';

type IssueVoteControlsProps = {
	issueId: number;
	reporterId: number;
	currentUserId: number | null;
	initialVoteValue: number;
	initialScore: number;
	readonly?: boolean;
};

export const IssueVoteControls = ({
	issueId,
	reporterId,
	currentUserId,
	initialVoteValue,
	initialScore,
	readonly = false
}: IssueVoteControlsProps) => {
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
		<div className="flex items-center gap-3">
			<button
				onClick={() => handleVote(1)}
				disabled={isDisabled}
				aria-label="Like this issue"
				title={isOwnIssue ? "You can't vote on your own issue" : 'Like'}
				className={`group relative p-3 rounded-xl transition-all duration-300 ${
					isDisabled
						? 'opacity-40 cursor-not-allowed'
						: 'hover:scale-110 hover:shadow-lg active:scale-95'
				} ${
					voteValue === 1
						? 'bg-gradient-to-br from-green-50 to-emerald-50 shadow-md scale-105'
						: 'bg-gray-50 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50'
				}`}
			>
				<span
					className={`text-2xl transition-all duration-300 ${
						voteValue === 1
							? 'scale-110 animate-pulse'
							: 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'
					}`}
				>
					👍
				</span>
				{voteValue === 1 && (
					<span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
				)}
			</button>

			<div className="flex flex-col items-center">
				<span
					className={`text-2xl font-bold transition-all duration-300 ${
						score > 0
							? 'text-green-600'
							: score < 0
								? 'text-red-600'
								: 'text-gray-600'
					}`}
				>
					{score > 0 ? '+' : ''}
					{score}
				</span>
				<span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
					score
				</span>
			</div>

			<button
				onClick={() => handleVote(-1)}
				disabled={isDisabled}
				aria-label="Dislike this issue"
				title={isOwnIssue ? "You can't vote on your own issue" : 'Dislike'}
				className={`group relative p-3 rounded-xl transition-all duration-300 ${
					isDisabled
						? 'opacity-40 cursor-not-allowed'
						: 'hover:scale-110 hover:shadow-lg active:scale-95'
				} ${
					voteValue === -1
						? 'bg-gradient-to-br from-red-50 to-rose-50 shadow-md scale-105'
						: 'bg-gray-50 hover:bg-gradient-to-br hover:from-red-50 hover:to-rose-50'
				}`}
			>
				<span
					className={`text-2xl transition-all duration-300 ${
						voteValue === -1
							? 'scale-110 animate-pulse'
							: 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'
					}`}
				>
					👎
				</span>
				{voteValue === -1 && (
					<span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
				)}
			</button>
		</div>
	);
};
