import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  CircularProgress,
  Typography,
  Grid,
  Paper,
  Stack,
  Divider,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SendIcon from '@mui/icons-material/Send';
import StarRateIcon from '@mui/icons-material/StarRate';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import { useRootStore } from '@/core/hooks/useRootStore';
import StatCard from '../components/StatCard';
import DashboardService from '@/modules/dashboard/services/DashboardService';
import IDashboardResponse from '@/api/models/dashboard/IDashboardResponse';

const DashboardPage: React.FC = observer(() => {
  const { authenticationStore } = useRootStore();
  const theme = useTheme();
  const navigate = useNavigate();
  const user = authenticationStore.user;
  const dashboardService = useMemo(() => new DashboardService(), []);
  const [dashboard, setDashboard] = useState<IDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setDashboard(null);
      return;
    }

    const loadDashboard = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await dashboardService.getDashboardAsync();
        setDashboard(response.data);
      } catch {
        setLoadError('Dohvat dashboard podataka nije uspio.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboard();
  }, [dashboardService, user]);

  const cardStyle = {
    p: { xs: 2.4, md: 3.2, lg: 3.5 },
    borderRadius: { xs: 4, md: 5 },
    border: '1px solid',
    borderColor: alpha(theme.palette.primary.main, 0.08),
    bgcolor: 'background.paper',
    boxShadow: `0 16px 36px ${alpha(theme.palette.common.black, 0.035)}`,
  };

  const dashboardTitle =
    user?.role === 'INVESTITOR' ? 'Kontrolirajte objave i odabir izvođača' : 'Pratite ponude i aktivne projekte';
  const dashboardSubtitle =
    user?.role === 'INVESTITOR'
      ? 'Na jednom mjestu pratite svoje oglase, broj pristiglih ponuda i preporučene izvođače za sljedeće korake.'
      : 'Odmah vidite status poslanih ponuda, prihvacene projekte i reputaciju koju gradite kroz suradnje.';
  const dashboardRoleLabel = user?.role === 'INVESTITOR' ? 'Investitor workspace' : 'Izvodjac workspace';
  const primaryActionLabel = user?.role === 'INVESTITOR' ? 'Novi oglas' : 'Pronađi posao';
  const summary = dashboard?.summary;
  const jobActivities = dashboard?.jobActivities ?? [];
  const bidActivities = dashboard?.bidActivities ?? [];
  const recommendedContractors = dashboard?.recommendedContractors ?? [];

  if (isLoading && !dashboard) {
    return (
      <BaseContainer maxWidth={false} disableGutters animate={false}>
        <Box sx={{ pt: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress color="primary" />
        </Box>
      </BaseContainer>
    );
  }

  return (
    <BaseContainer maxWidth={false} disableGutters animate={false}>
      {loadError && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3 }}>
          {loadError}
        </Alert>
      )}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'flex-end' }}
        spacing={2}
        sx={{
          mt: { xs: 0.25, md: 0.35 },
          mb: { xs: 3, md: 3.5 },
          px: { md: 0.15, lg: 0.25 },
          py: { md: 0.75, lg: 0.95 },
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.16)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 34%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          borderBottom: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.07),
        }}
      >
        <Box sx={{ maxWidth: 860 }}>
          <Chip
            label={dashboardRoleLabel}
            color="primary"
            sx={{
              mb: 1,
              height: 28,
              fontWeight: 900,
              borderRadius: 999,
              '& .MuiChip-label': {
                px: 1.1,
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              },
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: 'secondary.main',
              mb: 0.8,
              letterSpacing: '-0.04em',
              lineHeight: 1.04,
              fontSize: { xs: '2rem', md: '2.55rem', lg: '2.85rem' },
            }}
          >
            {dashboardTitle}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500, maxWidth: 760, lineHeight: 1.6 }}>
            {dashboardSubtitle}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.7, color: 'text.secondary', fontWeight: 600 }}>
            Dobrodosao natrag, <Box component="span" sx={{ color: 'primary.light', fontWeight: 900 }}>{user?.displayName}</Box>
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
          <Chip
            label={user?.role === 'INVESTITOR' ? `${summary?.jobsCount ?? 0} oglasa` : `${summary?.sentBidsCount ?? 0} ponuda`}
            variant="outlined"
            sx={{
              height: 32,
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
          <BaseButton
            variant="contained"
            startIcon={user?.role === 'INVESTITOR' ? <AssignmentIcon /> : <EngineeringIcon />}
            onClick={() =>
              navigate(
                user?.role === 'INVESTITOR' ? '/objavi-posao' : '/marketplace',
                user?.role === 'INVESTITOR'
                  ? { state: { returnTo: '/dashboard', returnLabel: 'Povratak na dashboard', afterSaveTo: '/dashboard' } }
                  : undefined
              )
            }
            sx={{
              borderRadius: 999,
              px: 3.4,
              minHeight: 46,
              boxShadow: `0 14px 28px ${alpha(theme.palette.primary.main, 0.18)}`,
            }}
          >
            {primaryActionLabel}
          </BaseButton>
        </Stack>
      </Stack>

      <Grid container spacing={{ xs: 1.6, md: 2.4 }} sx={{ mb: { xs: 3, md: 4.5 } }}>
        {user?.role === 'INVESTITOR' ? (
          <>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Moji oglasi" value={summary?.jobsCount ?? 0} icon={<DashboardIcon />} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Ukupno ponuda" value={summary?.totalBidsOnMyJobs ?? 0} icon={<NotificationsActiveIcon />} color={theme.palette.secondary.main} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Ugovoreni radovi" value={summary?.activeProjectsCount ?? 0} icon={<AssignmentIcon />} color={theme.palette.success.main} />
            </Grid>
          </>
        ) : (
          <>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Poslane ponude" value={summary?.sentBidsCount ?? 0} icon={<SendIcon />} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Prihvaćeni poslovi" value={summary?.acceptedBidsCount ?? 0} icon={<AssignmentIcon />} color={theme.palette.success.main} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Prosjecna ocjena" value={(summary?.averageRating ?? 0).toFixed(1)} icon={<StarRateIcon />} color={theme.palette.warning.main} />
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={{ xs: 2.2, md: 3.2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={cardStyle}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'flex-end' }}
              spacing={1.2}
              sx={{
                mb: 3,
                pb: 1.4,
                borderBottom: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.08),
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
                  Aktivnosti i statusi
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.2, fontWeight: 900, color: 'secondary.main', display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <NotificationsActiveIcon color="secondary" />
                  {user?.role === 'INVESTITOR' ? 'Status vasih oglasa' : 'Status vasih ponuda'}
                </Typography>
              </Box>
              <Chip
                label={user?.role === 'INVESTITOR' ? `${summary?.jobsCount ?? 0} aktivnih stavki` : `${summary?.sentBidsCount ?? 0} ukupno ponuda`}
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
            </Stack>

            <Stack spacing={1.6}>
              {user?.role === 'INVESTITOR' ? (
                jobActivities.length === 0 ? (
                  <Box sx={{ py: 4, textAlign: 'center', bgcolor: alpha(theme.palette.divider, 0.03), borderRadius: 4 }}>
                    <Typography color="text.disabled" sx={{ fontWeight: 600 }}>Nemate aktivnih oglasa.</Typography>
                  </Box>
                ) : (
                  jobActivities.map((job) => {
                    return (
                      <Box
                        key={job.jobId}
                        sx={{
                          p: { xs: 2, md: 2.25 },
                          border: '1px solid',
                          borderColor: alpha(theme.palette.primary.main, 0.08),
                          borderRadius: 4,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 2,
                          bgcolor: alpha(theme.palette.background.paper, 0.76),
                          backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.12)} 0%, ${theme.palette.background.paper} 100%)`,
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body1" sx={{ fontWeight: 900, mb: 0.6, color: 'secondary.main' }}>{job.title}</Typography>
                          <Stack direction="row" spacing={0.9} alignItems="center" flexWrap="wrap" useFlexGap>
                            <Chip label={`${job.bidsCount} ponuda`} size="small" sx={{ fontWeight: 800, height: 24, fontSize: 11 }} />
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                              Budžet: {job.budget ? `${job.budget} EUR` : 'Po dogovoru'}
                            </Typography>
                          </Stack>
                        </Box>
                        <BaseButton
                          size="small"
                          variant="outlined"
                          onClick={() => navigate(`/posao/${job.jobId}`, { state: { returnTo: '/dashboard', returnLabel: 'Povratak na dashboard' } })}
                          sx={{ borderRadius: 999, px: 1.8, fontWeight: 800 }}
                        >
                          Pregledaj
                        </BaseButton>
                      </Box>
                    );
                  })
                )
              ) : bidActivities.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center', bgcolor: alpha(theme.palette.divider, 0.03), borderRadius: 4 }}>
                  <Typography color="text.disabled" sx={{ fontWeight: 600 }}>Niste poslali ni jednu ponudu.</Typography>
                </Box>
              ) : (
                bidActivities.map((bid) => {
                  return (
                    <Box
                      key={bid.bidId}
                      sx={{
                        p: { xs: 2, md: 2.25 },
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.08),
                        borderRadius: 4,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.76),
                        backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.12)} 0%, ${theme.palette.background.paper} 100%)`,
                      }}
                    >
                        <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body1" sx={{ fontWeight: 900, mb: 0.6, color: 'secondary.main' }}>{bid.jobTitle}</Typography>
                        <Chip
                          label={bid.status}
                          size="small"
                          color={bid.status === 'ACCEPTED' ? 'success' : bid.status === 'PENDING' ? 'primary' : 'default'}
                          sx={{ fontWeight: 900, height: 24, fontSize: 11 }}
                        />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: 'secondary.main', whiteSpace: 'nowrap' }}>
                        {bid.amount} EUR
                      </Typography>
                    </Box>
                  );
                })
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2.4}>
            <Paper
              sx={{
                ...cardStyle,
                bgcolor: 'background.paper',
                color: 'common.white',
                backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.04)} 0%, ${theme.palette.background.paper} 100%)`,
                boxShadow: `0 18px 36px ${alpha(theme.palette.common.black, 0.2)}`,
              }}
            >
              <Typography variant="overline" sx={{ fontWeight: 900, letterSpacing: '0.08em', opacity: 0.82 }}>
                Kratki savjet
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1.6 }}>Savjeti za suradnju</Typography>
              <Divider sx={{ bgcolor: alpha(theme.palette.common.white, 0.1), mb: 2 }} />
              <Typography variant="body2" sx={{ opacity: 0.92, lineHeight: 1.65 }}>
                Uvijek provjerite recenzije investitora prije slanja ponude kako biste osigurali dobru suradnju.
              </Typography>
            </Paper>

            {user?.role === 'INVESTITOR' && (
              <Paper sx={cardStyle}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.2 }}>
                  <Box>
                    <Typography variant="overline" sx={{ color: 'primary.light', fontWeight: 900, letterSpacing: '0.08em' }}>
                      Preporuke
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleAltIcon color="secondary" />
                      Preporučeni izvođači
                    </Typography>
                  </Box>
                  <BaseButton size="small" variant="text" onClick={() => navigate('/izvodjaci')}>
                    Svi izvođači
                  </BaseButton>
                </Stack>

                {recommendedContractors.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Objavite prvi posao ili odaberite kategorije kako biste dobili preporuke izvođača.
                  </Typography>
                ) : (
                  <Stack spacing={1.6}>
                    {recommendedContractors.map((item) => (
                      <Box
                        key={item.contractorId}
                        sx={{
                          p: 2,
                          borderRadius: 4,
                          border: '1px solid',
                          borderColor: alpha(theme.palette.primary.main, 0.08),
                          bgcolor: alpha(theme.palette.background.paper, 0.7),
                          backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.12)} 0%, ${theme.palette.background.paper} 100%)`,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 900, cursor: 'pointer', mb: 0.45, color: 'secondary.main' }}
                          onClick={() => navigate(`/profil/${item.contractorId}`)}
                        >
                          {item.displayName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                          {item.location} - {item.legalType === 'FIRMA' ? 'Firma' : 'Fizička osoba'}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <StarRateIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {item.averageRating.toFixed(1)} ({item.reviewCount})
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.8} useFlexGap flexWrap="wrap">
                          {item.categoryMatches.slice(0, 2).map((category) => (
                            <Chip key={category} label={category} size="small" sx={{ fontWeight: 700 }} />
                          ))}
                          {item.isLocationMatch && <Chip label="Ista lokacija" size="small" color="success" variant="outlined" sx={{ fontWeight: 700 }} />}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Paper>
            )}

            <Paper sx={cardStyle}>
              <Typography variant="overline" sx={{ color: 'primary.light', fontWeight: 900, letterSpacing: '0.08em' }}>
                Moj profil
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1.4 }}>Uredite javni profil</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.6, lineHeight: 1.6 }}>
                Vaš profil je javan i vidljiv drugim korisnicima.
              </Typography>
              <BaseButton
                fullWidth
                variant="outlined"
                onClick={() =>
                  navigate('/profil/uredi', { state: { returnTo: '/dashboard', returnLabel: 'Povratak na dashboard' } })
                }
                sx={{ borderRadius: 999, minHeight: 42, fontWeight: 800 }}
              >
                Uredi profil
              </BaseButton>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </BaseContainer>
  );
});

export default DashboardPage;
