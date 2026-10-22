import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Drawer,
  Fade,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import debounce from 'lodash/debounce';
import ConstructionIcon from '@mui/icons-material/Construction';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams } from 'react-router-dom';

import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import JobCard from '@/core/components/molecules/cards/JobCard';
import { useRootStore } from '@/core/hooks/useRootStore';
import { JOB_CATEGORIES, JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';

const MARKET_MOBILE_CONTENT_WIDTH = { xs: 440, sm: 460 };
const MARKET_MOBILE_CONTENT_PADDING = { xs: 1.5, sm: 2 };
const MARKET_RESULTS_PADDING = { xs: 0.75, sm: 1.25 };

const JobListPage: React.FC = observer(() => {
  const { jobStore, bidStore, authenticationStore } = useRootStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchParams] = useSearchParams();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const debouncedSearch = useMemo(
    () => debounce((val: string) => jobStore.setJobSearchQuery(val), 300),
    [jobStore]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    jobStore.setJobSearchInputValue(val);
    debouncedSearch(val);
  };

  const focusDesktopFilters = () => {
    if (typeof document === 'undefined') {
      return;
    }

    document.getElementById('market-filter-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    const categoryFilters = Array.from(
      new Set(
        searchParams
          .getAll('category')
          .filter((value): value is JobCategory => JOB_CATEGORIES.includes(value as JobCategory))
      )
    );
    const queryFilter = searchParams.get('q')?.trim() ?? '';
    const hasRouteFilters = searchParams.has('q') || searchParams.has('category');

    jobStore.resetAllJobFilters();
    jobStore.initializeJobFiltersForCurrentUser();

    if (hasRouteFilters) {
      jobStore.setSelectedJobCategories(categoryFilters);
      jobStore.setJobSearchInputValue(queryFilter);
      jobStore.setJobSearchQuery(queryFilter);
    }

    void bidStore.loadBids();

    return () => {
      debouncedSearch.cancel();
    };
  }, [bidStore, jobStore, debouncedSearch, searchParams]);

  useEffect(() => {
    void jobStore.loadJobs({
      q: jobStore.jobSearchQuery.trim() || undefined,
      category: jobStore.selectedJobCategories.length > 0 ? jobStore.selectedJobCategories : undefined,
    });
  }, [jobStore, jobStore.jobSearchQuery, jobStore.selectedJobCategories]);

  const filteredJobs = jobStore.filteredJobs;
  const isAuthenticated = !!authenticationStore.user;
  const roleLabel = !isAuthenticated
    ? 'gosta'
    : authenticationStore.user?.role === 'IZVODJAC'
      ? 'izvođača'
      : 'investitora';
  const selectedFiltersCount = jobStore.selectedJobCategories.length;
  const selectedRoleLabel = !isAuthenticated
    ? 'Javni pregled'
    : authenticationStore.user?.role === 'IZVODJAC'
      ? 'Izvodjac'
      : 'Investitor';
  const desktopHeaderChips = [
    `${filteredJobs.length} oglasa`,
    selectedFiltersCount > 0 ? `${selectedFiltersCount} aktivna filtera` : 'Bez aktivnih filtera',
    `Prikaz za ${selectedRoleLabel.toLowerCase()}`,
  ];

  const desktopFilterPanel = (
    <Box
      id="market-filter-section"
      sx={{
        mb: 4.25,
        px: { md: 0.2, lg: 0.3 },
        pt: { md: 1.35, lg: 1.6 },
        pb: { md: 0.4, lg: 0.5 },
        borderTop: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.09),
      }}
    >
      <Stack spacing={1.3}>
        <Stack
          direction={{ md: 'row' }}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={{ md: 'center' }}
          sx={{ gap: 1.2 }}
        >
          <Box>
            <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: '1rem', letterSpacing: '-0.02em' }}>
              Filteri marketa
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.25, color: 'text.secondary', fontWeight: 500, maxWidth: 720 }}>
              {isAuthenticated
                ? `Prikaz prilagodjen za ulogu ${roleLabel}. Odaberi kategorije koje zelis vidjeti odmah.`
                : 'Javni pregled marketa ostaje otvoren i jasan, a filtriranjem odmah dolazite do poslova koji vas zanimaju.'}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Chip
              icon={<TuneRoundedIcon sx={{ fontSize: 17 }} />}
              label={selectedFiltersCount > 0 ? `${selectedFiltersCount} aktivno` : 'Bez filtera'}
              color={selectedFiltersCount > 0 ? 'primary' : 'default'}
              variant={selectedFiltersCount > 0 ? 'filled' : 'outlined'}
              sx={{
                height: 32,
                fontWeight: 800,
                borderRadius: 999,
                bgcolor: selectedFiltersCount > 0 ? undefined : alpha(theme.palette.background.paper, 0.78),
                borderColor: alpha(theme.palette.primary.main, 0.14),
                '& .MuiChip-label': {
                  px: 1.05,
                  fontSize: '0.74rem',
                },
              }}
            />
            <BaseButton
              variant="contained"
              color="primary"
              onClick={() => jobStore.saveCurrentJobFiltersAsDefault()}
              sx={{
                minHeight: 38,
                borderRadius: 999,
                px: 1.8,
                fontWeight: 800,
                whiteSpace: 'nowrap',
                boxShadow: `0 12px 26px ${alpha(theme.palette.primary.main, 0.16)}`,
              }}
            >
              Spremi postavke
            </BaseButton>
            <BaseButton
              variant="outlined"
              color="secondary"
              onClick={() => jobStore.resetAllJobFilters()}
              sx={{
                minHeight: 38,
                borderRadius: 999,
                px: 1.8,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              Reset
            </BaseButton>
          </Stack>
        </Stack>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {JOB_CATEGORIES.map((category) => {
            const isActive = jobStore.selectedJobCategories.includes(category);
            return (
              <Chip
                key={category}
                clickable
                label={category}
                color={isActive ? 'primary' : 'default'}
                variant={isActive ? 'filled' : 'outlined'}
                onClick={() => jobStore.toggleSelectedJobCategory(category)}
                sx={{
                  fontWeight: 700,
                  height: 34,
                  borderRadius: 999,
                  bgcolor: isActive ? undefined : alpha(theme.palette.background.paper, 0.72),
                  borderColor: isActive ? undefined : alpha(theme.palette.divider, 0.75),
                  boxShadow: isActive
                    ? `0 10px 22px ${alpha(theme.palette.primary.main, 0.12)}`
                    : 'none',
                  '& .MuiChip-label': {
                    px: 1.35,
                    fontSize: '0.77rem',
                  },
                }}
              />
            );
          })}
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ pb: 12, mx: { xs: -2, sm: 0 } }}>
      {isMobile ? (
        <Box
          sx={{
            pt: 0.25,
            pb: 0.8,
            mb: 0.55,
            background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${theme.palette.background.default} 100%)`,
          }}
        >
          <BaseContainer maxWidth={false} disableGutters withPadding={false} animate={false}>
            <Box
              sx={{
                width: '100%',
                maxWidth: MARKET_MOBILE_CONTENT_WIDTH,
                mx: 'auto',
                px: MARKET_MOBILE_CONTENT_PADDING,
              }}
            >
              <Stack spacing={1.1}>
                <Box>
                  <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: '1.02rem' }}>
                    Pronađi posao
                  </Typography>
                  <Typography sx={{ mt: 0.25, color: 'text.secondary', fontSize: '0.8rem' }}>
                    {isAuthenticated
                      ? 'Pretraži aktivne oglase i kreni prema sljedećem projektu.'
                      : 'Pregledaj aktivne oglase i stekni dojam kako BuildConnect povezuje projekte i timove.'}
                  </Typography>
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    p: 0.35,
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.16),
                    boxShadow: `0 10px 24px ${alpha(theme.palette.common.black, 0.05)}`,
                  }}
                >
                  <BaseInput
                    placeholder="Pretraži po zanimanju, gradu..."
                    value={jobStore.jobSearchInputValue}
                    onChange={handleSearchChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        bgcolor: 'transparent',
                        minHeight: 50,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent',
                        },
                      },
                      '& .MuiInputBase-input': {
                        py: 0.88,
                        fontSize: '0.89rem',
                        fontWeight: 500,
                      },
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'text.secondary', ml: 0.35 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Paper>
              </Stack>
            </Box>
          </BaseContainer>
        </Box>
      ) : (
        <BaseContainer maxWidth={false} disableGutters animate={false}>
          <Stack spacing={2.25} sx={{ width: '100%', mt: { xs: 0.25, md: 0.35 }, mb: { xs: 3, md: 3.4 } }}>
            <Box
              sx={{
                width: '100%',
                px: { md: 0.1, lg: 0.2 },
                py: { md: 0.72, lg: 0.9 },
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.14)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 34%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                borderBottom: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.07),
              }}
            >
              <Stack
                direction={{ md: 'row' }}
                alignItems={{ md: 'flex-end' }}
                justifyContent="space-between"
                spacing={1.6}
                sx={{ gap: 1.5 }}
              >
                <Box sx={{ maxWidth: 760 }}>
                  <Chip
                    label={isAuthenticated ? 'Marketplace poslova' : 'Javni marketplace'}
                    color="primary"
                    sx={{
                      mb: 1,
                      height: 28,
                      fontWeight: 900,
                      borderRadius: 999,
                      boxShadow: `0 10px 22px ${alpha(theme.palette.primary.main, 0.11)}`,
                      '& .MuiChip-label': {
                        px: 1.1,
                        letterSpacing: '0.03em',
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                      },
                    }}
                  />
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      letterSpacing: '-0.04em',
                      color: 'secondary.main',
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '2.5rem', lg: '2.78rem' },
                      lineHeight: 1.03,
                      maxWidth: 820,
                    }}
                  >
                    {isAuthenticated
                      ? 'Pronađi posao koji odgovara tvom timu'
                      : 'Pregledaj otvorene projekte i vidi kako izgleda stvarni BuildConnect marketplace'}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 0.9,
                      color: 'text.secondary',
                      fontWeight: 400,
                      maxWidth: { xs: '100%', md: 700 },
                      fontSize: { xs: '1rem', md: '1rem', lg: '1.04rem' },
                      lineHeight: 1.45,
                    }}
                  >
                    {isAuthenticated
                      ? 'Pretraži aktivne oglase, suzi rezultate po kategorijama i brzo dođi do sljedećeg projekta bez suvišnih koraka.'
                      : 'Gosti mogu slobodno pregledavati aktivne oglase, dok registrirani korisnici otključavaju prijavu na poslove, ponude i puni radni tok unutar platforme.'}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent={{ md: 'flex-end' }}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ minWidth: { md: 300 }, pb: { md: 0.2 } }}
                >
                  {desktopHeaderChips.map((label) => (
                    <Chip
                      key={label}
                      label={label}
                      variant="outlined"
                      sx={{
                        height: 32,
                        borderRadius: 999,
                        fontWeight: 800,
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        borderColor: alpha(theme.palette.primary.main, 0.14),
                        backdropFilter: 'blur(10px)',
                        '& .MuiChip-label': {
                          px: 1.05,
                          fontSize: '0.74rem',
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 0.65,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 0.7,
                width: '100%',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.12),
                boxShadow: `0 18px 40px ${alpha(theme.palette.common.black, 0.045)}`,
              }}
            >
              <TextField
                fullWidth
                placeholder="Pretražite po zanimanju, gradu..."
                variant="outlined"
                value={jobStore.jobSearchInputValue}
                onChange={handleSearchChange}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiInputBase-input': { fontWeight: 500, py: 1.56, fontSize: '0.98rem' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary', ml: 1 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <BaseButton
                variant="contained"
                color="primary"
                onClick={() => jobStore.setJobSearchQuery(jobStore.jobSearchInputValue)}
                sx={{
                  px: 3.5,
                  borderRadius: 2.5,
                  height: 48,
                  fontWeight: 800,
                  boxShadow: `0 14px 28px ${alpha(theme.palette.primary.main, 0.18)}`,
                }}
              >
                Pretraži
              </BaseButton>
            </Paper>
          </Stack>
        </BaseContainer>
      )}

        <BaseContainer maxWidth={false} disableGutters animate={false}>
          <Box
            sx={{
              width: '100%',
              maxWidth: isMobile ? MARKET_MOBILE_CONTENT_WIDTH : '100%',
              mx: 'auto',
              px: isMobile ? MARKET_RESULTS_PADDING : 0,
              mt: isMobile ? 0 : undefined,
            }}
          >
          {jobStore.jobsError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {jobStore.jobsError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: isMobile ? 2 : 3.35 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  color: 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? 1 : 1.5,
                  fontSize: { xs: '1.02rem', md: '1.5rem' },
                }}
              >
                <Box sx={{ width: isMobile ? 5 : 6, height: isMobile ? 20 : 24, bgcolor: 'primary.main', borderRadius: 1 }} />
                Dostupni poslovi
              </Typography>
              {isMobile && selectedFiltersCount > 0 && (
                <Chip
                  label={`${selectedFiltersCount}`}
                  color="primary"
                  size="small"
                  sx={{
                    height: 22,
                    fontWeight: 800,
                    '& .MuiChip-label': {
                      px: 0.8,
                      fontSize: '0.68rem',
                    },
                  }}
                />
              )}
              {!isMobile && (
                <Chip
                  label={`${filteredJobs.length} oglasa`}
                  variant="outlined"
                  sx={{
                    height: 30,
                    fontWeight: 800,
                    borderRadius: 999,
                    borderColor: alpha(theme.palette.primary.main, 0.16),
                    '& .MuiChip-label': {
                      px: 1.1,
                      fontSize: '0.74rem',
                    },
                  }}
                />
              )}
            </Stack>

            {isMobile ? (
              <BaseButton
                variant="outlined"
                color="secondary"
                startIcon={<FilterListIcon />}
                onClick={() => setIsFilterSheetOpen(true)}
                sx={{
                  minHeight: 36,
                  borderRadius: 2,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  px: 1.15,
                  whiteSpace: 'nowrap',
                }}
              >
                Filteri
              </BaseButton>
            ) : (
              <BaseButton
                variant="outlined"
                color="secondary"
                startIcon={<FilterListIcon />}
                onClick={focusDesktopFilters}
                sx={{
                  minHeight: 38,
                  borderRadius: 999,
                  px: 1.9,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                }}
              >
                Uredi filtere
              </BaseButton>
            )}
          </Box>

          {!isMobile && desktopFilterPanel}

          {jobStore.isLoadingJobs && filteredJobs.length === 0 ? (
            <Paper
              sx={{
                p: { xs: 6, md: 10 },
                textAlign: 'center',
                borderRadius: 5,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <CircularProgress color="primary" />
            </Paper>
          ) : filteredJobs.length === 0 ? (
            <Fade in>
              <Paper
                sx={{
                  p: { xs: 6, md: 10 },
                  textAlign: 'center',
                  borderRadius: 5,
                  border: '2px dashed',
                  borderColor: 'divider',
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                }}
              >
                <ConstructionIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Nema rezultata
                </Typography>
                <BaseButton variant="text" onClick={() => jobStore.resetAllJobFilters()} sx={{ mt: 1 }}>
                  Prikazi sve poslove
                </BaseButton>
              </Paper>
            </Fade>
          ) : (
            <Grid container spacing={{ xs: 1.5, md: 2.5, xl: 3 }}>
              {filteredJobs.map((job, index) => (
                <Grid key={job.id} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                  <Fade in timeout={index * 50}>
                    <Box sx={{ height: '100%' }}>
                      <JobCard job={job} />
                    </Box>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </BaseContainer>

      {isMobile && (
        <Drawer
          anchor="bottom"
          open={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
              bgcolor: 'background.paper',
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: MARKET_MOBILE_CONTENT_WIDTH,
              mx: 'auto',
              px: MARKET_MOBILE_CONTENT_PADDING,
              pt: 1.1,
              pb: 2,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 4,
                borderRadius: 999,
                bgcolor: alpha(theme.palette.text.primary, 0.14),
                mx: 'auto',
                mb: 1.25,
              }}
            />

            <Stack spacing={1.4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: '1rem' }}>
                    Filteri
                  </Typography>
                  <Typography sx={{ mt: 0.2, color: 'text.secondary', fontSize: '0.78rem' }}>
                    Odaberi kategorije koje zelis vidjeti u marketu.
                  </Typography>
                </Box>
                <Chip
                  label={selectedFiltersCount > 0 ? `${selectedFiltersCount} aktivno` : 'Bez filtera'}
                  color={selectedFiltersCount > 0 ? 'primary' : 'default'}
                  variant={selectedFiltersCount > 0 ? 'filled' : 'outlined'}
                  sx={{
                    height: 30,
                    fontWeight: 700,
                    '& .MuiChip-label': {
                      px: 1.1,
                      fontSize: '0.74rem',
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {JOB_CATEGORIES.map((category) => {
                  const isActive = jobStore.selectedJobCategories.includes(category);
                  return (
                    <Chip
                      key={category}
                      clickable
                      label={category}
                      color={isActive ? 'primary' : 'default'}
                      variant={isActive ? 'filled' : 'outlined'}
                      onClick={() => jobStore.toggleSelectedJobCategory(category)}
                      sx={{
                        fontWeight: 700,
                        height: 32,
                        '& .MuiChip-label': {
                          px: 1.2,
                          fontSize: '0.76rem',
                        },
                      }}
                    />
                  );
                })}
              </Box>

              <Stack direction="row" spacing={1}>
                <BaseButton
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    jobStore.saveCurrentJobFiltersAsDefault();
                    setIsFilterSheetOpen(false);
                  }}
                  sx={{
                    flex: 1,
                    minHeight: 42,
                    borderRadius: 2.2,
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    px: 1.2,
                  }}
                >
                  Spremi
                </BaseButton>
                <BaseButton
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    jobStore.resetAllJobFilters();
                    setIsFilterSheetOpen(false);
                  }}
                  sx={{
                    flex: 1,
                    minHeight: 42,
                    borderRadius: 2.2,
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    px: 1.2,
                  }}
                >
                  Reset
                </BaseButton>
              </Stack>
            </Stack>
          </Box>
        </Drawer>
      )}
    </Box>
  );
});

export default JobListPage;
