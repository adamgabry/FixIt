import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/cn';

type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
	label: string;
	name: string;
	options: Array<{ value: string; label: string }>;
};

export const FormSelect = ({
	name,
	label,
	options,
	...selectProps
}: FormSelectProps) => {
	const {
		register,
		formState: { errors }
	} = useFormContext();

	return (
		<label htmlFor={name} className="block">
			<div className="block text-sm font-semibold mb-2 text-gray-700">
				{label}
			</div>

			<select
				{...selectProps}
				{...register(name)}
				id={name}
				className={cn(
					errors[name] && 'border-red-600',
					'w-full border-2 border-orange-200 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-200',
					selectProps.className
				)}
			>
				{options.map(option => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>

			{errors[name] && (
				<span className="mt-1 text-sm text-red-600">
					{errors[name]?.message?.toString()}
				</span>
			)}
		</label>
	);
};

