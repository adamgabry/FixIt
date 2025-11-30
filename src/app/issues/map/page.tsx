"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { EditButton } from "@/components/edit-button";
import { DeleteButton } from "@/components/delete-button";
import { LatLng } from "leaflet";

const MapComponent = dynamic(() => import("@/components/map"), {
  ssr: false,
});

const IssuesMapPage = () => {
	const [state, setState] = useState("");

	return (
		<div className="flex h-screen w-full">
			{/* Left Section - Form Fields */}
			<div className="flex flex-col gap-4 p-6 w-1/2 overflow-y-auto">
				{/* Title */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">Title</label>
					<div className="px-3 py-2 rounded-md border border-input bg-background text-sm">
						Broken Traffic Light at Main St
					</div>
				</div>

				{/* State Selector */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">State</label>
					<select
						value={state}
						onChange={(e) => setState(e.target.value)}
						className={cn(
							"border-input bg-background ring-offset-background",
							"flex h-10 w-full rounded-md border px-3 py-2 text-sm",
							"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
							"focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
						)}
					>
						<option value="OPEN">Open</option>
						<option value="IN_PROGRESS">In Progress</option>
						<option value="CLOSED">Closed</option>
					</select>
				</div>

				{/* Type */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">Type</label>
					<div className="px-3 py-2 rounded-md border border-input bg-background text-sm">
						Traffic Light
					</div>
				</div>

				{/* Reported by */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">Reported by</label>
					<div className="px-3 py-2 rounded-md border border-input bg-background text-sm">
                        John Doe
                    </div>
				</div>

				{/* Description */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">Description</label>
					{/* <textarea
						placeholder="Enter description"
						className={cn(
							"border-input bg-background ring-offset-background",
							"flex min-h-[120px] w-full rounded-md border px-3 py-2 text-sm",
							"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
							"focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
							"resize-none"
						)}
					/> */}
                    <div className="px-3 py-2 rounded-md border border-input bg-background text-sm">
                        The traffic light is not working properly.
                    </div>
				</div>

				{/* Image Placeholders */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">Images</label>
					<div className="grid grid-cols-2 gap-2">
						<div className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
							<span className="text-xs text-gray-400">Image 1</span>
						</div>
						<div className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
							<span className="text-xs text-gray-400">Image 2</span>
						</div>
					</div>
					<div className="w-full border-2 border-dashed border-gray-300 rounded-md h-32 flex items-center justify-center bg-gray-50">
						<span className="text-xs text-gray-400">Image 3</span>
					</div>
				</div>
			</div>

			{/* Right Section - Map */}
			<div className="flex flex-col w-1/2">
				{/* Header/Toolbar */}
				<div className="border-b p-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<EditButton />
						<DeleteButton />
						<div className="w-8 h-8 bg-gray-300 rounded"></div>
						<span className="text-sm text-gray-500">xxx</span>
					</div>
				</div>

				{/* Location Name */}
				<div className="p-4 border-b">
					<span className="text-sm font-medium">Location name: xxx</span>
				</div>

				{/* Map Component */}
				<div className="flex-1 relative">
					<MapComponent 
						center={[48.1486, 17.1077]} // TODO: Get location from the backend
						zoom={20} 
						style={{ height: "80%", width: "100%" }} 
						initialMarkers={[new LatLng(48.1486, 17.1077)]} // TODO: Get markers from the backend
						canCreateMarker={false} 
					/>
				</div>
			</div>
		</div>
	);
};

export default IssuesMapPage;
