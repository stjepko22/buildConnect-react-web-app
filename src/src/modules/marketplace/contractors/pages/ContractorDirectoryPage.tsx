import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useSearchParams } from 'react-router-dom';
import {
  Alert, Autocomplete, Box, Button, Checkbox, Chip, Grid, IconButton, InputAdornment,
  MenuItem, Paper, Skeleton, Stack, ToggleButton, ToggleButtonGroup, Typography, alpha,
} from '@mui/material';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import debounce from 'lodash/debounce';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import { useRootStore } from '@/core/hooks/useRootStore';
import ContractorCard from '@/modules/marketplace/contractors/components/ContractorCard';
import { JOB_CATEGORIES, JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';
import { LegalType } from '@/modules/user/models/LegalType';
import { ContractorSort } from '@/modules/user/stores/UserStore';

const loadingCards = [0, 1, 2, 3];
const contractorPluralRules = new Intl.PluralRules('hr');

const ContractorDirectoryPage: React.FC = observer(() => {
  const { userStore, reviewStore, authenticationStore } = useRootStore();
  const [searchParams] = useSearchParams();
  const [locationInput, setLocationInput] = useState('');
  const [hasSavedCategories, setHasSavedCategories] = useState(false);
  const debouncedSearch = useMemo(
    () => debounce(userStore.setContractorSearchQuery, 300), [userStore]
  );
  const debouncedLocation = useMemo(
    () => debounce((value: string) => userStore.setSelectedContractorLocation(value.trim()), 300), [userStore]
  );

  useEffect(() => {
    debouncedSearch.cancel();
    debouncedLocation.cancel();
    userStore.resetContractorFilters();
    userStore.initializeContractorFiltersForCurrentUser();
    const hasRouteFilters = ['q', 'category', 'legalType', 'location'].some((key) => searchParams.has(key));
    if (hasRouteFilters) {
      const query = searchParams.get('q')?.trim() || '';
      const legalType = searchParams.get('legalType');
      const categories = Array.from(new Set(searchParams.getAll('category')
        .filter((value): value is JobCategory => JOB_CATEGORIES.includes(value as JobCategory))));
      userStore.setContractorSearchInputValue(query);
      userStore.setContractorSearchQuery(query);
      userStore.setSelectedContractorCategories(categories);
      userStore.setSelectedContractorLegalType(legalType === 'FIRMA' || legalType === 'FIZICKA_OSOBA' ? legalType : 'ALL');
      userStore.setSelectedContractorLocation(searchParams.get('location')?.trim() || '');
    }
    setLocationInput(userStore.selectedContractorLocation);
    setHasSavedCategories(false);
    return () => { debouncedSearch.cancel(); debouncedLocation.cancel(); };
  }, [debouncedLocation, debouncedSearch, searchParams, userStore]);

  useEffect(() => { void reviewStore.loadReviews(); }, [reviewStore]);

  const loadContractors = () => userStore.loadContractors({
    q: userStore.contractorSearchQuery.trim() || undefined,
    category: userStore.selectedContractorCategories.length ? userStore.selectedContractorCategories : undefined,
    location: userStore.selectedContractorLocation || undefined,
    legalType: userStore.selectedContractorLegalType === 'ALL' ? undefined : userStore.selectedContractorLegalType,
  });

  useEffect(() => {
    void userStore.loadContractors({
      q: userStore.contractorSearchQuery.trim() || undefined,
      category: userStore.selectedContractorCategories.length ? userStore.selectedContractorCategories : undefined,
      location: userStore.selectedContractorLocation || undefined,
      legalType: userStore.selectedContractorLegalType === 'ALL' ? undefined : userStore.selectedContractorLegalType,
    });
  }, [userStore, userStore.contractorSearchQuery, userStore.selectedContractorCategories,
    userStore.selectedContractorLocation, userStore.selectedContractorLegalType]);

  const clearSearch = () => {
    debouncedSearch.cancel();
    userStore.setContractorSearchInputValue('');
    userStore.setContractorSearchQuery('');
  };
  const clearLocation = () => {
    debouncedLocation.cancel();
    setLocationInput('');
    userStore.setSelectedContractorLocation('');
  };
  const resetFilters = () => {
    debouncedSearch.cancel();
    debouncedLocation.cancel();
    userStore.resetContractorFilters();
    setLocationInput('');
    setHasSavedCategories(false);
  };
  const isLoading = userStore.isLoadingContractors || reviewStore.isLoadingReviews;
  const hasRatings = !reviewStore.isLoadingReviews && !reviewStore.reviewListError;
  const contractors = userStore.filteredContractors;
  const contractorLabel = contractorPluralRules.select(contractors.length) === 'one' ? 'izvođač' : 'izvođača';
  const hasActiveFilters = Boolean(userStore.contractorSearchInputValue.trim() || locationInput.trim()
    || userStore.selectedContractorCategories.length || userStore.selectedContractorLegalType !== 'ALL'
    || userStore.minContractorRating);

  return (
    <BaseContainer maxWidth={false} disableGutters animate={false}>
      <Stack spacing={2.5} sx={{ pb: { xs: 2, md: 4 } }}>
        <Paper component="header" variant="outlined" sx={{
          p: { xs: 2, sm: 3 }, borderRadius: 2,
          backgroundImage: (theme) => `linear-gradient(115deg, ${alpha(theme.palette.primary.main, 0.2)}, ${theme.palette.background.paper} 75%)`,
        }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ display: 'grid', placeItems: 'center', width: 48, height: 48, flexShrink: 0,
              borderRadius: 1.5, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              <EngineeringRoundedIcon fontSize="large" />
            </Box>
            <Box>
              <Typography component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 800, lineHeight: 1.2 }}>
                Pronađi izvođača
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mt: 0.75, lineHeight: 1.6 }}>
                Firme, majstori i stručnjaci za vaš sljedeći projekt.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper component="section" aria-label="Pretraga i filtri izvođača" variant="outlined" sx={{ p: { xs: 1.5, sm: 2.5 }, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Box component="form" role="search" onSubmit={(event: React.FormEvent) => {
              event.preventDefault(); debouncedSearch.flush(); debouncedLocation.flush();
            }}>
              <BaseInput size="small" placeholder="Naziv, usluga ili lokacija…"
                value={userStore.contractorSearchInputValue}
                onChange={(event) => {
                  userStore.setContractorSearchInputValue(event.target.value);
                  debouncedSearch(event.target.value);
                }}
                slotProps={{
                  htmlInput: { 'aria-label': 'Pretraži izvođače po nazivu, usluzi ili lokaciji' },
                  input: {
                    startAdornment: <InputAdornment position="start"><SearchRoundedIcon color="action" /></InputAdornment>,
                    endAdornment: userStore.contractorSearchInputValue ? (
                      <InputAdornment position="end"><IconButton size="small" aria-label="Očisti pretragu" onClick={clearSearch}><CloseRoundedIcon fontSize="small" /></IconButton></InputAdornment>
                    ) : undefined,
                  },
                }} />
            </Box>

            <ToggleButtonGroup value={userStore.selectedContractorLegalType} exclusive fullWidth color="primary"
              aria-label="Tip izvođača" onChange={(_event, value: 'ALL' | LegalType | null) => {
                if (value) userStore.setSelectedContractorLegalType(value);
              }} sx={{ '& .MuiToggleButton-root': { flex: 1, minWidth: 0, minHeight: 44, px: 0.5,
                fontSize: { xs: '0.78rem', sm: '0.875rem' }, lineHeight: 1.3, fontWeight: 750,
                '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } } } }}>
              <ToggleButton value="ALL">Svi</ToggleButton>
              <ToggleButton value="FIRMA">Firme</ToggleButton>
              <ToggleButton value="FIZICKA_OSOBA">Fizičke osobe</ToggleButton>
            </ToggleButtonGroup>

            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6, sm: 4 }} sx={{ minWidth: 0 }}>
                <Autocomplete freeSolo options={userStore.contractorLocations}
                  value={userStore.selectedContractorLocation || null} inputValue={locationInput}
                  onInputChange={(_event, value, reason) => {
                    if (reason === 'input' || reason === 'clear') { setLocationInput(value); debouncedLocation(value); }
                  }}
                  onChange={(_event, value) => {
                    debouncedLocation.cancel(); setLocationInput(value || ''); userStore.setSelectedContractorLocation(value?.trim() || '');
                  }}
                  clearText="Očisti lokaciju" openText="Prikaži lokacije" closeText="Zatvori lokacije"
                  renderInput={(params) => <BaseInput {...params} label="Lokacija" placeholder="Sve lokacije" helperText="Puni naziv mjesta" size="small" slotProps={{ inputLabel: { shrink: true } }} />} />
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }} sx={{ minWidth: 0 }}>
                <BaseInput select size="small" label="Djelatnost" value={userStore.selectedContractorCategories}
                  onChange={(event) => {
                    const categories = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
                    userStore.setSelectedContractorCategories(categories as JobCategory[]);
                    setHasSavedCategories(false);
                  }} slotProps={{ inputLabel: { shrink: true }, select: {
                    multiple: true, displayEmpty: true,
                    renderValue: (value) => {
                      const categories = value as JobCategory[];
                      return categories.length === 0 ? 'Sve djelatnosti' : categories.length === 1 ? categories[0] : `Odabrano: ${categories.length}`;
                    },
                  } }}>
                  {userStore.availableServiceCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      <Checkbox checked={userStore.selectedContractorCategories.includes(category)} size="small" sx={{ p: 0.5, mr: 1 }} />{category}
                    </MenuItem>
                  ))}
                </BaseInput>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <BaseInput select size="small" label="Minimalna ocjena" value={userStore.minContractorRating}
                  disabled={!hasRatings} onChange={(event) => userStore.setMinContractorRating(Number(event.target.value))}>
                  <MenuItem value={0}>Sve ocjene</MenuItem><MenuItem value={3}>3,0 i više</MenuItem>
                  <MenuItem value={4}>4,0 i više</MenuItem><MenuItem value={4.5}>4,5 i više</MenuItem>
                </BaseInput>
              </Grid>
            </Grid>

            {hasActiveFilters && (
              <Stack direction="row" useFlexGap flexWrap="wrap" gap={0.75} aria-label="Aktivni filtri">
                {userStore.contractorSearchQuery.trim() && <Chip size="small" label={`Pretraga: ${userStore.contractorSearchQuery.trim()}`} onDelete={clearSearch} sx={{ maxWidth: '100%' }} />}
                {userStore.selectedContractorCategories.map((category) => <Chip key={category} size="small" color="primary" variant="outlined" label={category} onDelete={() => {
                  userStore.toggleSelectedContractorCategory(category); setHasSavedCategories(false);
                }} />)}
                {userStore.selectedContractorLegalType !== 'ALL' && <Chip size="small" label={userStore.selectedContractorLegalType === 'FIRMA' ? 'Firme' : 'Fizičke osobe'} onDelete={() => userStore.setSelectedContractorLegalType('ALL')} />}
                {userStore.selectedContractorLocation && <Chip size="small" label={userStore.selectedContractorLocation} onDelete={clearLocation} sx={{ maxWidth: '100%' }} />}
                {userStore.minContractorRating > 0 && hasRatings && <Chip size="small" label={`Ocjena ${userStore.minContractorRating.toLocaleString('hr')}+`} onDelete={() => userStore.setMinContractorRating(0)} />}
              </Stack>
            )}
            {(hasActiveFilters || authenticationStore.user) && (
              <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} justifyContent="space-between">
                {hasActiveFilters && <Button size="small" onClick={resetFilters} startIcon={<RefreshRoundedIcon />}>Očisti filtre</Button>}
                {authenticationStore.user && <Button size="small" startIcon={<BookmarkBorderRoundedIcon />} onClick={() => {
                  userStore.saveCurrentContractorFiltersAsDefault(); setHasSavedCategories(true);
                }}>Zapamti djelatnosti</Button>}
              </Stack>
            )}
            {hasSavedCategories && <Alert severity="success" onClose={() => setHasSavedCategories(false)}>Djelatnosti su zapamćene za ovu sesiju.</Alert>}
          </Stack>
        </Paper>

        {reviewStore.reviewListError && <Alert severity="warning" action={<Button color="inherit" size="small" onClick={() => { void reviewStore.loadReviews(); }}>Pokušaj ponovno</Button>}>
          Ocjene trenutačno nisu dostupne. Izvođači su prikazani bez filtriranja po ocjeni.
        </Alert>}

        <Box component="section" aria-label="Rezultati pretrage izvođača" aria-busy={isLoading}>
          <Stack direction="row" useFlexGap flexWrap="wrap" gap={1.5} alignItems="center" justifyContent="space-between" sx={{ mb: 1.75 }}>
            <Typography role="status" aria-live="polite" variant="body2" color="text.secondary" sx={{ fontWeight: 650 }}>
              {isLoading ? 'Učitavanje izvođača…' : userStore.contractorListError ? 'Rezultati pretrage' : `${contractors.length} ${contractorLabel}`}
            </Typography>
            <BaseInput select size="small" label="Poredaj po" value={hasRatings ? userStore.contractorSort : 'name'}
              onChange={(event) => userStore.setContractorSort(event.target.value as ContractorSort)} sx={{ width: 190, maxWidth: '100%' }}>
              <MenuItem value="rating" disabled={!hasRatings}>Najbolje ocjene</MenuItem>
              <MenuItem value="reviews" disabled={!hasRatings}>Najviše recenzija</MenuItem>
              <MenuItem value="name">Naziv A–Ž</MenuItem>
            </BaseInput>
          </Stack>
          {userStore.contractorListError ? (
            <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => { void loadContractors(); }}>Pokušaj ponovno</Button>}>
              {userStore.contractorListError}
            </Alert>
          ) : isLoading ? (
            <Grid container spacing={1.5} aria-label="Učitavanje izvođača">
              {loadingCards.map((id) => <Grid key={id} size={{ xs: 12, lg: 6 }}><Skeleton variant="rounded" height={206} sx={{ borderRadius: 1.5 }} /></Grid>)}
            </Grid>
          ) : contractors.length === 0 ? (
            <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, borderRadius: 2, textAlign: 'center' }}>
              <SearchOffRoundedIcon sx={{ fontSize: 44, color: 'primary.light', mb: 1 }} />
              <Typography component="h2" variant="h6" fontWeight={750}>Nema izvođača za odabrane filtre</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>Pokušajte s drugim nazivom, lokacijom ili djelatnosti.</Typography>
              {hasActiveFilters && <Button variant="outlined" onClick={resetFilters}>Očisti filtre</Button>}
            </Paper>
          ) : (
            <Grid container spacing={1.5}>
              {contractors.map((contractor) => <Grid key={contractor.id} size={{ xs: 12, lg: 6 }} sx={{ minWidth: 0 }}>
                <ContractorCard contractor={contractor}
                  averageRating={hasRatings ? userStore.getContractorAverageRating(contractor.id) : undefined}
                  reviewCount={hasRatings ? userStore.getContractorReviewCount(contractor.id) : undefined} />
              </Grid>)}
            </Grid>
          )}
        </Box>
      </Stack>
    </BaseContainer>
  );
});

export default ContractorDirectoryPage;
