import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Rating,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import { useRootStore } from '@/core/hooks/useRootStore';
import { JOB_CATEGORIES, JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';
import debounce from 'lodash/debounce';
import ProfileAvatar from '@/modules/user/components/ProfileAvatar';

const ContractorDirectoryPage: React.FC = observer(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { userStore, reviewStore, authenticationStore } = useRootStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAuthenticated = !!authenticationStore.user;
  const debouncedSearch = useMemo(
    () => debounce((value: string) => userStore.setContractorSearchQuery(value), 300),
    [userStore]
  );

  useEffect(() => {
    const categoryFilters = Array.from(
      new Set(
        searchParams
          .getAll('category')
          .filter((value): value is JobCategory => JOB_CATEGORIES.includes(value as JobCategory))
      )
    );
    const queryFilter = searchParams.get('q')?.trim() ?? '';
    const legalTypeFilter = searchParams.get('legalType');
    const hasRouteFilters = searchParams.has('q') || searchParams.has('category') || searchParams.has('legalType') || searchParams.has('location');

    userStore.resetContractorFilters();
    userStore.initializeContractorFiltersForCurrentUser();

    if (hasRouteFilters) {
      userStore.setContractorSearchInputValue(queryFilter);
      userStore.setContractorSearchQuery(queryFilter);
      userStore.setSelectedContractorCategories(categoryFilters);
      userStore.setSelectedContractorLegalType(
        legalTypeFilter === 'FIRMA' || legalTypeFilter === 'FIZICKA_OSOBA' ? legalTypeFilter : 'ALL'
      );
      userStore.setSelectedContractorLocation(searchParams.get('location')?.trim() ?? '');
    }

    void reviewStore.loadReviews();

    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch, reviewStore, searchParams, userStore]);

  useEffect(() => {
    void userStore.loadContractors({
      q: userStore.contractorSearchQuery.trim() || undefined,
      category: userStore.selectedContractorCategories.length > 0 ? userStore.selectedContractorCategories : undefined,
      location: userStore.selectedContractorLocation.trim() || undefined,
      legalType: userStore.selectedContractorLegalType === 'ALL' ? undefined : userStore.selectedContractorLegalType,
    });
  }, [
    userStore,
    userStore.contractorSearchQuery,
    userStore.selectedContractorCategories,
    userStore.selectedContractorLocation,
    userStore.selectedContractorLegalType,
  ]);

  return (
    <Box
      sx={{
        pb: { xs: 2, md: 5 },
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${theme.palette.background.default} 22%, ${theme.palette.background.default} 100%)`,
      }}
    >
      <BaseContainer maxWidth={false} disableGutters animate={false}>
        <Stack spacing={{ xs: 2, md: 3 }} sx={{ pt: { xs: 0.25, md: 0.35 } }}>
          <Box
            sx={{
              width: '100%',
              px: { md: 0.1, lg: 0.2 },
              py: { md: 0.72, lg: 0.9 },
              background: isMobile
                ? 'transparent'
                : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.14)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 34%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              borderBottom: isMobile ? 'none' : '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.07),
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
              spacing={1.2}
              sx={{ gap: 1.2 }}
            >
              <Stack spacing={0.65} sx={{ maxWidth: 820 }}>
                <Chip
                  label={isAuthenticated ? 'Direktorij izvođača' : 'Javni direktorij'}
                  color="primary"
                  sx={{
                    alignSelf: 'flex-start',
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
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    color: 'secondary.main',
                    letterSpacing: '-0.04em',
                    fontSize: { xs: '1.6rem', md: '2.45rem', lg: '2.72rem' },
                    lineHeight: 1.03,
                    maxWidth: 900,
                  }}
                >
                  {isAuthenticated
                    ? 'Pronađite izvođače, firme i specijalizirane timove za svaki projekt'
                    : 'Pregledaj provjerene izvođače i upoznaj javni BuildConnect direktorij'}
                </Typography>
                <Typography sx={{ color: 'text.secondary', maxWidth: 740, fontSize: { xs: '0.9rem', md: '1rem' }, lineHeight: 1.55 }}>
                  {isAuthenticated
                    ? 'Pronađite majstore i firme po usluzi, lokaciji, tipu i ocjeni bez gubljenja vremena na nepregledne popise.'
                    : 'Gosti mogu slobodno pregledavati profile, usluge i ocjene, a registrirani korisnici nastavljaju prema suradnjama, ponudama i punom radnom toku.'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
                <Chip
                  label={`${userStore.filteredContractors.length} izvođača`}
                  variant="outlined"
                  sx={{
                    height: 32,
                    borderRadius: 999,
                    fontWeight: 800,
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                    borderColor: alpha(theme.palette.primary.main, 0.14),
                  }}
                />
                {!isAuthenticated && (
                  <Chip
                    label="Javni pregled profila"
                    variant="outlined"
                    sx={{
                      height: 32,
                      borderRadius: 999,
                      fontWeight: 800,
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      borderColor: alpha(theme.palette.primary.main, 0.14),
                    }}
                  />
                )}
              </Stack>
            </Stack>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 2.4 },
              borderRadius: { xs: 3, md: 3.2 },
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.1),
              bgcolor: alpha(theme.palette.background.paper, 0.98),
              boxShadow: `0 18px 40px ${alpha(theme.palette.common.black, 0.045)}`,
            }}
          >
            <Stack spacing={2.2}>
              <Box>
                <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: { xs: '1rem', md: '1.08rem' } }}>
                  Pretraga i filteri
                </Typography>
                <Typography sx={{ mt: 0.25, color: 'text.secondary', fontSize: '0.86rem', lineHeight: 1.55 }}>
                  {isAuthenticated
                    ? 'Suzite prikaz i lakše pronađite odgovarajućeg izvođača.'
                    : 'Pregled ostaje otvoren i brz, a filteri vam pomažu da odmah dođete do prave usluge ili lokacije.'}
                </Typography>
              </Box>

              <BaseInput
                fullWidth
                placeholder="Pretražite po imenu, usluzi ili lokaciji"
                value={userStore.contractorSearchInputValue}
                onChange={(e) => {
                  userStore.setContractorSearchInputValue(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    bgcolor: alpha(theme.palette.background.paper, 0.74),
                  },
                }}
                slotProps={{ input: { startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.disabled' }} /> } }}
              />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {userStore.availableServiceCategories.map((category) => {
                  const selected = userStore.selectedContractorCategories.includes(category);
                  return (
                    <Chip
                      key={category}
                      clickable
                      label={category}
                      color={selected ? 'primary' : 'default'}
                      variant={selected ? 'filled' : 'outlined'}
                      onClick={() => userStore.toggleSelectedContractorCategory(category)}
                      sx={{
                        fontWeight: 700,
                        borderRadius: 999,
                        bgcolor: selected ? undefined : alpha(theme.palette.background.paper, 0.74),
                      }}
                    />
                  );
                })}
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <BaseInput
                    select
                    fullWidth
                    label="Lokacija"
                    value={userStore.selectedContractorLocation}
                    onChange={(e) => userStore.setSelectedContractorLocation(e.target.value)}
                  >
                    <MenuItem value="">Sve lokacije</MenuItem>
                    {userStore.contractorLocations.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </BaseInput>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <BaseInput
                    select
                    fullWidth
                    label="Tip izvođača"
                    value={userStore.selectedContractorLegalType}
                    onChange={(e) => userStore.setSelectedContractorLegalType(e.target.value as 'ALL' | 'FIZICKA_OSOBA' | 'FIRMA')}
                  >
                    <MenuItem value="ALL">Svi</MenuItem>
                    <MenuItem value="FIZICKA_OSOBA">Fizička osoba</MenuItem>
                    <MenuItem value="FIRMA">Firma</MenuItem>
                  </BaseInput>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <BaseInput
                    select
                    fullWidth
                    label="Minimalna ocjena"
                    value={String(userStore.minContractorRating)}
                    onChange={(e) => userStore.setMinContractorRating(Number(e.target.value))}
                  >
                    <MenuItem value="0">Bez ogranicenja</MenuItem>
                    <MenuItem value="3">3.0+</MenuItem>
                    <MenuItem value="4">4.0+</MenuItem>
                    <MenuItem value="4.5">4.5+</MenuItem>
                  </BaseInput>
                </Grid>
              </Grid>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <BaseButton
                  variant="contained"
                  color="primary"
                  onClick={() => userStore.saveCurrentContractorFiltersAsDefault()}
                  sx={{ fontWeight: 800, borderRadius: 999 }}
                >
                  Spremi postavke
                </BaseButton>
                <BaseButton
                  variant="outlined"
                  color="secondary"
                  onClick={() => userStore.resetContractorFilters()}
                  sx={{ fontWeight: 700, borderRadius: 999 }}
                >
                  Reset
                </BaseButton>
              </Stack>
            </Stack>
          </Paper>

          {userStore.userListError && (
            <Alert severity="error" sx={{ borderRadius: 3 }}>
              {userStore.userListError}
            </Alert>
          )}

          {userStore.isLoadingUsers && userStore.contractorProfiles.length === 0 ? (
            <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {userStore.filteredContractors.map((contractor) => {
                const averageRating = userStore.getContractorAverageRating(contractor.id);
                const reviewCount = userStore.getContractorReviewCount(contractor.id);

                return (
                  <Grid key={contractor.id} size={{ xs: 12, md: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.12),
                        bgcolor: 'background.paper',
                        backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.14)} 0%, ${theme.palette.background.paper} 48%)`,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                        '&:hover': {
                          transform: { md: 'translateY(-2px)' },
                          boxShadow: `0 14px 28px ${alpha(theme.palette.common.black, 0.06)}`,
                          borderColor: alpha(theme.palette.primary.main, 0.16),
                        },
                      }}
                    >
                      <Stack spacing={2} sx={{ height: '100%' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0 }}>
                            <ProfileAvatar displayName={contractor.displayName} imageUrl={contractor.profileImageUrl}
                              sx={{ width: 44, height: 44, bgcolor: 'primary.dark', color: 'primary.contrastText', fontWeight: 800 }} />
                            <Typography variant="h6" sx={{ fontWeight: 900, overflowWrap: 'anywhere', minWidth: 0 }}>
                              {contractor.displayName}
                            </Typography>
                          </Stack>
                          <Chip
                            icon={contractor.legalType === 'FIRMA' ? <BusinessIcon /> : <PersonIcon />}
                            label={contractor.legalType === 'FIRMA' ? 'Firma' : 'Fizička osoba'}
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                        </Stack>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {contractor.bio}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Rating value={averageRating} precision={0.1} readOnly size="small" />
                          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                            {averageRating.toFixed(1)} ({reviewCount} recenzija)
                          </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                            {contractor.location}
                          </Typography>
                        </Stack>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                          {(contractor.serviceCategories || []).map((category) => (
                            <Chip key={category} label={category} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                          ))}
                        </Box>

                        <Box sx={{ pt: 0.4, mt: 'auto' }}>
                          <BaseButton
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate(`/profil/${contractor.id}`)}
                            sx={{ minHeight: 40, borderRadius: 999, fontWeight: 800 }}
                          >
                            Otvori profil
                          </BaseButton>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Stack>
      </BaseContainer>
    </Box>
  );
});

export default ContractorDirectoryPage;
