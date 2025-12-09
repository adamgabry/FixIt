'use client';

import Link from 'next/link';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

import { Card } from '@/components/card';
import { Button } from '@/components/buttons/button';

const ForbiddenPage = () => (
	<div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-orange-50/30 via-amber-50/20 to-orange-50/30">
		<Card variant="elevated" className="max-w-2xl w-full text-center">
			<div className="flex flex-col items-center space-y-6">
				{/* Icon */}
				<div className="relative">
					<div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full" />
					<div className="relative bg-linear-to-br from-orange-500 to-amber-500 p-6 rounded-2xl shadow-lg">
						<ShieldAlert className="w-16 h-16 text-white" strokeWidth={2.5} />
					</div>
				</div>

				{/* Heading */}
				<div className="space-y-2">
					<h1 className="text-4xl font-bold text-gray-900">Access Denied</h1>
					<p className="text-lg text-gray-600">
						Oops! You don't have permission to view this page
					</p>
				</div>

				{/* Description */}
				<div className="max-w-md space-y-3 text-gray-600">
					<p>
						This area is restricted to authorized users only. If you believe you
						should have access, please contact your administrator.
					</p>
					<div className="pt-2 text-sm text-gray-500">
						<p className="font-medium">Common reasons:</p>
						<ul className="mt-2 space-y-1 text-left list-disc list-inside">
							<li>Insufficient permissions for your role</li>
							<li>Your session may have expired</li>
							<li>This feature requires additional privileges</li>
						</ul>
					</div>
				</div>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-3 pt-4 w-full sm:w-auto">
					<Link href="/issues/list">
						<Button variant="default" animation="lift" className="w-full sm:w-auto">
							<Home className="w-4 h-4" />
							Go to Home
						</Button>
					</Link>
					<Button
						variant="outline"
						animation="scale"
						onClick={() => window.history.back()}
						className="w-full sm:w-auto"
					>
						<ArrowLeft className="w-4 h-4" />
						Go Back
					</Button>
				</div>
			</div>
		</Card>
	</div>
);

export default ForbiddenPage;