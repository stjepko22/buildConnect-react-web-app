import { Avatar, AvatarProps } from '@mui/material';
import { resolveProfileImageUrl } from '@/modules/user/utils/profileImages';

interface ProfileAvatarProps extends AvatarProps {
  displayName: string;
  imageUrl?: string | null;
}

export default function ProfileAvatar({ displayName, imageUrl, children, src, ...props }: ProfileAvatarProps) {
  const initials = displayName.trim().split(/\s+/).slice(0, 2)
    .map((part) => part.charAt(0)).join('').toLocaleUpperCase('hr');

  return (
    <Avatar {...props} src={src || resolveProfileImageUrl(imageUrl)} alt={`Profilna slika: ${displayName}`}>
      {children || initials}
    </Avatar>
  );
}
