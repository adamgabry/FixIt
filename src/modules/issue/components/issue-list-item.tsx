'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Pencil } from 'lucide-react';

import {
	type Issue,
	type IssueStatus,
	type IssueType
} from '@/modules/issue/schema';
import { IssueStatusBadge } from '@/modules/issue/components/issue-status-badge';
import { IssueTypeBadge } from '@/modules/issue/components/issue-type-badge';
import { Button } from '@/components/buttons/button';
import { Card } from '@/components/card';
import { IssueUpvoteButton } from '@/modules/issue/components/issue-upvote-button';
import { hasStaffPermissions, useSession } from '@/modules/auth/client';

export const IssueListItem = ({
	issue,
	currentUserId
}: {
	issue: Issue;
	currentUserId: string | null;
}) => {
	const router = useRouter();
	const { data: session } = useSession();	
	const hasStaffPermissionsFlag = hasStaffPermissions(session?.user?.role);
	const isUsersIssue = currentUserId === issue.reporter.id;

	const handleEdit = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		router.push(`/issues/${issue.id}?edit=true`);
	};

	const isUpvoted = currentUserId
		? issue.upvoters.some(upvoter => upvoter.id === currentUserId)
		: false;

	return (
		<Card
			variant="elevated"
			hover="lift"
			padding="none"
			className="max-w-sm flex flex-col overflow-hidden"
		>
			<div className="p-4 flex justify-between items-start gap-4 flex-1">
				<Link
					href={`/issues/${issue.id}`}
					className="flex-1 flex flex-col gap-2"
				>
					<h3 className="text-2xl font-semibold line-clamp-2">{issue.title}</h3>
					<div className="flex gap-2 mt-1">
						<IssueStatusBadge status={issue.status as IssueStatus} />
						<IssueTypeBadge type={issue.type as IssueType} />
					</div>
				</Link>

				<div className="flex flex-col gap-1 items-end">
					<IssueUpvoteButton
						issueId={issue.id}
						reporterId={issue.reporter.id}
						currentUserId={currentUserId}
						initialUpvoteCount={issue.numberOfUpvotes}
						initialIsUpvoted={isUpvoted}
						variant="compact"
					/>

					{(hasStaffPermissionsFlag || isUsersIssue) && (
						<Button
						variant="secondary"
						size="sm"
						animation="scale"
						onClick={handleEdit}
						className="hidden md:flex"
					>
						<Pencil className="w-4 h-4" />
							Edit
						</Button>
					)}
				</div>
			</div>

			<Link href={`/issues/${issue.id}`} className="w-full h-48 relative">
				{issue.pictureUrls[0] ? (
					<Image
						className="object-cover"
						src={issue.pictureUrls[0]}
						alt={issue.title}
						fill
						unoptimized
					/>
				) : (
					<div className="bg-linear-to-br from-orange-100 via-amber-50 to-orange-100 w-full h-full flex items-center justify-center text-gray-400">
						No image
					</div>
				)}
			</Link>
		</Card>
	);
};
