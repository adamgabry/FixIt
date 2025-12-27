import { useFormContext } from 'react-hook-form';

import { Input, type InputProps } from '@/components/input';
import { cn } from '@/lib/cn';

type FormInputProps = InputProps & {
	label: string;
	name: string;
};

export const FormInput = ({ name, label, ...inputProps }: FormInputProps) => {
	const {
		register,
		formState: { errors }
	} = useFormContext();

	return (
		<label htmlFor={name} className="block">
			<div className="block text-sm font-semibold mb-2 text-gray-700">
				{label}
			</div>

			<Input
				{...inputProps}
				{...register(name, {
					valueAsNumber: inputProps.type === 'number'
				})}
				id={name}
				className={cn(
					errors[name] && 'border-red-600',
					'w-full border-2 border-orange-200 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-200',
					inputProps.className
				)}
			/>

			{errors[name] && (
				<span className="mt-1 text-sm text-red-600">
					{errors[name]?.message?.toString()}
				</span>
			)}
		</label>
	);
};

