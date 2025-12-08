'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import {
	type Issue,
	type IssueStatus,
	type IssueType
} from '@/modules/issue/schema';
import { IssueStatusBadge } from '@/modules/issue/components/issue-status-badge';
import { IssueTypeBadge } from '@/modules/issue/components/issue-type-badge';
import { Button } from '@/components/button';

export const IssueListItem = ({ issue }: { issue: Issue }) => {
	const router = useRouter();

	const handleEdit = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		router.push(`/issues/${issue.id}?edit=true`);
	};

	const handleLike = (_e: React.MouseEvent) => {
		console.log('Like clicked', issue.id);
	};

	return (
		<li className="max-w-sm border m-5 flex flex-col relative">
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
					<Button
						variant="secondary"
						size="sm"
						onClick={handleLike}
						className="flex items-center gap-1"
					>
						{`Like ${issue.numberOfUpvotes}`}
					</Button>

					{/* TODO show only for admins and users who are creators of this + TODO redirect to issue edit/remove*/}
					<Button variant="outline" size="sm" onClick={handleEdit}>
						Edit
					</Button>
				</div>
			</div>

			<Link href={`/issues/${issue.id}`} className="w-full h-48 relative">
				{issue.pictureUrls[0] ? (
					<Image
						className="object-cover rounded-b-base"
						src={issue.pictureUrls[0]}
						alt="Here should be picture"
						fill
						unoptimized
					/>
				) : (
					<div className="bg-gray-300 w-full h-full rounded-b-base flex items-center justify-center">
						No image
					</div>
				)}
			</Link>
		</li>
	);
};
