'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, MapPin } from 'lucide-react';

import { geocode, type GeocodeResult } from '@/lib/geocoding';

type LocationSearchProps = {
	onResultSelect: (lat: number, lng: number) => void;
	className?: string;
};

export const LocationSearch = ({
	onResultSelect,
	className = ''
}: LocationSearchProps) => {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<GeocodeResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const resultsRef = useRef<HTMLDivElement>(null);

	// Debounced search
	useEffect(() => {
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		const trimmedQuery = query.trim();

		// Always use setTimeout to avoid synchronous setState in effect
		searchTimeoutRef.current = setTimeout(
			async () => {
				if (!trimmedQuery) {
					setResults([]);
					setShowResults(false);
					setIsSearching(false);
					return;
				}

				setIsSearching(true);
				const searchResults = await geocode(trimmedQuery, 5);
				setResults(searchResults);
				setShowResults(true);
				setIsSearching(false);
				setSelectedIndex(-1);
			},
			trimmedQuery ? 500 : 0
		); // 500ms debounce for non-empty queries

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, [query]);

	// Handle result selection
	const handleSelectResult = useCallback(
		(result: GeocodeResult) => {
			onResultSelect(result.lat, result.lng);
			setQuery(result.displayName);
			setShowResults(false);
			setResults([]);
			inputRef.current?.blur();
		},
		[onResultSelect]
	);

	// Handle keyboard navigation
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (!showResults || results.length === 0) return;

			if (e.key === 'ArrowDown') {
				e.preventDefault();
				setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
			} else if (e.key === 'Enter') {
				e.preventDefault();
				if (selectedIndex >= 0 && selectedIndex < results.length) {
					handleSelectResult(results[selectedIndex]);
				} else if (results.length > 0) {
					handleSelectResult(results[0]);
				}
			} else if (e.key === 'Escape') {
				setShowResults(false);
				inputRef.current?.blur();
			}
		},
		[showResults, results, selectedIndex, handleSelectResult]
	);

	// Clear search
	const handleClear = useCallback(() => {
		setQuery('');
		setResults([]);
		setShowResults(false);
		inputRef.current?.focus();
	}, []);

	// Close results when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				resultsRef.current &&
				!resultsRef.current.contains(event.target as Node) &&
				inputRef.current &&
				!inputRef.current.contains(event.target as Node)
			) {
				setShowResults(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className={`relative ${className}`}>
			{/* Search Input */}
			<div className="relative">
				<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
					<Search className="h-4 w-4" />
				</div>
				<input
					ref={inputRef}
					type="text"
					value={query}
					onChange={e => setQuery(e.target.value)}
					onKeyDown={handleKeyDown}
					onFocus={() => {
						if (results.length > 0) {
							setShowResults(true);
						}
					}}
					placeholder="Search for a location..."
					className="w-full pl-10 pr-10 py-2.5 border-2 border-orange-200 bg-white/80 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-200 text-sm"
				/>
				{query && (
					<button
						onClick={handleClear}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
						aria-label="Clear search"
					>
						<X className="h-4 w-4" />
					</button>
				)}
			</div>

			{/* Search Results */}
			{showResults && (
				<div
					ref={resultsRef}
					className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border-2 border-orange-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-[1001]"
				>
					{isSearching ? (
						<div className="p-4 text-center text-sm text-gray-500">
							Searching...
						</div>
					) : results.length > 0 ? (
						<ul className="py-1">
							{results.map((result, index) => (
								<li key={`${result.lat}-${result.lng}-${index}`}>
									<button
										type="button"
										onClick={() => handleSelectResult(result)}
										className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors flex items-start gap-3 ${
											selectedIndex === index ? 'bg-orange-50' : ''
										}`}
									>
										<MapPin className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
										<span className="text-sm text-gray-700 line-clamp-2">
											{result.displayName}
										</span>
									</button>
								</li>
							))}
						</ul>
					) : query.trim() ? (
						<div className="p-4 text-center text-sm text-gray-500">
							No results found
						</div>
					) : null}
				</div>
			)}
		</div>
	);
};
