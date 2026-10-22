import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Alert,
  Tabs,
  Tab,
  useTheme,
  Stack,
  Typography,
  Paper,
  Chip,
  alpha,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

import JobCard from '@/core/components/molecules/cards/JobCard';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import { useRootStore } from '@/core/hooks/useRootStore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: { xs: 2.5, md: 3.2 } }}>{children}</Box>}
    </div>
  );
}

const MyJobsPage: React.FC = observer(() => {
  const { jobStore, bidStore, authenticationStore, reviewStore } = useRootStore();
  const theme = useTheme();
  const navigate = useNavigate();
  const user = authenticationStore.user;

  useEffect(() => {
    void jobStore.loadJobs();
    if (user?.role === 'IZVODJAC') {
      void bidStore.loadBids(undefined, user.id);
      void reviewStore.loadReviews(undefined, user.id);
      return;
    }

    if (user?.role === 'INVESTITOR') {
      void bidStore.loadBids();
      void reviewStore.loadReviews();
    }
  }, [bidStore, jobStore, reviewStore, user]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    jobStore.setMyJobsTabValue(newValue);
  };

  const handleCloseJob = async (jobId: string) => {
    if (!window.confirm('Jeste li sigurni da želite zatvoriti ovaj oglas za nove ponude?')) {
      return;
    }

    await jobStore.closeJob(jobId);
  };

  const handleCompleteJob = async (jobId: string) => {
    if (!window.confirm('Jeste li sigurni da želite označiti posao završenim?')) {
      return;
    }

    await jobStore.completeJob(jobId);
  };

  if (!user) {
    return (
      <BaseContainer maxWidth="lg">
        <Box sx={{ pt: 1 }}>
          <Alert severity="warning" variant="filled" sx={{ borderRadius: 3, fontWeight: 700 }}>
            Morate biti prijavljeni da biste vidjeli svoje poslove.
          </Alert>
        </Box>
      </BaseContainer>
    );
  }

  const myPublishedJobs = jobStore.jobs.filter((job) => job.investitorId === user.id);
  const activeJobs = myPublishedJobs.filter((job) => job.status !== 'COMPLETED');
  const completedJobs = myPublishedJobs.filter((job) => job.status === 'COMPLETED');

  const myBids = bidStore.bids.filter((bid) => bid.contractorId === user.id);
  const jobsIAppliedTo = jobStore.jobs.filter((job) => myBids.some((bid) => bid.jobId === job.id && bid.status === 'PENDING'));
  const jobsIWon = jobStore.jobs.filter((job) => myBids.some((bid) => bid.jobId === job.id && bid.status === 'ACCEPTED'));

  const isInvestor = user.role === 'INVESTITOR';
  const tabSummaryLabel = isInvestor
    ? `${activeJobs.length} aktivnih i ${completedJobs.length} završenih`
    : `${jobsIAppliedTo.length} aktivnih i ${jobsIWon.length} prihvacenih`;
  const emptyStateSx = {
    borderRadius: 4,
    py: 3.5,
    px: 2.5,
    border: '1px dashed',
    borderColor: alpha(theme.palette.primary.main, 0.18),
    bgcolor: alpha(theme.palette.primary.light, 0.2),
  };
  const renderPanelHeader = (title: string, description: string, countLabel: string) => (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', md: 'flex-end' }}
      spacing={1}
      sx={{
        mb: 2.1,
        pb: 1.1,
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
          Radni pregled
        </Typography>
        <Typography sx={{ mt: 0.15, fontWeight: 900, color: 'secondary.main', fontSize: { xs: '1.02rem', md: '1.22rem' } }}>
          {title}
        </Typography>
        <Typography sx={{ mt: 0.25, color: 'text.secondary', fontSize: '0.88rem', lineHeight: 1.55 }}>
          {description}
        </Typography>
      </Box>
      <Chip
        label={countLabel}
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
  );

  return (
    <BaseContainer maxWidth={false} disableGutters animate={false}>
      <Box sx={{ width: '100%' }}>
        <Box>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', md: 'center' }}
            spacing={{ xs: 1.5, md: 2 }}
            sx={{ mt: 0.35, mb: { xs: 2, md: 2.6 } }}
          >
            <Box sx={{ flex: 1, minWidth: 0, borderBottom: 1, borderColor: alpha(theme.palette.primary.main, 0.08), px: { xs: 0.1, md: 0.8 } }}>
            <Tabs
              value={jobStore.myJobsTabValue}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 800,
                  fontSize: { xs: '0.82rem', sm: '0.95rem' },
                  textTransform: 'none',
                  minHeight: { xs: 54, md: 60 },
                  minWidth: 0,
                  py: { xs: 1, md: 1.2 },
                },
                '& .MuiSvgIcon-root': {
                  fontSize: { xs: '1.05rem', md: '1.15rem' },
                },
              }}
            >
              {isInvestor
                ? [
                    <Tab key={0} icon={<HourglassEmptyIcon />} iconPosition="start" label={`Aktivni oglasi (${activeJobs.length})`} />,
                    <Tab key={1} icon={<CheckCircleIcon />} iconPosition="start" label={`Završeni projekti (${completedJobs.length})`} />,
                  ]
                : [
                    <Tab key={0} icon={<AssignmentIcon />} iconPosition="start" label={`Moje ponude (${jobsIAppliedTo.length})`} />,
                    <Tab key={1} icon={<CheckCircleIcon />} iconPosition="start" label={`Prihvaćeni poslovi (${jobsIWon.length})`} />,
                  ]}
            </Tabs>
            </Box>
            <BaseButton
              variant="contained"
              color="primary"
              onClick={() =>
                navigate(
                  isInvestor ? '/objavi-posao' : '/marketplace',
                  isInvestor
                    ? { state: { returnTo: '/moji-poslovi', returnLabel: 'Povratak na moje poslove', afterSaveTo: '/moji-poslovi' } }
                    : undefined
                )
              }
              sx={{
                alignSelf: { xs: 'flex-start', md: 'center' },
                borderRadius: 999,
                px: 3.2,
                minHeight: 44,
                boxShadow: `0 14px 28px ${alpha(theme.palette.primary.main, 0.18)}`,
              }}
            >
              {isInvestor ? 'Objavi posao' : 'Pronađi posao'}
            </BaseButton>
          </Stack>

          {isInvestor && (
            <>
              <CustomTabPanel value={jobStore.myJobsTabValue} index={0}>
                {renderPanelHeader(
                  'Aktivni oglasi',
                  'Oglasi koji su i dalje otvoreni za ponude i trebaju vašu pažnju.',
                  tabSummaryLabel
                )}
                {activeJobs.length === 0 ? (
                  <Alert severity="info" variant="outlined" sx={emptyStateSx}>
                    Trenutno nemate aktivnih oglasa koji čekaju majstore.
                  </Alert>
                ) : (
                  <Grid container spacing={{ xs: 2, md: 2.6 }}>
                    {activeJobs.map((job) => (
                      <Grid key={job.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
                          <Stack spacing={1.4}>
                            <JobCard job={job} />
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.2,
                                borderRadius: 4,
                                border: '1px solid',
                                borderColor: alpha(theme.palette.primary.main, 0.08),
                                bgcolor: alpha(theme.palette.background.paper, 0.82),
                              }}
                            >
                              <Stack spacing={1}>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                  {jobStore.canEditJob(job) && (
                                    <BaseButton
                                      variant="outlined"
                                      color="secondary"
                                      onClick={() => navigate(`/posao/${job.id}/uredi`, { state: { fromMyJobs: true } })}
                                      sx={{ flex: 1, fontWeight: 800, borderRadius: 999, minHeight: 40, minWidth: 138 }}
                                    >
                                      Uredi oglas
                                    </BaseButton>
                                  )}
                                  {jobStore.canCloseJob(job) && (
                                    <BaseButton
                                      variant="outlined"
                                      color="warning"
                                      onClick={() => void handleCloseJob(job.id)}
                                      sx={{ flex: 1, fontWeight: 800, borderRadius: 999, minHeight: 40, minWidth: 138 }}
                                    >
                                      Zatvori oglas
                                    </BaseButton>
                                  )}
                                </Stack>
                              </Stack>
                            </Paper>
                          </Stack>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CustomTabPanel>

              <CustomTabPanel value={jobStore.myJobsTabValue} index={1}>
                {renderPanelHeader(
                  'Završeni projekti',
                  'Arhiva projekata koji su završeni i više ne traže nove aktivnosti.',
                  tabSummaryLabel
                )}
                {completedJobs.length === 0 ? (
                  <Alert severity="info" variant="outlined" sx={emptyStateSx}>
                    Nema završenih projekata u vašoj arhivi.
                  </Alert>
                ) : (
                  <Grid container spacing={{ xs: 2, md: 2.6 }}>
                    {completedJobs.map((job) => (
                      <Grid key={job.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
                        <Box sx={{ position: 'relative', opacity: 0.82, filter: 'grayscale(0.35)' }}>
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 10,
                              left: 10,
                              zIndex: 2,
                              bgcolor: 'background.paper',
                              color: 'common.white',
                              px: 1.35,
                              py: 0.45,
                              borderRadius: 999,
                              fontSize: '0.7rem',
                              fontWeight: 900,
                              boxShadow: theme.shadows[3],
                            }}
                          >
                            ARHIVA
                          </Box>
                          <JobCard job={job} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CustomTabPanel>
            </>
          )}

          {!isInvestor && (
            <>
              <CustomTabPanel value={jobStore.myJobsTabValue} index={0}>
                {renderPanelHeader(
                  'Ponude na čekanju',
                  'Ponude koje su poslane investitorima i trenutno čekaju odgovor ili odabir.',
                  `${jobsIAppliedTo.length} na čekanju`
                )}
                {jobsIAppliedTo.length === 0 ? (
                  <Alert severity="info" variant="outlined" sx={emptyStateSx}>
                    Niste poslali nijednu ponudu koja je trenutno u statusu čekanja.
                  </Alert>
                ) : (
                  <Grid container spacing={{ xs: 2, md: 2.6 }}>
                    {jobsIAppliedTo.map((job) => (
                      <Grid key={job.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
                        <Box sx={{ position: 'relative' }}>
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 42,
                              right: 10,
                              zIndex: 2,
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                              px: 1.35,
                              py: 0.45,
                              borderRadius: 999,
                              fontSize: '0.7rem',
                              fontWeight: 900,
                              boxShadow: theme.shadows[3],
                            }}
                          >
                            CEKA ODGOVOR
                          </Box>
                          <JobCard job={job} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CustomTabPanel>

              <CustomTabPanel value={jobStore.myJobsTabValue} index={1}>
                {renderPanelHeader(
                  'Prihvaćeni poslovi',
                  'Projekti na kojima ste već odabrani i gdje suradnja može ići prema izvedbi.',
                  `${jobsIWon.length} prihvaceno`
                )}
                {jobsIWon.length === 0 ? (
                  <Alert severity="info" variant="outlined" sx={emptyStateSx}>
                    Jos uvijek nemate prihvacenih ponuda. Nastavite se prijavljivati.
                  </Alert>
                ) : (
                  <Grid container spacing={{ xs: 2, md: 2.6 }}>
                    {jobsIWon.map((job) => (
                      <Grid key={job.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
                        <Stack spacing={1.2}>
                        <Box sx={{ position: 'relative' }}>
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              zIndex: 2,
                              bgcolor: 'success.main',
                              color: 'common.white',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 999,
                              fontSize: '0.72rem',
                              fontWeight: 900,
                              boxShadow: theme.shadows[4],
                            }}
                          >
                            DOBIVEN POSAO
                          </Box>
                          <JobCard job={job} />
                        </Box>
                        <BaseButton
                          variant="contained"
                          color="success"
                          onClick={() => void handleCompleteJob(job.id)}
                          sx={{ fontWeight: 800, borderRadius: 999, minHeight: 40 }}
                        >
                          Označi završenim
                        </BaseButton>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CustomTabPanel>
            </>
          )}
        </Box>
      </Box>
    </BaseContainer>
  );
});

export default MyJobsPage;
