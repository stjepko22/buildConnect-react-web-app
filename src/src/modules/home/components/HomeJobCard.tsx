import { Link as RouterLink } from 'react-router-dom';
import { Box, CardActionArea, Chip, Stack, Typography, alpha } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { IJobResponse } from '@/api/models/jobs/IJobResponse';

type HomeJobCardProps = {
  job: IJobResponse;
};

const budgetFormatter = new Intl.NumberFormat('hr-HR', { maximumFractionDigits: 2 });
const dateFormatter = new Intl.DateTimeFormat('hr-HR', { day: 'numeric', month: 'short' });

export default function HomeJobCard({ job }: HomeJobCardProps) {
  const createdAt = new Date(job.createdAt);
  const createdAtLabel = Number.isNaN(createdAt.getTime()) ? null : dateFormatter.format(createdAt);
  const budgetLabel = typeof job.budget === 'number' && Number.isFinite(job.budget)
    ? `${budgetFormatter.format(job.budget)} EUR`
    : 'Po dogovoru';

  return (
    <CardActionArea
      component={RouterLink}
      to={`/marketplace/${job.id}`}
      aria-label={`Pogledaj oglas: ${job.title}`}
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
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 42,
              height: 42,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 1.5,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              color: 'primary.light',
            }}
          >
            <ConstructionRoundedIcon fontSize="small" />
          </Box>
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
              {job.title}
            </Typography>
            {job.location.trim() && (
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5, minWidth: 0 }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 15, color: 'text.secondary', flexShrink: 0 }} />
                <Typography variant="caption" color="text.secondary" noWrap>{job.location}</Typography>
              </Stack>
            )}
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ minWidth: 0 }}>
          <Chip label={job.category} size="small" variant="outlined" sx={{ maxWidth: '65%', fontSize: '0.7rem' }} />
          {createdAtLabel && (
            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
              {createdAtLabel}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'success.light', fontWeight: 750 }}>{budgetLabel}</Typography>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'primary.light' }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>Pogledaj</Typography>
            <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
          </Stack>
        </Stack>
      </Stack>
    </CardActionArea>
  );
}
