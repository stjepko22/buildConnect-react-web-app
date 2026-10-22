import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, CardActionArea, Chip, Stack, Typography, alpha } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { IUserProfileResponse } from '@/api/models/users/IUserProfileResponse';

type HomeContractorCardProps = {
  contractor: IUserProfileResponse;
};

export default function HomeContractorCard({ contractor }: HomeContractorCardProps) {
  const initials = contractor.displayName.trim().split(/\s+/).slice(0, 2)
    .map((part) => part[0]).join('').toLocaleUpperCase('hr');
  const serviceCategories = (contractor.serviceCategories ?? []).slice(0, 2);

  return (
    <CardActionArea
      component={RouterLink}
      to={`/profil/${contractor.id}`}
      aria-label={`Otvori profil izvođača: ${contractor.displayName}`}
      sx={{
        p: { xs: 1.5, sm: 2 },
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        color: 'text.primary',
        textDecoration: 'none',
        '&:hover, &.Mui-focusVisible': { borderColor: 'primary.light' },
      }}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              color: 'primary.light',
              fontSize: '0.95rem',
              fontWeight: 750,
            }}
          >
            {initials || <PersonRoundedIcon fontSize="small" />}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              component="h3"
              variant="subtitle1"
              sx={{
                fontWeight: 750,
                lineHeight: 1.35,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                overflowWrap: 'anywhere',
              }}
            >
              {contractor.displayName}
            </Typography>
            {contractor.location.trim() && (
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5, minWidth: 0 }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 15, color: 'text.secondary', flexShrink: 0 }} />
                <Typography variant="caption" color="text.secondary" noWrap>{contractor.location}</Typography>
              </Stack>
            )}
          </Box>
          <ArrowForwardRoundedIcon sx={{ fontSize: 18, color: 'primary.light', flexShrink: 0, mt: 0.5 }} />
        </Stack>
        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" alignItems="center">
          <Typography variant="caption" color="text.secondary" sx={{ mr: 0.25 }}>
            {contractor.legalType === 'FIRMA' ? 'Firma' : 'Fizička osoba'}
          </Typography>
          {serviceCategories.map((category) => (
            <Chip key={category} label={category} size="small" variant="outlined" sx={{ maxWidth: '100%', fontSize: '0.7rem' }} />
          ))}
        </Stack>
      </Stack>
    </CardActionArea>
  );
}
