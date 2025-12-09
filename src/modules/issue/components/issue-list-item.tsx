'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Heart, Pencil } from 'lucide-react';

import {
	type Issue,
	type IssueStatus,
	type IssueType
} from '@/modules/issue/schema';
import { IssueStatusBadge } from '@/modules/issue/components/issue-status-badge';
import { IssueTypeBadge } from '@/modules/issue/components/issue-type-badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';

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
					<Button
						variant="ghost"
						size="sm"
						animation="scale"
						onClick={handleLike}
						className="flex items-center gap-1"
					>
						<Heart className="w-4 h-4" />
						{issue.numberOfUpvotes}
					</Button>

					<Button
						variant="secondary"
						size="sm"
						animation="scale"
						onClick={handleEdit}
					>
						<Pencil className="w-4 h-4" />
						Edit
					</Button>
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
