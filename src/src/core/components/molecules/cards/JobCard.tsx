import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  Badge,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';

import { useRootStore } from '@/core/hooks/useRootStore';
import { IJob } from '@/modules/marketplace/jobs/models/IJob';

interface JobCardProps {
  job: IJob;
}

const JobCard: React.FC<JobCardProps> = observer(({ job }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { bidStore, authenticationStore, jobStore } = useRootStore();

  const bidsCount = bidStore.getBidsByJobId(job.id).length;
  const isOwner = authenticationStore.user?.id === job.investitorId;
  const statusLabel = jobStore.getJobStatusLabel(job.status);
  const statusColor = jobStore.getJobStatusColor(job.status);
  const currentPath = location.pathname;
  const returnState = currentPath.startsWith('/moji-poslovi')
    ? { returnTo: '/moji-poslovi', returnLabel: 'Povratak na moje poslove' }
    : currentPath.startsWith('/dashboard')
      ? { returnTo: '/dashboard', returnLabel: 'Povratak na dashboard' }
      : currentPath.startsWith('/profil/')
        ? { returnTo: currentPath, returnLabel: 'Povratak na profil' }
        : currentPath.startsWith('/marketplace')
          ? { returnTo: '/marketplace', returnLabel: 'Povratak na marketplace' }
          : { returnTo: '/marketplace', returnLabel: 'Povratak na marketplace' };

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/marketplace/${job.id}`, { state: returnState })}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate(`/marketplace/${job.id}`, { state: returnState });
        }
      }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: { xs: 3, md: 4 },
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.1),
        bgcolor: 'background.paper',
        backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.16)} 0%, ${theme.palette.background.paper} 52%)`,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
        boxShadow: `0 10px 24px ${alpha(theme.palette.common.black, 0.04)}`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&:focus': {
          outline: 'none',
        },
        '&:focus-visible': {
          outline: 'none',
          borderColor: alpha(theme.palette.primary.main, 0.34),
          boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.14)}, 0 18px 30px ${alpha(theme.palette.common.black, 0.08)}`,
        },
        '&:hover': {
          transform: { md: 'translateY(-4px)' },
          boxShadow: `0 18px 30px ${alpha(theme.palette.common.black, 0.08)}`,
          borderColor: alpha(theme.palette.primary.main, 0.28),
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: { xs: 1.55, md: 3 } }}>
        <Stack spacing={{ xs: 1.1, md: 1.6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
            <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
              <Chip
                label={job.category}
                size="small"
                sx={{
                  fontWeight: 800,
                  borderRadius: 999,
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.96)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 52%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
                  color: 'primary.light',
                  fontSize: '0.7rem',
                  height: { xs: 30, md: 34 },
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.16),
                  boxShadow: `0 10px 22px ${alpha(theme.palette.primary.main, 0.08)}, inset 0 1px 0 ${alpha(theme.palette.common.white, 0.08)}`,
                  '& .MuiChip-label': {
                    px: { xs: 1.1, md: 1.35 },
                    letterSpacing: '0.012em',
                  },
                }}
              />
              <Chip
                label={statusLabel}
                size="small"
                color={statusColor}
                variant={job.status === 'OPEN' ? 'outlined' : 'filled'}
                sx={{
                  fontWeight: 800,
                  borderRadius: 999,
                  fontSize: '0.68rem',
                  height: { xs: 30, md: 34 },
                }}
              />
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.disabled', flexShrink: 0 }}>
              <AccessTimeIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {new Date(job.createdAt).toLocaleDateString('hr-HR')}
              </Typography>
            </Stack>
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              lineHeight: 1.25,
              color: 'secondary.main',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: { xs: '2.8rem', md: '3.1rem' },
              fontSize: { xs: '1rem', md: '1.25rem' },
              letterSpacing: '-0.01em',
            }}
          >
            {job.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: isMobile ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: { xs: '0.82rem', md: '0.875rem' },
              lineHeight: 1.45,
              minHeight: { xs: '2.35rem', md: '3.8rem' },
            }}
          >
            {job.description}
          </Typography>

          <Divider sx={{ opacity: 0.45 }} />

          <Stack direction="row" justifyContent="space-between" alignItems="flex-end" spacing={1.1}>
            <Stack spacing={0.5} sx={{ minWidth: 0, flex: '1 1 auto', pr: 0.2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                <LocationOnIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {job.location}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: 'text.disabled',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Budžet
                </Typography>
                <Box
                  sx={{
                    mt: 0.35,
                    px: { xs: 0.78, md: 0.95 },
                    py: { xs: 0.56, md: 0.68 },
                    borderRadius: 2.2,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: { xs: 0.5, md: 0.7 },
                    maxWidth: '100%',
                    bgcolor: job.budget
                      ? alpha(theme.palette.success.main, 0.11)
                      : alpha(theme.palette.secondary.main, 0.07),
                    backgroundImage: job.budget
                      ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.96)} 0%, ${alpha(theme.palette.success.light, 0.22)} 100%)`
                      : `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.96)} 0%, ${alpha(theme.palette.primary.light, 0.16)} 100%)`,
                    border: '1px solid',
                    borderColor: job.budget
                      ? alpha(theme.palette.success.main, 0.18)
                      : alpha(theme.palette.secondary.main, 0.12),
                    boxShadow: job.budget
                      ? `0 10px 22px ${alpha(theme.palette.success.main, 0.1)}`
                      : `0 8px 18px ${alpha(theme.palette.primary.main, 0.06)}`,
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 24, md: 28 },
                      height: { xs: 24, md: 28 },
                      borderRadius: 999,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: job.budget
                        ? alpha(theme.palette.success.main, 0.14)
                        : alpha(theme.palette.primary.main, 0.1),
                      color: job.budget ? 'success.light' : 'primary.light',
                      flexShrink: 0,
                    }}
                  >
                      <PaidOutlinedIcon sx={{ fontSize: { xs: 13, md: 15 } }} />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        color: job.budget ? 'success.light' : 'secondary.main',
                        lineHeight: 1.05,
                        fontSize: { xs: '0.94rem', md: '1.12rem' },
                        letterSpacing: '-0.02em',
                        whiteSpace: 'nowrap',
                      }}
                  >
                     {job.budget ? `${job.budget.toLocaleString()} EUR` : 'Po dogovoru'}
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Stack spacing={0.55} alignItems="flex-end" sx={{ flexShrink: 0, minWidth: { xs: 112, md: 134 } }}>
              {isOwner && (
                <Badge badgeContent={bidsCount} color="error" sx={{ mr: 0.2 }}>
                  <ChatBubbleOutlineIcon color="action" />
                </Badge>
              )}

              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: { xs: 0.55, md: 0.72 },
                  pl: { xs: 0.82, md: 1 },
                  pr: { xs: 0.36, md: 0.45 },
                  py: { xs: 0.34, md: 0.42 },
                  borderRadius: 999,
                  bgcolor: alpha(theme.palette.background.paper, 0.9),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.14),
                  color: 'secondary.main',
                  boxShadow: `0 10px 20px ${alpha(theme.palette.common.black, 0.06)}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: '0.7rem', md: '0.8rem' },
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                    color: 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Pogledaj posao
                </Typography>
                <Box
                  sx={{
                    width: { xs: 22, md: 26 },
                    height: { xs: 22, md: 26 },
                    borderRadius: 999,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`,
                    flexShrink: 0,
                  }}
                >
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: { xs: 10, md: 12 } }} />
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
});

export default JobCard;
