import React, { useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  CircularProgress,
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Chip,
  Rating,
  Alert,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EngineeringIcon from '@mui/icons-material/Engineering';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import StarIcon from '@mui/icons-material/Star';

import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import { useRootStore } from '@/core/hooks/useRootStore';

const JobDetailsPage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { jobStore, bidStore, authenticationStore, reviewStore } = useRootStore();

  const jobId = id || '';
  const job = jobStore.getJobById(jobId);
  const bids = bidStore.getBidsByJobId(jobId);
  const isOwner = authenticationStore.user?.id === job?.investitorId;
  const currentUserId = authenticationStore.user?.id;
  const acceptedBid = bids.find((bid) => bid.status === 'ACCEPTED');
  const existingReview = reviewStore.getReviewByJobId(jobId);
  const isAcceptedContractor = acceptedBid?.contractorId === currentUserId;
  const navigationState = location.state as { returnTo?: string; returnLabel?: string } | null;
  const backTarget = navigationState?.returnTo || '/marketplace';
  const backLabel = navigationState?.returnLabel || 'Povratak na marketplace';

  useEffect(() => {
    bidStore.resetBidForm();
    reviewStore.resetReviewForm();

    if (jobId) {
      void jobStore.loadJobById(jobId);
      void bidStore.loadBids(jobId);
      void reviewStore.loadReviews(jobId);
    }
  }, [jobId, bidStore, jobStore, reviewStore]);

  if (jobStore.isLoadingJobDetails && !job) {
    return (
      <BaseContainer maxWidth="lg">
        <Box sx={{ pt: 1, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress color="primary" />
        </Box>
      </BaseContainer>
    );
  }

  if (!job) {
    return (
      <BaseContainer maxWidth="lg">
        <Box sx={{ pt: 1, textAlign: 'center' }}>
          <Alert severity="error" sx={{ borderRadius: 4 }}>
            {jobStore.selectedJobError || 'Posao nije pronaden.'}
          </Alert>
          <BaseButton
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(backTarget)}
            sx={{ mt: 4 }}
          >
            {backLabel}
          </BaseButton>
        </Box>
      </BaseContainer>
    );
  }

  const handleSendBid = async (event: React.FormEvent) => {
    event.preventDefault();
    await bidStore.submitBidForJob(job.id);
  };

  const handleAcceptBid = async (bidId: string) => {
    if (window.confirm('Jeste li sigurni da želite prihvatiti ovu ponudu?')) {
      const isAccepted = await bidStore.acceptBid(bidId);
      if (isAccepted) {
        await jobStore.loadJobById(job.id);
      }
    }
  };

  const handleSubmitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    await reviewStore.submitReviewForJob(job.id);
  };

  const handleCloseJob = async () => {
    if (!window.confirm('Jeste li sigurni da želite zatvoriti ovaj oglas za nove ponude?')) {
      return;
    }

    await jobStore.closeJob(job.id);
  };

  const handleCompleteJob = async () => {
    if (!window.confirm('Jeste li sigurni da želite označiti posao završenim?')) {
      return;
    }

    await jobStore.completeJob(job.id);
  };

  const cardStyle = {
    p: { xs: 2.2, md: 4.2, lg: 4.6 },
    borderRadius: { xs: 4, md: 5 },
    border: '1px solid',
    borderColor: alpha(theme.palette.primary.main, 0.08),
    boxShadow: `0 16px 36px ${alpha(theme.palette.common.black, 0.035)}`,
    bgcolor: 'background.paper',
  };

  const metaChipSx = {
    borderRadius: 2.5,
    fontWeight: 700,
    bgcolor: alpha(theme.palette.background.paper, 0.84),
    borderColor: alpha(theme.palette.secondary.main, 0.08),
    '& .MuiChip-label': {
      px: 1.1,
    },
  };

  const statusLabel = jobStore.getJobStatusLabel(job.status);
  const statusColor = jobStore.getJobStatusColor(job.status);
  const bidCountLabel = bids.length === 1 ? '1 ponuda' : `${bids.length} ponuda`;
  const desktopMetaChips = [job.category, statusLabel, bidCountLabel];

  return (
    <BaseContainer maxWidth={false} disableGutters withPadding={false} animate={false}>
      <Box sx={{ width: '100%', pt: { xs: 0.25, md: 0.35 }, pb: { xs: 3, md: 6 } }}>
        <BaseButton
          variant="text"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(backTarget)}
          sx={{
            mb: { xs: 0.45, md: 1.6 },
            fontWeight: 700,
            px: 0,
            minHeight: isMobile ? 32 : undefined,
          }}
        >
          {backLabel}
        </BaseButton>

        <Box
          sx={{
            p: { xs: 2.1, md: 0 },
            mb: { xs: 2.2, md: 3.3 },
            borderRadius: { xs: 4, md: 0 },
            color: isMobile ? 'secondary.main' : 'secondary.main',
            position: 'relative',
            overflow: 'hidden',
            background: isMobile
              ? `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${theme.palette.background.default} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.16)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 32%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: isMobile ? '1px solid' : 'none',
            borderColor: isMobile ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
            boxShadow: isMobile ? `0 10px 24px ${alpha(theme.palette.common.black, 0.04)}` : 'none',
            borderBottom: { md: '1px solid' },
            borderBottomColor: { md: alpha(theme.palette.primary.main, 0.07) },
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: isMobile
                ? `radial-gradient(circle at 18% 12%, ${alpha(theme.palette.primary.main, 0.12)}, transparent 40%)`
                : `radial-gradient(circle at 18% 20%, ${alpha(theme.palette.primary.main, 0.11)}, transparent 42%)`,
            },
          }}
        >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 1.8, md: 3 }}
          justifyContent="space-between"
          alignItems={{ md: 'flex-end' }}
          sx={{
            position: 'relative',
            zIndex: 1,
            px: { md: 0.15, lg: 0.25 },
            py: { md: 0.7, lg: 0.95 },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
              {isMobile ? (
                <>
                  <Chip
                    label={job.category}
                    color="primary"
                    sx={{
                      fontWeight: 800,
                      borderRadius: 999,
                      height: 30,
                      boxShadow: `0 8px 18px ${alpha(theme.palette.primary.main, 0.14)}`,
                    }}
                  />
                  <Chip
                    label={statusLabel}
                    color={statusColor}
                    sx={{
                      fontWeight: 900,
                      borderRadius: 999,
                      textTransform: 'uppercase',
                      fontSize: '0.68rem',
                      height: 30,
                    }}
                  />
                </>
              ) : (
                desktopMetaChips.map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    color={label === job.category ? 'primary' : undefined}
                    variant={label === job.category ? 'filled' : 'outlined'}
                    sx={{
                      height: 32,
                      borderRadius: 999,
                      fontWeight: 800,
                      bgcolor: label === job.category ? undefined : alpha(theme.palette.background.paper, 0.82),
                      borderColor: label === job.category ? undefined : alpha(theme.palette.primary.main, 0.14),
                      boxShadow:
                        label === job.category ? `0 10px 22px ${alpha(theme.palette.primary.main, 0.12)}` : 'none',
                      '& .MuiChip-label': {
                        px: 1.1,
                        fontSize: '0.74rem',
                      },
                    }}
                  />
                ))
              )}
            </Stack>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                mb: 0.8,
                lineHeight: 1.06,
                letterSpacing: '-0.04em',
                fontSize: { xs: '1.45rem', md: '2.45rem', lg: '2.8rem' },
                maxWidth: { md: '88%' },
              }}
            >
              {job.title}
            </Typography>

            {!isMobile && (
              <Typography
                sx={{
                  mb: 1.25,
                  maxWidth: 760,
                  color: 'text.secondary',
                  fontSize: '1rem',
                  lineHeight: 1.55,
                }}
              >
                Detaljan pregled projekta, otvorenih ponuda i koraka koje trebate poduzeti da suradnja krene bez
                zastoja.
              </Typography>
            )}

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<LocationOnIcon sx={{ fontSize: '1rem !important' }} />}
                label={job.location}
                variant="outlined"
                sx={metaChipSx}
              />
              <Chip
                icon={<CalendarMonthIcon sx={{ fontSize: '1rem !important' }} />}
                label={`Rok: ${job.deadline}`}
                variant="outlined"
                sx={metaChipSx}
              />
            </Stack>
          </Box>

          <Box
              sx={{
                alignSelf: { xs: 'stretch', md: 'flex-start' },
                minWidth: { md: 270, lg: 310 },
              }}
            >
            <Stack spacing={1.4}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 1.4, md: 2.05 },
                  borderRadius: { xs: 3.5, md: 4 },
                  bgcolor: alpha(theme.palette.background.paper, isMobile ? 0.9 : 0.84),
                  border: '1px solid',
                  borderColor: isMobile
                    ? alpha(theme.palette.success.main, 0.12)
                    : alpha(theme.palette.success.main, 0.12),
                  boxShadow: isMobile
                    ? `0 14px 28px ${alpha(theme.palette.success.main, 0.08)}`
                    : `0 18px 34px ${alpha(theme.palette.success.main, 0.08)}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mb: 0.5,
                    color: 'text.secondary',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Budžet projekta
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 900,
                    color: job.budget ? 'success.light' : 'secondary.main',
                    fontSize: { xs: '1.35rem', md: '1.8rem' },
                    lineHeight: 1.05,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {job.budget ? `${job.budget.toLocaleString()} EUR` : 'Po dogovoru'}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.55,
                    color: 'text.secondary',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  Investitor prima ponude direktno kroz BuildConnect.
                </Typography>

                {!isMobile && (
                  <Stack direction="row" spacing={0.9} sx={{ mt: 1.35 }}>
                    <Chip
                      icon={<LocationOnIcon sx={{ fontSize: '0.95rem !important' }} />}
                      label={job.location}
                      variant="outlined"
                      sx={{
                        ...metaChipSx,
                        height: 30,
                        bgcolor: alpha(theme.palette.background.paper, 0.9),
                      }}
                    />
                    <Chip
                      icon={<CalendarMonthIcon sx={{ fontSize: '0.95rem !important' }} />}
                      label={job.deadline}
                      variant="outlined"
                      sx={{
                        ...metaChipSx,
                        height: 30,
                        bgcolor: alpha(theme.palette.background.paper, 0.9),
                      }}
                    />
                  </Stack>
                )}
              </Paper>

              {isOwner && (jobStore.canEditJob(job) || jobStore.canCloseJob(job)) && (
                <Stack spacing={1.1}>
                  {jobStore.canEditJob(job) && (
                    <BaseButton
                      fullWidth
                      variant="contained"
                      color="secondary"
                      startIcon={<EditNoteIcon />}
                      onClick={() =>
                        navigate(`/posao/${job.id}/uredi`, {
                          state: { returnTo: `/posao/${job.id}`, returnLabel: 'Povratak na oglas' },
                        })
                      }
                      sx={{
                        minHeight: 46,
                        fontWeight: 800,
                        borderRadius: 999,
                        boxShadow: `0 14px 30px ${alpha(theme.palette.secondary.main, 0.18)}`,
                        textTransform: 'none',
                      }}
                    >
                      Uredi ovaj oglas
                    </BaseButton>
                  )}
                  {jobStore.canCloseJob(job) && (
                    <BaseButton
                      fullWidth
                      variant="outlined"
                      color="warning"
                      onClick={() => void handleCloseJob()}
                      sx={{
                        minHeight: 46,
                        fontWeight: 800,
                        borderRadius: 999,
                        textTransform: 'none',
                      }}
                    >
                      Zatvori oglas
                    </BaseButton>
                  )}
                </Stack>
              )}
            </Stack>
          </Box>
        </Stack>
        </Box>

        <Grid container spacing={{ xs: 2.2, md: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={cardStyle}>
            <Box sx={{ mb: { xs: 2.2, md: 4 } }}>
              <Typography
                variant="overline"
                sx={{
                  color: 'primary.light',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                }}
              >
                Detalji projekta
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mt: 0.25,
                  fontWeight: 900,
                  color: 'secondary.main',
                  fontSize: { xs: '1.18rem', md: '1.5rem' },
                }}
              >
                Opis projekta
              </Typography>
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: { xs: 1.72, md: 1.8 },
                whiteSpace: 'pre-line',
                fontSize: { xs: '0.98rem', md: '1.05rem' },
              }}
            >
              {job.description}
            </Typography>
          </Paper>

          {existingReview && (
            <Paper
              sx={{
                ...cardStyle,
                mt: 4,
                bgcolor: alpha(theme.palette.success.main, 0.03),
                borderColor: alpha(theme.palette.success.main, 0.1),
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  fontWeight: 900,
                  color: 'success.light',
                  mb: 1,
                }}
              >
                <StarIcon />
                Recenzija investitora
              </Typography>
              <Rating value={existingReview.rating} readOnly sx={{ mb: 2 }} />
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', color: 'secondary.main', fontWeight: 500 }}
              >
                "{existingReview.comment}"
              </Typography>
            </Paper>
          )}

          <Box sx={{ mt: { xs: 3, md: 5.5 } }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              alignItems={{ xs: 'flex-start', md: 'flex-end' }}
              justifyContent="space-between"
              spacing={{ xs: 1.2, md: 2 }}
              sx={{
                mb: { xs: 2.4, md: 3.6 },
                pb: { md: 1.5 },
                borderBottom: { md: '1px solid' },
                borderColor: { md: alpha(theme.palette.primary.main, 0.08) },
              }}
            >
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    color: 'primary.light',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                  }}
                >
                  Suradnje i odabir
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    mt: 0.2,
                    fontWeight: 900,
                    color: 'secondary.main',
                    fontSize: { xs: '1.25rem', md: '2rem', lg: '2.15rem' },
                    letterSpacing: '-0.03em',
                  }}
                >
                  Pristigle ponude
                </Typography>
                <Typography
                  sx={{
                    mt: 0.35,
                    color: 'text.secondary',
                    fontSize: { xs: '0.82rem', md: '0.92rem' },
                    maxWidth: 620,
                    lineHeight: 1.55,
                  }}
                >
                  Pregledaj zainteresirane izvođače i odaberi najbolju ponudu.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={bidCountLabel}
                  sx={{
                    fontWeight: 900,
                    bgcolor: 'background.paper',
                    color: 'common.white',
                    borderRadius: 999,
                    height: 30,
                    '& .MuiChip-label': {
                      px: 1.15,
                    },
                  }}
                />
                {!isMobile && (
                  <Chip
                    label={acceptedBid ? 'Odabir u tijeku' : 'Čeka odabir'}
                    variant="outlined"
                    sx={{
                      height: 30,
                      borderRadius: 999,
                      fontWeight: 800,
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      borderColor: alpha(theme.palette.primary.main, 0.14),
                      '& .MuiChip-label': {
                        px: 1.1,
                        fontSize: '0.74rem',
                      },
                    }}
                  />
                )}
              </Stack>
            </Stack>

            {bidStore.bidListError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                {bidStore.bidListError}
              </Alert>
            )}

            {bidStore.isLoadingBids && bids.length === 0 ? (
              <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress color="primary" />
              </Box>
            ) : bids.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  textAlign: 'center',
                  borderRadius: { xs: 4, md: 6 },
                  border: '1px dashed',
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  bgcolor: 'background.paper',
                  backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.paper, 0.96)} 100%)`,
                }}
              >
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    mx: 'auto',
                    mb: 2,
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.14),
                    color: 'primary.light',
                    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <EngineeringIcon sx={{ fontSize: 28 }} />
                </Box>
                <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: { xs: '1.02rem', md: '1.15rem' }, mb: 0.7 }}>
                  Još nema ponuda
                </Typography>
                <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                  Još nema ponuda. Budite prvi!
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={{ xs: 2.2, md: 2.5 }}>
              {bids.map((bid) => (
                <Paper
                  key={bid.id}
                  sx={{
                    ...cardStyle,
                    p: { xs: 2, md: 2.8, lg: 3.05 },
                    borderColor: bid.status === 'ACCEPTED' ? alpha(theme.palette.success.main, 0.28) : alpha(theme.palette.divider, 0.1),
                    bgcolor: bid.status === 'ACCEPTED' ? alpha(theme.palette.success.main, 0.03) : 'background.paper',
                    backgroundImage: bid.status === 'ACCEPTED'
                      ? `linear-gradient(180deg, ${alpha(theme.palette.success.light, 0.16)} 0%, ${theme.palette.background.paper} 60%)`
                      : `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.16)} 0%, ${theme.palette.background.paper} 45%)`,
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
                    boxShadow: bid.status === 'ACCEPTED'
                      ? `0 18px 34px ${alpha(theme.palette.success.main, 0.08)}`
                      : `0 10px 28px ${alpha(theme.palette.common.black, 0.04)}`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 18px 34px ${alpha(theme.palette.common.black, 0.08)}`,
                    },
                  }}
                >
                  <Stack spacing={1.65}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={{ xs: 1.15, sm: 1.25 }}
                      alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={1.25} alignItems="flex-start" sx={{ minWidth: 0, flex: 1 }}>
                      <Box
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: 999,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(theme.palette.primary.main, 0.14),
                          color: 'secondary.main',
                          fontWeight: 900,
                          fontSize: '1.02rem',
                          flexShrink: 0,
                          boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.08)}`,
                        }}
                      >
                        {bid.contractorName.trim().charAt(0).toUpperCase()}
                      </Box>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 900,
                              cursor: 'pointer',
                              color: 'secondary.main',
                              fontSize: { xs: '1rem', md: '1.1rem' },
                              lineHeight: 1.2,
                              '&:hover': { color: 'primary.light' },
                            }}
                              onClick={() => navigate(`/profil/${bid.contractorId}`)}
                          >
                            {bid.contractorName}
                          </Typography>
                          {bid.status === 'ACCEPTED' && (
                            <Chip
                              icon={<FactCheckIcon />}
                              label="Odabrana ponuda"
                              color="success"
                              size="small"
                              sx={{
                                fontWeight: 800,
                                borderRadius: 999,
                                height: 28,
                              }}
                            />
                          )}
                        </Stack>

                        <Stack direction="row" spacing={1.1} flexWrap="wrap" useFlexGap>
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.45, color: 'text.secondary' }}>
                            <AccessTimeIcon sx={{ fontSize: 14 }} />
                            <Typography sx={{ fontSize: '0.76rem', fontWeight: 700 }}>
                              Poslano {bid.createdAt.toLocaleDateString('hr-HR')}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.45, color: 'text.secondary' }}>
                            <ScheduleRoundedIcon sx={{ fontSize: 14 }} />
                            <Typography sx={{ fontSize: '0.76rem', fontWeight: 700 }}>
                              Rok {bid.daysToComplete} dana
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                      </Stack>

                      {!isMobile && (
                        <Box
                          sx={{
                            minWidth: 176,
                            ml: { sm: 1.25 },
                            px: 1.15,
                            py: 0.95,
                            borderRadius: 3.2,
                            border: '1px solid',
                            borderColor: alpha(theme.palette.success.main, 0.12),
                            bgcolor: alpha(theme.palette.background.paper, 0.82),
                            boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.04)}`,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              color: 'text.secondary',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              mb: 0.2,
                            }}
                          >
                            Vrijednost ponude
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 900,
                              color: 'success.light',
                              fontSize: '1.3rem',
                              lineHeight: 1.05,
                              letterSpacing: '-0.03em',
                            }}
                          >
                            {bid.amount.toLocaleString()} EUR
                          </Typography>
                        </Box>
                      )}
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.65,
                        fontSize: { xs: '0.9rem', md: '0.95rem' },
                      }}
                    >
                      {bid.message}
                    </Typography>

                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.15}
                      justifyContent="space-between"
                      alignItems={{ xs: 'stretch', sm: 'flex-end' }}
                      sx={{
                        pt: 0.25,
                        borderTop: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.08),
                      }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.8,
                          px: 1.05,
                          py: 0.8,
                          borderRadius: 3,
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          border: '1px solid',
                          borderColor: alpha(theme.palette.success.main, 0.14),
                          boxShadow: `0 10px 22px ${alpha(theme.palette.success.main, 0.08)}`,
                          alignSelf: { xs: 'flex-start', sm: 'auto' },
                        }}
                      >
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 999,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: alpha(theme.palette.success.main, 0.14),
                            color: 'success.light',
                            flexShrink: 0,
                          }}
                        >
                          <PaidOutlinedIcon sx={{ fontSize: 16 }} />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              color: 'text.secondary',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              mb: 0.1,
                            }}
                          >
                            Ponuda
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 900,
                              color: 'success.light',
                              fontSize: { xs: '1.12rem', md: '1.25rem' },
                              lineHeight: 1.05,
                              letterSpacing: '-0.02em',
                            }}
                          >
                            {bid.amount.toLocaleString()} EUR
                          </Typography>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                        <BaseButton
                          variant="text"
                          color="secondary"
                          onClick={() => navigate(`/profil/${bid.contractorId}`)}
                          sx={{
                            minHeight: 38,
                            px: 0.4,
                            fontWeight: 800,
                            alignSelf: { xs: 'stretch', sm: 'flex-end' },
                          }}
                        >
                          Pogledaj profil
                        </BaseButton>
                        {isOwner && bid.status === 'PENDING' && !acceptedBid && (
                          <BaseButton
                            variant="contained"
                            color="success"
                            onClick={() => handleAcceptBid(bid.id)}
                            loading={bidStore.isLoading}
                            sx={{
                              minHeight: 42,
                              px: 2.2,
                              borderRadius: 999,
                              boxShadow: `0 14px 28px ${alpha(theme.palette.success.main, 0.18)}`,
                              alignSelf: { xs: 'stretch', sm: 'flex-end' },
                            }}
                          >
                            Prihvati ponudu
                          </BaseButton>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
              </Stack>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: { xs: 'static', md: 'sticky' }, top: { md: 24 } }}>
            {isOwner && acceptedBid && !existingReview && (
              <Paper
                sx={{
                  ...cardStyle,
                  bgcolor: 'background.paper',
                  color: 'common.white',
                  boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.25)}`,
                  backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.04)} 0%, ${theme.palette.background.paper} 100%)`,
                }}
              >
                <Chip
                  label="Završni korak"
                  sx={{
                    mb: 1.25,
                    height: 28,
                    borderRadius: 999,
                    bgcolor: alpha(theme.palette.common.white, 0.1),
                    color: 'common.white',
                    fontWeight: 900,
                    '& .MuiChip-label': {
                      px: 1.05,
                      fontSize: '0.7rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    },
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1.5 }}>
                  Završi projekt
                </Typography>
                <Typography variant="body2" sx={{ mb: 4, opacity: 0.9 }}>
                  Ocijenite izvođača <strong>{acceptedBid.contractorName}</strong>.
                </Typography>
                <form onSubmit={handleSubmitReview}>
                  <Box
                    sx={{
                      bgcolor: alpha(theme.palette.common.white, 0.08),
                      p: 3,
                      borderRadius: 4,
                      mb: 3,
                      textAlign: 'center',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.common.white, 0.08),
                    }}
                  >
                    <Rating
                      size="large"
                      value={reviewStore.reviewRating}
                      onChange={(_, value) => reviewStore.setReviewRating(value)}
                      sx={{
                        '& .MuiRating-iconFilled': { color: 'warning.main' },
                        '& .MuiRating-iconEmpty': { color: alpha(theme.palette.common.white, 0.2) },
                      }}
                    />
                  </Box>
                  <BaseInput
                    fullWidth
                    label="Komentar suradnje"
                    multiline
                    rows={4}
                    value={reviewStore.reviewComment}
                    onChange={(event) => reviewStore.setReviewComment(event.target.value)}
                    required
                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                  />
                  {reviewStore.reviewError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                      {reviewStore.reviewError}
                    </Alert>
                  )}
                  <BaseButton
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    loading={reviewStore.isLoading}
                    disabled={!reviewStore.isReviewFormValid || reviewStore.isLoading}
                    sx={{
                      minHeight: 46,
                      borderRadius: 999,
                      boxShadow: `0 14px 28px ${alpha(theme.palette.primary.main, 0.22)}`,
                      fontWeight: 800,
                    }}
                  >
                    Objavi recenziju
                  </BaseButton>
                </form>
              </Paper>
            )}

            {authenticationStore.user?.role === 'IZVODJAC' && (
              <Paper
                sx={{
                  ...cardStyle,
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundImage: job.status !== 'OPEN'
                    ? undefined
                    : `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.16)} 0%, ${theme.palette.background.paper} 36%)`,
                  '&::before': job.status !== 'OPEN'
                    ? undefined
                    : {
                        content: '""',
                        position: 'absolute',
                        top: -56,
                        right: -52,
                        width: 160,
                        height: 160,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.12)} 0%, transparent 70%)`,
                      },
                }}
              >
                {jobStore.canCompleteJob(job, acceptedBid?.contractorId, currentUserId) ? (
                  <Stack spacing={1.4}>
                    <Chip
                      label="Vaš projekt"
                      color="success"
                      sx={{
                        alignSelf: 'flex-start',
                        height: 28,
                        borderRadius: 999,
                        fontWeight: 900,
                        '& .MuiChip-label': {
                          px: 1.05,
                          fontSize: '0.7rem',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        },
                      }}
                    />
                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'secondary.main' }}>
                      Završite posao
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Kada ste dovršili dogovorene radove, označite posao završenim. Nakon toga investitor može ostaviti recenziju.
                    </Typography>
                    {jobStore.jobsError && (
                      <Alert severity="error" sx={{ borderRadius: 3 }}>
                        {jobStore.jobsError}
                      </Alert>
                    )}
                    <BaseButton
                      fullWidth
                      variant="contained"
                      color="success"
                      onClick={() => void handleCompleteJob()}
                      loading={jobStore.isLoading}
                      sx={{
                        minHeight: 48,
                        borderRadius: 999,
                        fontWeight: 800,
                        boxShadow: `0 14px 30px ${alpha(theme.palette.success.main, 0.2)}`,
                      }}
                    >
                      Označi posao završenim
                    </BaseButton>
                  </Stack>
                ) : job.status !== 'OPEN' ? (
                  <Stack spacing={1.2}>
                    <Chip
                      label="Status oglasa"
                      variant="outlined"
                      sx={{
                        alignSelf: 'flex-start',
                        height: 28,
                        borderRadius: 999,
                        fontWeight: 900,
                        borderColor: alpha(theme.palette.info.main, 0.22),
                        bgcolor: alpha(theme.palette.info.main, 0.06),
                        '& .MuiChip-label': {
                          px: 1.05,
                          fontSize: '0.7rem',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        },
                      }}
                    />
                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'secondary.main' }}>
                      {`Oglas je ${jobStore.getJobStatusLabel(job.status).toLowerCase()}`}
                    </Typography>
                    <Alert severity="info" sx={{ borderRadius: 4, fontWeight: 600 }}>
                      {job.status === 'CLOSED'
                        ? 'Investitor je zatvorio oglas i više ne prima nove ponude.'
                        : isAcceptedContractor
                          ? 'Posao je označen završenim i čeka zaključak investitora.'
                        : 'Ovaj oglas više ne prima nove ponude.'}
                    </Alert>
                  </Stack>
                ) : (
                  <>
                    <Chip
                      label="Akcija"
                      color="primary"
                      sx={{
                        mb: 1.1,
                        height: 28,
                        borderRadius: 999,
                        fontWeight: 900,
                        '& .MuiChip-label': {
                          px: 1.05,
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        },
                      }}
                    />
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
                      Pošaljite ponudu
                    </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.6, maxWidth: 320, lineHeight: 1.55 }}>
                        Investitor će primiti vašu ponudu odmah.
                      </Typography>
                      {currentUserId === job.investitorId && (
                        <Alert severity="info" sx={{ mb: 2.4, borderRadius: 3 }}>
                          Ne možete poslati ponudu na vlastiti oglas.
                        </Alert>
                      )}
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                      <Chip
                        icon={<PaidOutlinedIcon sx={{ fontSize: '0.95rem !important' }} />}
                        label="Cijena i rok"
                        variant="outlined"
                        sx={{
                          height: 30,
                          borderRadius: 999,
                          fontWeight: 800,
                          bgcolor: alpha(theme.palette.background.paper, 0.82),
                          borderColor: alpha(theme.palette.primary.main, 0.14),
                          '& .MuiChip-label': {
                            px: 1.05,
                            fontSize: '0.72rem',
                          },
                        }}
                      />
                      <Chip
                        icon={<EditNoteIcon sx={{ fontSize: '0.95rem !important' }} />}
                        label="Kratka poruka"
                        variant="outlined"
                        sx={{
                          height: 30,
                          borderRadius: 999,
                          fontWeight: 800,
                          bgcolor: alpha(theme.palette.background.paper, 0.82),
                          borderColor: alpha(theme.palette.primary.main, 0.14),
                          '& .MuiChip-label': {
                            px: 1.05,
                            fontSize: '0.72rem',
                          },
                        }}
                      />
                    </Stack>
                    <form onSubmit={handleSendBid}>
                      {bidStore.bidError && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
                          {bidStore.bidError}
                        </Alert>
                      )}
                      <Stack direction={{ xs: 'column', sm: 'row', md: 'column', lg: 'row' }} spacing={1.5} sx={{ mb: 1.8 }}>
                        <BaseInput
                          label="Cijena (EUR)"
                          type="number"
                          value={bidStore.bidAmount}
                          onChange={(event) => bidStore.setBidAmount(event.target.value)}
                          inputProps={{ min: 1, step: 1 }}
                          required
                          sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              bgcolor: alpha(theme.palette.background.paper, 0.82),
                            },
                          }}
                        />
                        <BaseInput
                          label="Rok izvedbe (dana)"
                          type="number"
                          value={bidStore.bidDaysToComplete}
                          onChange={(event) => bidStore.setBidDaysToComplete(event.target.value)}
                          inputProps={{ min: 1, step: 1 }}
                          required
                          sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              bgcolor: alpha(theme.palette.background.paper, 0.82),
                            },
                          }}
                        />
                      </Stack>
                      <BaseInput
                        label="Vaša poruka"
                        multiline
                        rows={5}
                        value={bidStore.bidMessage}
                        onChange={(event) => bidStore.setBidMessage(event.target.value)}
                        required
                        sx={{
                          mb: 2.4,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3.2,
                            bgcolor: alpha(theme.palette.background.paper, 0.82),
                          },
                        }}
                      />
                      <Typography sx={{ mb: 2.1, color: 'text.secondary', fontSize: '0.76rem', lineHeight: 1.5 }}>
                        Unesi realnu cijenu, procijenjeni rok i kratko objasni kako bi pristupio ovom projektu.
                      </Typography>
                      <BaseButton
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        loading={bidStore.isLoading}
                        disabled={!bidStore.isBidFormValid || bidStore.isLoading || currentUserId === job.investitorId}
                        sx={{
                          minHeight: 48,
                          borderRadius: 999,
                          fontWeight: 800,
                          boxShadow: `0 14px 30px ${alpha(theme.palette.primary.main, 0.2)}`,
                        }}
                      >
                        Pošalji ponudu
                      </BaseButton>
                    </form>
                  </>
                )}
              </Paper>
            )}
          </Box>
        </Grid>
        </Grid>
      </Box>
    </BaseContainer>
  );
});

export default JobDetailsPage;
