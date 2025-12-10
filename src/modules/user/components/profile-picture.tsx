import Image from 'next/image';

type ProfilePictureProps = {
	imageUrl: string;
	name: string;
	size?: number;
};

const PROFILE_PICTURE_SIZE = 32;

export const ProfilePicture = ({
	imageUrl,
	name,
	size = PROFILE_PICTURE_SIZE
}: ProfilePictureProps) => (
	<Image
		src={imageUrl}
		alt={name}
		width={size}
		height={size}
		className="rounded-full"
	/>
);
