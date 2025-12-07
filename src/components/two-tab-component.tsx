'use client';

import React, { useState } from 'react';

type TwoTabComponentProps = {
	tab1Label: string;
	tab2Label: string;
	tab1Content: React.ReactNode;
	tab2Content: React.ReactNode;
};

export const TwoTabComponent = ({
	tab1Label,
	tab2Label,
	tab1Content,
	tab2Content
}: TwoTabComponentProps) => {
	const [activeTab, setActiveTab] = useState('tab1');

	return (
		<div className="w-full mt-4">
			<div className="flex border-b mb-4">
				<button
					className={`flex-1 p-2 text-center ${
						activeTab === 'tab1'
							? 'border-b-2 border-black font-semibold'
							: 'text-gray-500'
					}`}
					onClick={() => setActiveTab('tab1')}
				>
					{tab1Label}
				</button>
				<button
					className={`flex-1 text-center ${
						activeTab === 'tab2'
							? 'border-b-2 border-black font-semibold'
							: 'text-gray-500'
					}`}
					onClick={() => setActiveTab('tab2')}
				>
					{tab2Label}
				</button>
			</div>

			{activeTab === 'tab1' && <div>{tab1Content}</div>}

			{activeTab === 'tab2' && <div>{tab2Content}</div>}
		</div>
	);
};
