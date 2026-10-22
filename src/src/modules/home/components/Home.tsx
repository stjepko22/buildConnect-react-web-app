import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Alert, Avatar, Box, Button, ButtonBase, IconButton, InputAdornment, Paper,
  Skeleton, Stack, ToggleButton, ToggleButtonGroup, Typography, alpha, useTheme,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import { useRootStore } from '@/core/hooks/useRootStore';
import { JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';
import HomeContractorCard from './HomeContractorCard';
import HomeJobCard from './HomeJobCard';

type SearchTarget = 'contractors' | 'jobs';

type QuickAction = {
  label: string;
  description: string;
  icon: React.ReactNode;
  tone: 'primary' | 'info' | 'success' | 'warning';
  onClick: () => void;
};

const tradeCategories: { label: string; category: JobCategory; position: string }[] = [
  { label: 'Fasaderi', category: 'Fasade', position: '0% 0%' },
  { label: 'Električari', category: 'Elektro', position: '50% 0%' },
  { label: 'Keramičari', category: 'Keramika', position: '100% 0%' },
  { label: 'Krovopokrivači', category: 'Krovovi', position: '0% 100%' },
  { label: 'Građevinari', category: 'Gradnja', position: '50% 100%' },
  { label: 'Vodoinstalateri', category: 'Vodoinstalacije', position: '100% 100%' },
];
const loadingCards = [0, 1, 2];
const contractorPluralRules = new Intl.PluralRules('hr');
const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

interface HomeSectionHeaderProps {
  id: string;
  title: string;
  to: string;
  linkLabel: string;
  icon: React.ReactNode;
}

const HomeSectionHeader: React.FC<HomeSectionHeaderProps> = ({ id, title, to, linkLabel, icon }) => (
  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 1.5 }}>
    <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
      <Box sx={{ color: 'primary.light', display: 'flex', '& .MuiSvgIcon-root': { fontSize: 22 } }}>{icon}</Box>
      <Typography component="h2" id={id} sx={{ fontSize: { xs: '1rem', sm: '1.12rem' }, fontWeight: 800, lineHeight: 1.3 }}>
        {title}
      </Typography>
    </Stack>
    <Button component={RouterLink} to={to} onClick={scrollToTop} variant="text" endIcon={<ChevronRightRoundedIcon />}
      sx={{ px: 0.5, py: 0.5, minWidth: 0, flexShrink: 0, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
      {linkLabel}
    </Button>
  </Stack>
);

const Home: React.FC = observer(() => {
  const { authenticationStore, homeStore } = useRootStore();
  const theme = useTheme();
  const navigate = useNavigate();
  const user = authenticationStore.user;
  const profile = homeStore.ownProfile?.id === user?.id ? homeStore.ownProfile : null;
  const [searchValue, setSearchValue] = useState('');
  const [searchTarget, setSearchTarget] = useState<SearchTarget>('contractors');

  useEffect(() => {
    void homeStore.loadJobs();
    void homeStore.loadContractors();
  }, [homeStore]);

  useEffect(() => {
    void homeStore.loadOwnProfile(user?.id);
  }, [homeStore, user?.id]);

  const navigateWithScroll = useCallback((path: string) => {
    navigate(path);
    scrollToTop();
  }, [navigate]);

  const openLogin = useCallback(() => authenticationStore.setLoginDialogOpen(true), [authenticationStore]);
  const retryJobs = useCallback(() => { void homeStore.loadJobs(); }, [homeStore]);
  const retryContractors = useCallback(() => { void homeStore.loadContractors(); }, [homeStore]);
  const retryProfile = useCallback(() => { void homeStore.loadOwnProfile(user?.id); }, [homeStore, user?.id]);

  const handleSearchTargetChange = (_event: React.MouseEvent<HTMLElement>, value: SearchTarget | null) => {
    if (value) setSearchTarget(value);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = new URLSearchParams();
    if (searchValue.trim()) query.set('q', searchValue.trim());
    const target = searchTarget === 'contractors' ? '/izvodjaci' : '/marketplace';
    navigateWithScroll(query.size ? `${target}?${query.toString()}` : target);
  };

  const quickActions = useMemo<QuickAction[]>(() => [
    {
      label: 'Pronađi izvođača', description: 'Majstori i stručnjaci', icon: <EngineeringRoundedIcon />, tone: 'primary',
      onClick: () => navigateWithScroll('/izvodjaci'),
    },
    {
      label: 'Firme i kooperanti', description: 'Partneri za suradnju', icon: <HandshakeRoundedIcon />, tone: 'info',
      onClick: () => navigateWithScroll('/izvodjaci?legalType=FIRMA'),
    },
    {
      label: 'Pronađi posao', description: 'Otvoreni oglasi', icon: <WorkOutlineRoundedIcon />, tone: 'success',
      onClick: () => navigateWithScroll('/marketplace'),
    },
    {
      label: user?.role === 'IZVODJAC' ? 'Moje ponude' : 'Objavi posao',
      description: user?.role === 'IZVODJAC' ? 'Prati svoje prijave' : 'Pronađi pravu ekipu',
      icon: <PostAddRoundedIcon />, tone: 'warning',
      onClick: () => {
        if (!user) { openLogin(); return; }
        navigateWithScroll(user.role === 'IZVODJAC' ? '/moji-poslovi' : '/objavi-posao');
      },
    },
  ], [navigateWithScroll, openLogin, user]);

  const profileInitials = (profile?.displayName || user?.displayName || '')
    .split(' ').filter(Boolean).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase();

  return (
    <Box sx={{ py: { xs: 2, md: 3.5 }, pb: { xs: 3, md: 5 } }}>
      <BaseContainer maxWidth="xl" disableGutters animate={false}>
        <Stack spacing={{ xs: 2.5, md: 3 }} sx={{ px: { xs: 1.5, sm: 3, lg: 4 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(280px, 380px)' }, gap: 2.5, alignItems: 'center' }}>
            <Box sx={{ display: { xs: user ? 'none' : 'block', md: 'block' } }}>
              <Typography sx={{ mb: 0.75, color: 'primary.light', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Gradimo bolje zajedno
              </Typography>
              <Typography component="h1" sx={{ fontWeight: 900, fontSize: { xs: '1.55rem', sm: '1.9rem', lg: '2.15rem' }, lineHeight: 1.2, letterSpacing: '-0.035em' }}>
                {user ? 'Tvoja sljedeća suradnja počinje ovdje.' : 'Pronađi prave ljude za svoj projekt.'}
              </Typography>
              <Typography sx={{ mt: 0.8, color: 'text.secondary', fontSize: { xs: '0.85rem', sm: '0.95rem' }, lineHeight: 1.6 }}>
                Izvođači, poslovi i nove prilike na jednom mjestu.
              </Typography>
              {!user && <Button component={RouterLink} to="/register" onClick={scrollToTop} endIcon={<ArrowForwardRoundedIcon />} sx={{ display: { xs: 'inline-flex', md: 'none' }, px: 0, mt: 0.5, minHeight: 36 }}>Otvori svoj profil</Button>}
            </Box>

            {user ? (
              <Stack spacing={1}>
                <Paper variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden', borderColor: alpha(theme.palette.primary.light, 0.25) }}>
                  <ButtonBase component={RouterLink} to={`/profil/${user.id}`} onClick={scrollToTop}
                    aria-label="Otvori moj profil" sx={{ p: 1.75, width: '100%', textAlign: 'left', justifyContent: 'flex-start', gap: 1.5 }}>
                    <Avatar sx={{ width: 48, height: 48, borderRadius: 1, bgcolor: alpha(theme.palette.primary.main, 0.18), color: 'primary.light', fontWeight: 800 }}>
                      {profileInitials}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography noWrap sx={{ fontWeight: 800, fontSize: '0.9rem' }}>{profile?.displayName || user.displayName}</Typography>
                      {homeStore.isLoadingProfile ? <Skeleton width="65%" /> : (
                        <Stack direction="row" alignItems="center" spacing={0.4} sx={{ mt: 0.4, color: 'text.secondary' }}>
                          {profile?.location && <LocationOnOutlinedIcon sx={{ fontSize: 14 }} />}
                          <Typography noWrap sx={{ fontSize: '0.73rem' }}>{profile?.location || 'Pregledaj i uredi svoj profil'}</Typography>
                        </Stack>
                      )}
                      <Typography sx={{ mt: 0.5, color: 'primary.light', fontSize: '0.67rem', fontWeight: 700 }}>
                        {user.role === 'INVESTITOR' ? 'Investitor' : 'Izvođač'} · Moj profil
                      </Typography>
                    </Box>
                    <ChevronRightRoundedIcon sx={{ color: 'text.secondary' }} />
                  </ButtonBase>
                </Paper>
                {homeStore.profileError && <Alert severity="warning" action={<BaseButton onClick={retryProfile} size="small">Ponovi</BaseButton>}>{homeStore.profileError}</Alert>}
              </Stack>
            ) : (
              <Paper variant="outlined" sx={{ display: { xs: 'none', md: 'block' }, p: 2, borderRadius: 1.5, borderColor: alpha(theme.palette.primary.light, 0.2), backgroundImage: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.12)}, transparent)` }}>
                <Typography sx={{ fontSize: '0.94rem', fontWeight: 800 }}>Predstavi se budućim suradnicima</Typography>
                <Typography sx={{ mt: 0.5, mb: 1.5, fontSize: '0.8rem', color: 'text.secondary' }}>Otvori profil i poveži se s ljudima iz struke.</Typography>
                <Button component={RouterLink} to="/register" onClick={scrollToTop} variant="contained" size="small" endIcon={<ArrowForwardRoundedIcon />} sx={{ px: 2, minHeight: 40 }}>
                  Registriraj se
                </Button>
              </Paper>
            )}
          </Box>

          <Box aria-label="Brzi pristup" sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: { xs: 0.9, sm: 1.5 } }}>
            {quickActions.map((action, index) => (
              <ButtonBase key={action.label} onClick={action.onClick}
                sx={{ flexDirection: 'column', justifyContent: 'center', gap: { xs: 0.75, sm: 1 }, minHeight: { xs: 96, sm: 112 }, p: { xs: 0.8, sm: 1.75 },
                  borderRadius: 1.25, border: '1px solid', borderColor: index === 0 ? 'primary.main' : alpha(theme.palette[action.tone].main, 0.3),
                  bgcolor: index === 0 ? 'primary.main' : 'background.paper', color: index === 0 ? 'primary.contrastText' : 'text.primary',
                  transition: theme.transitions.create(['background-color', 'border-color']),
                  '&:hover': { bgcolor: index === 0 ? 'primary.dark' : alpha(theme.palette[action.tone].main, 0.12), borderColor: theme.palette[action.tone].light },
                  '&.Mui-focusVisible': { outline: `2px solid ${theme.palette.primary.light}`, outlineOffset: 3 } }}>
                <Box sx={{ display: 'flex', color: index === 0 ? 'inherit' : theme.palette[action.tone].light, '& .MuiSvgIcon-root': { fontSize: { xs: 26, sm: 30 } } }}>{action.icon}</Box>
                <Typography sx={{ fontSize: { xs: '0.68rem', sm: '0.86rem' }, fontWeight: 800, lineHeight: 1.3, minHeight: { xs: '1.8rem', sm: 'auto' } }}>{action.label}</Typography>
                <Typography sx={{ display: { xs: 'none', md: 'block' }, fontSize: '0.74rem', color: index === 0 ? 'inherit' : 'text.secondary', opacity: 0.85 }}>{action.description}</Typography>
              </ButtonBase>
            ))}
          </Box>

          <Paper component="form" onSubmit={handleSearch} role="search" aria-label="Pretraga izvođača i poslova" variant="outlined" sx={{ p: { xs: 1.25, sm: 1.5 }, borderRadius: 1.5 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ sm: 'center' }}>
              <ToggleButtonGroup color="primary" size="small" value={searchTarget} exclusive onChange={handleSearchTargetChange} aria-label="Vrsta pretrage" sx={{ flexShrink: 0, '& .MuiToggleButton-root': { px: 1.5, py: 0.7, flex: { xs: 1, sm: 'initial' }, fontWeight: 700, textTransform: 'none' } }}>
                <ToggleButton value="contractors">Izvođači</ToggleButton>
                <ToggleButton value="jobs">Poslovi</ToggleButton>
              </ToggleButtonGroup>
              <BaseInput value={searchValue} onChange={(event) => setSearchValue(event.target.value)}
                placeholder={searchTarget === 'contractors' ? 'Pretraži po nazivu, usluzi ili lokaciji...' : 'Pretraži poslove po nazivu ili lokaciji...'}
                sx={{ flex: 1, '& .MuiOutlinedInput-root': { minHeight: 48 }, '& .MuiInputBase-input': { py: 1.25, fontSize: '0.84rem' } }}
                slotProps={{ htmlInput: { 'aria-label': searchTarget === 'contractors' ? 'Pretraži izvođače' : 'Pretraži poslove' }, input: {
                  startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 22 }} /></InputAdornment>,
                  endAdornment: <InputAdornment position="end"><IconButton type="submit" aria-label="Pretraži" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 34, height: 34, '&:hover': { bgcolor: 'primary.dark' } }}><ArrowForwardRoundedIcon sx={{ fontSize: 19 }} /></IconButton></InputAdornment>,
                } }} />
            </Stack>
          </Paper>

          <Box component="section" aria-labelledby="home-trades-title" sx={{ minWidth: 0 }}>
            <HomeSectionHeader id="home-trades-title" title="Specijalizirani izvođači" to="/izvodjaci" linkLabel="Sve djelatnosti" icon={<ConstructionRoundedIcon />} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(6, 112px)', sm: 'repeat(6, minmax(0, 1fr))' }, gap: { xs: 1, sm: 1.5 }, overflowX: 'auto', pb: 0.75, scrollSnapType: 'x mandatory', '&::-webkit-scrollbar': { height: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 1 } }}>
              {tradeCategories.map((trade) => {
                const count = homeStore.contractorCountsByCategory[trade.category] ?? 0;
                return (
                  <ButtonBase key={trade.category} component={RouterLink} to={`/izvodjaci?category=${encodeURIComponent(trade.category)}`} onClick={scrollToTop}
                    aria-label={`Pronađi izvođače: ${trade.label}`} sx={{ flexDirection: 'column', alignItems: 'stretch', textAlign: 'left', borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: alpha(theme.palette.divider, 0.7), bgcolor: 'background.paper', scrollSnapAlign: 'start', '&:hover': { borderColor: 'primary.light' }, '&.Mui-focusVisible': { outline: `2px solid ${theme.palette.primary.light}`, outlineOffset: -2 } }}>
                    <Box aria-hidden="true" sx={{ height: { xs: 76, sm: 100, md: 120, lg: 136 }, overflow: 'hidden' }}>
                      <Box sx={{ width: '100%', aspectRatio: '1 / 1', transform: 'translateY(-12%)', backgroundImage: 'url(/images/home/trades-grid.jpg)', backgroundSize: '300% 200%', backgroundPosition: trade.position }} />
                    </Box>
                    <Box sx={{ p: { xs: 0.9, sm: 1.25 } }}>
                      <Typography noWrap sx={{ fontSize: { xs: '0.74rem', sm: '0.84rem' }, fontWeight: 800 }}>{trade.label}</Typography>
                      {homeStore.isLoadingContractors ? <Skeleton width={55} height={18} /> : (
                        <Typography sx={{ mt: 0.25, fontSize: '0.68rem', color: 'text.secondary' }}>
                          {homeStore.contractorsError ? 'Pogledaj izvođače' : `${count} ${contractorPluralRules.select(count) === 'one' ? 'izvođač' : 'izvođača'}`}
                        </Typography>
                      )}
                    </Box>
                  </ButtonBase>
                );
              })}
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.5fr) minmax(0, 1fr)' }, gap: { xs: 3, md: 3.5 }, alignItems: 'start' }}>
            <Box component="section" aria-labelledby="home-jobs-title" sx={{ minWidth: 0 }}>
              <HomeSectionHeader id="home-jobs-title" title="Najnoviji otvoreni poslovi" to="/marketplace" linkLabel="Svi poslovi" icon={<WorkOutlineRoundedIcon />} />
              <Stack spacing={1.25}>
                {homeStore.isLoadingJobs ? loadingCards.map((key) => <Skeleton key={key} variant="rounded" height={142} sx={{ borderRadius: 2 }} />)
                  : homeStore.jobsError ? <Alert severity="error" action={<BaseButton onClick={retryJobs} size="small">Ponovi</BaseButton>}>{homeStore.jobsError}</Alert>
                    : homeStore.latestOpenJobs.length > 0 ? homeStore.latestOpenJobs.map((job) => <HomeJobCard key={job.id} job={job} />)
                      : <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}><Typography sx={{ fontWeight: 700 }}>Trenutno nema otvorenih oglasa.</Typography><Typography sx={{ mt: 0.75, color: 'text.secondary', fontSize: '0.83rem' }}>Nove prilike pojavit će se ovdje čim budu objavljene.</Typography></Paper>}
              </Stack>
            </Box>

            <Stack spacing={2.5} sx={{ minWidth: 0 }}>
              <Box component="section" aria-labelledby="home-contractors-title">
                <HomeSectionHeader id="home-contractors-title" title="Iz direktorija izvođača" to="/izvodjaci" linkLabel="Svi izvođači" icon={<BusinessRoundedIcon />} />
                <Stack spacing={1.25}>
                  {homeStore.isLoadingContractors ? loadingCards.map((key) => <Skeleton key={key} variant="rounded" height={120} sx={{ borderRadius: 2 }} />)
                    : homeStore.contractorsError ? <Alert severity="error" action={<BaseButton onClick={retryContractors} size="small">Ponovi</BaseButton>}>{homeStore.contractorsError}</Alert>
                      : homeStore.featuredContractors.length > 0 ? homeStore.featuredContractors.map((contractor) => <HomeContractorCard key={contractor.id} contractor={contractor} />)
                        : <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}><Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>Izvođači će se prikazati ovdje nakon registracije.</Typography></Paper>}
                </Stack>
              </Box>
              {user && (
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5, borderColor: alpha(theme.palette.primary.light, 0.2), bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.94rem' }}>Sve tvoje suradnje na jednom mjestu</Typography>
                  <Typography sx={{ mt: 0.75, mb: 1.25, color: 'text.secondary', fontSize: '0.8rem', lineHeight: 1.6 }}>Vrati se svojim poslovima, ponudama i pregledu aktivnosti.</Typography>
                  <Button component={RouterLink} to="/dashboard" onClick={scrollToTop} variant="outlined" endIcon={<ArrowForwardRoundedIcon />} sx={{ px: 1.5, minHeight: 40 }}>Otvori moj pregled</Button>
                </Paper>
              )}
            </Stack>
          </Box>
        </Stack>
      </BaseContainer>
    </Box>
  );
});

export default Home;
