const Loading = () => (
	<>
		<div className="fixed inset-0 bg-linear-to-br from-orange-50 via-amber-50 to-orange-50 -z-10" />
		<div className="relative min-h-screen z-10">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6">
				<div className="mb-6">
					<div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md border border-orange-200/50 p-4 sm:p-6 animate-pulse">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
							<div className="flex-1 w-full space-y-3">
								<div className="h-8 sm:h-10 w-3/4 bg-orange-100 rounded-lg" />
								<div className="flex flex-wrap items-center gap-3">
									<div className="h-4 w-28 bg-orange-100 rounded" />
									<span className="text-gray-300">•</span>
									<div className="h-4 w-48 bg-orange-100 rounded" />
								</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-10 w-24 bg-orange-100 rounded-lg" />
								<div className="h-10 w-24 bg-orange-100 rounded-lg" />
							</div>
						</div>
						<div className="mt-4 h-9 w-28 bg-orange-100 rounded-full" />
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="order-1 lg:order-1">
						<div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md border border-orange-200/50 overflow-hidden">
							<div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] animate-pulse">
								<div className="absolute inset-0 bg-linear-to-br from-orange-100 to-amber-100" />
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="h-12 w-12 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
								</div>
							</div>
						</div>
					</div>

					<div className="order-2 lg:order-2">
						<div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md border border-orange-200/50 p-4 sm:p-6 space-y-6 animate-pulse">
							<div className="space-y-2">
								<div className="h-4 w-20 bg-orange-100 rounded" />
								<div className="h-10 w-full bg-orange-100 rounded-lg" />
							</div>

							<div className="space-y-2">
								<div className="h-4 w-16 bg-orange-100 rounded" />
								<div className="h-10 w-full bg-orange-100 rounded-lg" />
							</div>

							<div className="space-y-2">
								<div className="h-4 w-24 bg-orange-100 rounded" />
								<div className="h-28 w-full bg-orange-100 rounded-lg" />
							</div>

							<div className="space-y-3">
								<div className="h-4 w-16 bg-orange-100 rounded" />
								<div className="flex gap-3">
									<div className="h-24 w-28 bg-orange-100 rounded-lg" />
									<div className="h-24 w-28 bg-orange-100 rounded-lg" />
									<div className="h-24 w-28 bg-orange-100 rounded-lg" />
								</div>
							</div>

							<div className="flex gap-3 pt-4 border-t border-orange-200/50">
								<div className="h-12 flex-1 bg-orange-100 rounded-lg" />
								<div className="h-12 flex-1 bg-orange-100 rounded-lg" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</>
);

export default Loading;
