import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Chip, Paper, Stack, Typography, alpha } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ProfileAvatar from '@/modules/user/components/ProfileAvatar';
import { IUserProfile } from '@/modules/user/models/IUserProfile';

type ContractorCardProps = {
  contractor: IUserProfile;
  averageRating?: number;
  reviewCount?: number;
};

export default function ContractorCard({ contractor, averageRating, reviewCount }: ContractorCardProps) {
  const categories = contractor.serviceCategories ?? [];
  const visibleCategories = categories.slice(0, 3);
  const remainingCategories = categories.slice(3);
  const hasReviewSummary = averageRating !== undefined && reviewCount !== undefined;
  const ratingLabel = !hasReviewSummary
    ? 'Ocjene nisu dostupne'
    : reviewCount === 0
      ? 'Još nema recenzija'
      : `${averageRating.toLocaleString('hr', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} (${reviewCount})`;

  return (
    <Paper
      component="article"
      variant="outlined"
      sx={{
        p: { xs: 1.5, sm: 2 },
        height: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        borderRadius: 1.5,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start" sx={{ minWidth: 0 }}>
        <ProfileAvatar
          displayName={contractor.displayName}
          imageUrl={contractor.profileImageUrl}
          sx={{
            width: 64,
            height: 64,
            flexShrink: 0,
            borderRadius: 1.25,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            color: 'primary.light',
            fontWeight: 750,
          }}
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            component="h2"
            variant="subtitle1"
            sx={{ fontWeight: 750, lineHeight: 1.3, overflowWrap: 'anywhere' }}
          >
            {contractor.displayName}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="flex-start" sx={{ mt: 0.5, minWidth: 0 }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0, mt: 0.1 }} />
            <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
              {contractor.location.trim() || 'Lokacija nije navedena'}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {contractor.legalType === 'FIRMA' ? 'Firma' : 'Fizička osoba'}
          </Typography>
        </Box>
      </Stack>

      {contractor.bio.trim() && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            overflowWrap: 'anywhere',
          }}
        >
          {contractor.bio}
        </Typography>
      )}

      {categories.length > 0 && (
        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" title={categories.join(', ')}>
          {visibleCategories.map((category) => (
            <Chip
              key={category}
              label={category}
              size="small"
              variant="outlined"
              sx={{ maxWidth: '100%', fontSize: '0.7rem', borderRadius: 1 }}
            />
          ))}
          {remainingCategories.length > 0 && (
            <Chip
              label={`+${remainingCategories.length}`}
              size="small"
              variant="outlined"
              title={remainingCategories.join(', ')}
              aria-label={`Ostale usluge: ${remainingCategories.join(', ')}`}
              sx={{ fontSize: '0.7rem', borderRadius: 1 }}
            />
          )}
        </Stack>
      )}

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        useFlexGap
        flexWrap="wrap"
        gap={1}
        sx={{ mt: 'auto', pt: 0.25 }}
      >
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: 0 }}>
          {hasReviewSummary && reviewCount > 0 && (
            <StarRoundedIcon aria-hidden="true" sx={{ fontSize: 21, color: 'warning.main', flexShrink: 0 }} />
          )}
          <Typography
            variant="caption"
            color={hasReviewSummary && reviewCount > 0 ? 'text.primary' : 'text.secondary'}
            aria-label={hasReviewSummary && reviewCount > 0
              ? `Prosječna ocjena ${averageRating.toLocaleString('hr')}, broj recenzija: ${reviewCount}`
              : undefined}
            sx={{ fontWeight: hasReviewSummary && reviewCount > 0 ? 700 : 400 }}
          >
            {ratingLabel}
          </Typography>
        </Stack>
        <Button
          component={RouterLink}
          to={`/profil/${contractor.id}`}
          variant="contained"
          size="small"
          aria-label={`Otvori profil: ${contractor.displayName}`}
          sx={{ minHeight: 40, px: 1.5, borderRadius: 1, ml: 'auto', flexShrink: 0 }}
        >
          Otvori profil
        </Button>
      </Stack>
    </Paper>
  );
}
