import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import { IUserProfile } from '@/modules/user/models/IUserProfile';
import ProfileAvatar from '@/modules/user/components/ProfileAvatar';
import ProfileCoverImage from '@/modules/user/components/ProfileCoverImage';
import { resolveProfileImageUrl } from '@/modules/user/utils/profileImages';

interface ProfileHeaderProps {
  user: IUserProfile;
  isOwnProfile: boolean;
}

export default function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  const editorState = { returnTo: `/profil/${user.id}`, returnLabel: 'Povratak na profil' };

  return (
    <Paper component="section" aria-label="Zaglavlje profila" variant="outlined" sx={{ borderRadius: { xs: 3, md: 4 }, mb: { xs: 2.5, md: 3.2 }, overflow: 'hidden' }}>
      <Box sx={{ position: 'relative' }}>
        <ProfileCoverImage src={resolveProfileImageUrl(user.coverImageUrl)} alt={`Naslovna fotografija: ${user.displayName}`} />
        {isOwnProfile && (
          <Button component={RouterLink} to="/profil/uredi#fotografije" state={editorState}
            variant="contained" size="small" startIcon={<PhotoCameraOutlinedIcon />}
            sx={{ position: 'absolute', top: { xs: 12, sm: 16 }, right: { xs: 12, sm: 20 }, boxShadow: 2 }}>
            Uredi fotografije
          </Button>
        )}
      </Box>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: { xs: 2.5, md: 3.5 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'flex-end' }} spacing={2} useFlexGap>
          <ProfileAvatar displayName={user.displayName} imageUrl={user.profileImageUrl}
            sx={{ width: { xs: 104, md: 128 }, height: { xs: 104, md: 128 }, mt: { xs: -6, md: -7.5 }, position: 'relative', border: '4px solid', borderColor: 'background.paper', bgcolor: 'primary.dark', color: 'primary.contrastText', fontSize: { xs: '2rem', md: '2.6rem' }, fontWeight: 800, boxShadow: 2 }} />
          {isOwnProfile && (
            <Button component={RouterLink} to="/profil/uredi" state={editorState} variant="contained" startIcon={<EditOutlinedIcon />} sx={{ minHeight: 42 }}>
              Uredi profil
            </Button>
          )}
        </Stack>
        <Typography component="h1" variant="h4" sx={{ mt: 2, fontSize: { xs: '1.6rem', sm: '2rem' }, lineHeight: 1.2, fontWeight: 850, overflowWrap: 'anywhere' }}>
          {user.displayName}
        </Typography>
        <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1.25} alignItems="center" sx={{ mt: 1.2 }}>
          {user.location && (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: 0 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 19, color: 'primary.light', flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>{user.location}</Typography>
            </Stack>
          )}
          <Chip size="small" variant="outlined" label={user.role === 'IZVODJAC' ? user.legalType === 'FIRMA' ? 'Firma' : 'Izvođač' : 'Investitor'} />
          {isOwnProfile && <Chip size="small" variant="outlined" color="primary" label="Moj profil" />}
        </Stack>
        {Boolean(user.serviceCategories?.length) && (
          <Stack direction="row" useFlexGap flexWrap="wrap" spacing={0.75} sx={{ mt: 2 }}>
            {user.serviceCategories?.map((category) => <Chip key={category} label={category} size="small" variant="outlined" />)}
          </Stack>
        )}
      </Box>
    </Paper>
  );
}
