import Image from 'next/image';

type ProfilePictureProps = {
	imageUrl: string;
	name: string;
	size?: number;
};

export const ProfilePicture = ({
	imageUrl,
	name,
	size = 32
}: ProfilePictureProps) => (
	<Image
		src={imageUrl}
		alt={name}
		width={size}
		height={size}
		className="rounded-full"
	/>
);
