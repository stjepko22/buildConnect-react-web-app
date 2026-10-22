import React, { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import ElectricBoltRoundedIcon from '@mui/icons-material/ElectricBoltRounded';
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PlumbingRoundedIcon from '@mui/icons-material/PlumbingRounded';
import RoofingRoundedIcon from '@mui/icons-material/RoofingRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import { useRootStore } from '@/core/hooks/useRootStore';
import { JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';

type QuickAction = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

type ContractorShortcut = {
  label: string;
  category: JobCategory;
  icon: React.ReactNode;
};

type DesktopFeature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type DesktopHighlight = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

const HOME_CONTENT_WIDTH = { xs: 412, sm: 440, md: '100%' };
const HOME_CONTENT_PADDING = { xs: 1.5, sm: 2, md: 2.25, lg: 2.75 };

const contractorShortcuts: ContractorShortcut[] = [
  { label: 'Gradnja', category: 'Gradnja', icon: <EngineeringRoundedIcon /> },
  { label: 'Fasade', category: 'Fasade', icon: <ApartmentRoundedIcon /> },
  { label: 'Krovovi', category: 'Krovovi', icon: <RoofingRoundedIcon /> },
  { label: 'Keramika', category: 'Keramika', icon: <ViewInArRoundedIcon /> },
  { label: 'Elektro', category: 'Elektro', icon: <ElectricBoltRoundedIcon /> },
  { label: 'Voda', category: 'Vodoinstalacije', icon: <PlumbingRoundedIcon /> },
];

const desktopFeatures: DesktopFeature[] = [
  {
    title: 'Marketplace poslova',
    description: 'Otvorite aktivne projekte i filtrirajte oglase u par klikova.',
    icon: <StorefrontRoundedIcon />,
  },
  {
    title: 'Provjereni izvođači',
    description: 'Brze do specijaliziranih firmi, timova i kooperanata.',
    icon: <EngineeringRoundedIcon />,
  },
  {
    title: 'Suradnje i ponude',
    description: 'Sve komunikacije, ponude i profili ostaju na jednom mjestu.',
    icon: <HandshakeRoundedIcon />,
  },
];

const desktopHighlights: DesktopHighlight[] = [
  {
    value: '6',
    label: 'brzih ulaza',
    icon: <InsightsRoundedIcon />,
  },
  {
    value: '1 klik',
    label: 'do usluge',
    icon: <SearchRoundedIcon />,
  },
];

const guestDesktopFeatures: DesktopFeature[] = [
  {
    title: 'Otvorite projekt',
    description: 'Investitori brzo objavljuju potrebu i usmjeravaju projekt prema pravim timovima.',
    icon: <StorefrontRoundedIcon />,
  },
  {
    title: 'Pronađite izvođače',
    description: 'Direktorij ostaje jasan, pregledan i odmah spreman za filtriranje po usluzi.',
    icon: <EngineeringRoundedIcon />,
  },
  {
    title: 'Usporedite suradnje',
    description: 'Ponude, profili i daljnji dogovor dolaze tek kad imate pravi kontekst posla.',
    icon: <HandshakeRoundedIcon />,
  },
];

const guestDesktopHighlights: DesktopHighlight[] = [
  {
    value: 'Investitori',
    label: 'objavljuju projekte',
    icon: <AssignmentTurnedInRoundedIcon />,
  },
  {
    value: 'Izvođači',
    label: 'grade vidljiv profil',
    icon: <EngineeringRoundedIcon />,
  },
];

const guestDesktopBadges = ['Za investitore', 'Za izvođače', 'Javni pregled platforme'];

const Home: React.FC = observer(() => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { authenticationStore } = useRootStore();
  const user = authenticationStore.user;
  const [searchValue, setSearchValue] = useState('');

  const openLogin = useCallback(() => {
    authenticationStore.setLoginDialogOpen(true);
  }, [authenticationStore]);

  const navigateWithScroll = useCallback((path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [navigate]);

  const buildPathWithParams = (basePath: string, params: Record<string, string | undefined>) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value && value.trim().length > 0) {
        query.set(key, value);
      }
    });

    const queryString = query.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const handleSearch = (target: 'jobs' | 'contractors') => {
    const query = searchValue.trim();
    const path = target === 'jobs'
      ? buildPathWithParams('/marketplace', { q: query })
      : buildPathWithParams('/izvodjaci', { q: query });

    navigateWithScroll(path);
  };

  const quickActions = useMemo<QuickAction[]>(() => {
    const profilePath = user ? `/profil/${user.id}` : '';

    return [
      {
        label: 'Glavni izvođači',
        icon: <BusinessRoundedIcon />,
        onClick: () => navigateWithScroll('/izvodjaci'),
      },
      {
        label: 'Trazim kooperanta',
        icon: <ApartmentRoundedIcon />,
        onClick: () => navigateWithScroll('/izvodjaci?legalType=FIRMA'),
      },
      {
        label: 'Pronađi posao',
        icon: <SearchRoundedIcon />,
        onClick: () => navigateWithScroll('/marketplace'),
      },
      {
        label: 'Projekti u toku',
        icon: <AssignmentTurnedInRoundedIcon />,
        onClick: () => {
          if (!user) {
            openLogin();
            return;
          }

          navigateWithScroll('/dashboard');
        },
      },
      {
        label: user?.role === 'INVESTITOR' ? 'Objavi posao' : 'Moj panel',
        icon: <EngineeringRoundedIcon />,
        onClick: () => {
          if (!user) {
            openLogin();
            return;
          }

          navigateWithScroll(user.role === 'INVESTITOR' ? '/objavi-posao' : '/dashboard');
        },
      },
      {
        label: user ? 'Moj profil' : 'Prijava',
        icon: <PersonRoundedIcon />,
        onClick: () => {
          if (!user) {
            openLogin();
            return;
          }

          navigateWithScroll(profilePath);
        },
      },
    ];
  }, [navigateWithScroll, openLogin, user]);

  const desktopPanelContent = useMemo(() => {
    if (user) {
      return {
        eyebrow: 'Radni prostor',
        title: user.role === 'INVESTITOR'
          ? 'Kontrolirajte objave, ponude i suradnje iz jednog pregleda'
          : 'Pratite poslove, ponude i profil kroz jedan profesionalni workspace',
        description: user.role === 'INVESTITOR'
          ? 'Brzo objavite novi posao, vratite se na aktivne projekte ili otvorite svoj profil investitora.'
          : 'Otvorite dashboard, pronađite nove prilike i održavajte profil izvođača uvijek spremnim za sljedeći posao.',
        primaryLabel: user.role === 'INVESTITOR' ? 'Objavi posao' : 'Otvori dashboard',
        primaryAction: () => navigateWithScroll(user.role === 'INVESTITOR' ? '/objavi-posao' : '/dashboard'),
        secondaryLabel: 'Moj profil',
        secondaryAction: () => navigateWithScroll(`/profil/${user.id}`),
        secondaryIcon: <PersonRoundedIcon sx={{ fontSize: 18 }} />,
      };
    }

    return {
      eyebrow: 'Javna platforma',
      title: 'Jedno mjesto za projekte, izvođače i ozbiljne građevinske suradnje',
      description: 'Pregledajte marketplace i direktorij bez zatvorenog app iskustva, a registracijom otključajte objave, ponude i puni BuildConnect workspace.',
      primaryLabel: 'Registriraj se',
      primaryAction: () => navigateWithScroll('/register'),
      secondaryLabel: 'Prijava',
      secondaryAction: openLogin,
      secondaryIcon: <LoginRoundedIcon sx={{ fontSize: 18 }} />,
    };
  }, [navigateWithScroll, openLogin, user]);

  const desktopFeatureItems = user ? desktopFeatures : guestDesktopFeatures;
  const desktopHighlightItems = user ? desktopHighlights : guestDesktopHighlights;

  const desktopRoleLabel = user
    ? user.role === 'INVESTITOR'
      ? 'Investitor'
      : 'Izvodjac'
    : 'Javni pregled';

  const desktopHeaderPrimaryAction = useMemo(() => {
    if (!user) {
      return {
        label: 'Registriraj se',
        onClick: () => navigateWithScroll('/register'),
      };
    }

    if (user.role === 'INVESTITOR') {
      return {
        label: 'Objavi posao',
        onClick: () => navigateWithScroll('/objavi-posao'),
      };
    }

    return {
      label: 'Otvori dashboard',
      onClick: () => navigateWithScroll('/dashboard'),
    };
  }, [navigateWithScroll, user]);

  return (
    <Box
      sx={{
        minHeight: '100%',
        bgcolor: 'background.default',
        pb: { xs: 2.5, md: 8 },
        background: `
          radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 22%),
          radial-gradient(circle at top left, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 26%),
          linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${theme.palette.background.default} 24%, ${theme.palette.background.default} 100%)
        `,
      }}
    >
      <BaseContainer maxWidth={false} disableGutters withPadding={false}>
        <Box
          sx={{
            width: '100%',
            maxWidth: HOME_CONTENT_WIDTH,
            mx: { xs: 'auto', md: 0 },
            px: HOME_CONTENT_PADDING,
            pt: { xs: 1.15, sm: 1.5 },
            minHeight: { xs: 'calc(100svh - 146px)', md: 'auto' },
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
          }}
        >
          <Stack spacing={{ xs: 1.45, md: 2.2 }}>
            <Box
              sx={{
                display: { xs: 'none', md: user ? 'block' : 'none' },
                mx: { md: -2.25, lg: -2.75 },
                px: { md: 2.25, lg: 2.75 },
                py: { md: 0.9, lg: 1.05 },
                bgcolor: 'background.paper',
                backgroundImage: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 68%, ${alpha(theme.palette.background.paper, 0.72)} 100%)`,
                borderBottom: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.12),
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2.2}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: 'secondary.main',
                      fontWeight: 900,
                      fontSize: { md: '1.08rem', lg: '1.16rem' },
                      lineHeight: 1.1,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    BuildConnect workspace
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.25,
                      color: 'text.secondary',
                      fontSize: { md: '0.78rem', lg: '0.82rem' },
                      lineHeight: 1.35,
                      maxWidth: 500,
                    }}
                  >
                    Upravljajte poslovima, ponudama i kontaktima iz jednog profesionalnog pregleda.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={0.9} alignItems="center" sx={{ flexShrink: 0, minWidth: 0 }}>
                  <BaseButton
                    variant="contained"
                    color="primary"
                    onClick={desktopHeaderPrimaryAction.onClick}
                    sx={{
                      minHeight: 38,
                      borderRadius: 2,
                      px: 1.35,
                      fontSize: '0.76rem',
                      fontWeight: 900,
                      boxShadow: `0 10px 22px ${alpha(theme.palette.primary.main, 0.16)}`,
                    }}
                  >
                    {desktopHeaderPrimaryAction.label}
                  </BaseButton>
                  <IconButton
                    sx={{
                      position: 'relative',
                      width: 38,
                      height: 38,
                      bgcolor: alpha(theme.palette.background.paper, 0.78),
                      color: 'secondary.main',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.divider, 0.12),
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 7,
                        right: 7,
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.background.paper, 0.95)}`,
                      },
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.light, 0.28),
                      },
                    }}
                    title="Poruke uskoro"
                    aria-label="Poruke uskoro"
                  >
                    <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.65,
                      px: 1,
                      py: 0.55,
                      borderRadius: 999,
                      bgcolor: alpha(theme.palette.background.paper, 0.72),
                      color: 'secondary.main',
                    }}
                  >
                    <VerifiedUserRoundedIcon sx={{ fontSize: 17, color: 'primary.light' }} />
                    <Typography sx={{ fontSize: '0.74rem', fontWeight: 800, lineHeight: 1.2 }}>
                      {desktopRoleLabel}
                    </Typography>
                    <Typography sx={{ fontSize: '0.74rem', color: 'text.secondary', lineHeight: 1.2 }}>
                      {user ? user.displayName : 'Javni pregled'}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.55fr) minmax(320px, 0.95fr)' },
                gap: { xs: 1.45, md: 1.9, lg: 2.2 },
                alignItems: 'stretch',
              }}
            >
              <Stack spacing={{ xs: 1.45, md: 1.6 }} sx={{ height: '100%' }}>
                {!user && (
                  <Stack
                    spacing={0.9}
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      pb: 0.35,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.6,
                        alignSelf: 'flex-start',
                        px: 1.1,
                        py: 0.42,
                        borderRadius: 999,
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: 'primary.light',
                        fontWeight: 900,
                        fontSize: '0.72rem',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      <VerifiedUserRoundedIcon sx={{ fontSize: 15 }} />
                      Pregled platforme
                    </Box>

                    <Typography
                      sx={{
                        color: 'secondary.main',
                        fontWeight: 900,
                        fontSize: { md: '1.5rem', lg: '1.76rem' },
                        lineHeight: 1.05,
                        letterSpacing: '-0.035em',
                        maxWidth: 720,
                      }}
                    >
                      Pronađite pravi tim ili otvorite put do nove suradnje bez lutanja kroz nepregledne imenike.
                    </Typography>

                    <Typography
                      sx={{
                        color: 'text.secondary',
                        fontSize: { md: '0.92rem', lg: '0.98rem' },
                        lineHeight: 1.65,
                        maxWidth: 760,
                      }}
                    >
                      Gosti mogu pregledati izvođače, marketplace poslova i specijalizirane kategorije, a prijavom otključavaju objave, ponude i puni radni prostor za daljnji dogovor.
                    </Typography>

                    <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                      {guestDesktopBadges.map((badge) => (
                        <Box
                          key={badge}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: 0.95,
                            py: 0.48,
                            borderRadius: 999,
                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                            boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.08)}`,
                            color: 'secondary.main',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                          }}
                        >
                          {badge}
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                )}

                <Paper
                  elevation={0}
                  sx={{
                    p: 0.35,
                    borderRadius: { xs: 3, md: 3.2 },
                    bgcolor: 'background.paper',
                    boxShadow: `0 16px 30px ${alpha(theme.palette.common.black, 0.05)}`,
                  }}
                >
                  <BaseInput
                    placeholder="Pretraži firme, projekte ili usluge..."
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        handleSearch('jobs');
                      }
                    }}
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        bgcolor: alpha(theme.palette.background.paper, 0.7),
                        minHeight: { xs: 50, md: 56 },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent',
                        },
                      },
                      '& .MuiInputBase-input': {
                        py: { xs: 0.88, md: 1.02 },
                        fontSize: { xs: '0.89rem', md: '1rem' },
                      },
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchRoundedIcon sx={{ color: 'text.secondary', ml: 0.35 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleSearch('jobs')}
                              sx={{
                                width: 36,
                                height: 36,
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                '&:hover': { bgcolor: 'primary.dark' },
                              }}
                            >
                              <ArrowForwardIosRoundedIcon sx={{ fontSize: 12 }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Paper>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: { xs: 0.85, sm: 1, md: 1.2, lg: 1.35 },
                    width: '100%',
                    alignItems: 'stretch',
                    flexGrow: { md: 1 },
                  }}
                >
                  {quickActions.map((action) => (
                    <Paper
                      key={action.label}
                      elevation={0}
                      onClick={action.onClick}
                      sx={{
                        width: '100%',
                        boxSizing: 'border-box',
                        position: 'relative',
                        overflow: 'hidden',
                        p: { xs: 0.88, md: 1.22, lg: 1.35 },
                        aspectRatio: { xs: '1 / 1', md: '1 / 0.9' },
                        minHeight: { xs: 90, sm: 96, md: 136, lg: 146 },
                        borderRadius: { xs: 1.45, md: 2.05 },
                        bgcolor: alpha(theme.palette.background.paper, 0.96),
                        backgroundImage: {
                          md: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.22)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 55%, ${theme.palette.background.paper} 100%)`,
                        },
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.04)}`,
                        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -24,
                          right: -18,
                          width: { md: 74, lg: 82 },
                          height: { md: 74, lg: 82 },
                          borderRadius: '50%',
                          bgcolor: alpha(theme.palette.primary.main, 0.07),
                        },
                        '&:hover': {
                          transform: { md: 'translateY(-3px)' },
                          boxShadow: `0 22px 34px ${alpha(theme.palette.common.black, 0.08)}`,
                        },
                      }}
                    >
                      <Stack
                        spacing={{ xs: 0.7, md: 0.7, lg: 0.8 }}
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          position: 'relative',
                          zIndex: 1,
                          width: '100%',
                          height: '100%',
                          py: { md: 0.1, lg: 0.2 },
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: 34, sm: 36, md: 72, lg: 82 },
                            height: { xs: 34, sm: 36, md: 72, lg: 82 },
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: { xs: 1.2, md: '50%' },
                            bgcolor: { xs: alpha(theme.palette.primary.main, 0.1), md: alpha(theme.palette.primary.main, 0.1) },
                            boxShadow: {
                              md: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.08)}, 0 10px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                            },
                            color: 'primary.light',
                            '& .MuiSvgIcon-root': {
                              fontSize: { xs: 18, md: 36, lg: 40 },
                            },
                          }}
                        >
                          {action.icon}
                        </Box>
                        <Typography
                          sx={{
                            fontWeight: 900,
                            lineHeight: 1.18,
                            minHeight: { xs: 28, sm: 30, md: 40 },
                            fontSize: { xs: '0.7rem', sm: '0.74rem', md: '0.84rem', lg: '0.9rem' },
                            letterSpacing: '-0.01em',
                            width: 'auto',
                          }}
                        >
                          {action.label}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))}
                </Box>
              </Stack>

              <Paper
                elevation={0}
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: { md: 370, lg: 394 },
                  p: { md: 2.15, lg: 2.55 },
                  borderRadius: 3.4,
                  bgcolor: alpha(theme.palette.background.paper, 0.98),
                  backgroundImage: `linear-gradient(165deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 46%, ${theme.palette.background.paper} 100%)`,
                  boxShadow: `0 26px 54px ${alpha(theme.palette.common.black, 0.07)}`,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -72,
                    right: -58,
                    width: 180,
                    height: 180,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -56,
                    left: -34,
                    width: 138,
                    height: 138,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                  },
                }}
              >
                <Stack spacing={1.5} sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
                  <Box>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.7,
                        px: 1.1,
                        py: 0.42,
                        borderRadius: 999,
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: 'primary.light',
                        fontWeight: 900,
                        fontSize: '0.72rem',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                    <InsightsRoundedIcon sx={{ fontSize: 16 }} />
                      {desktopPanelContent.eyebrow}
                    </Box>

                    <Stack direction="row" spacing={0.85} sx={{ mt: 1.2, mb: 0.15 }}>
                      {desktopHighlightItems.map((highlight) => (
                        <Box
                          key={highlight.label}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.55,
                            px: 0.9,
                            py: 0.52,
                            borderRadius: 999,
                            bgcolor: alpha(theme.palette.background.paper, 0.74),
                            color: 'text.secondary',
                            '& .MuiSvgIcon-root': {
                              fontSize: 14,
                              color: 'primary.light',
                            },
                          }}
                        >
                          {highlight.icon}
                          <Typography component="span" sx={{ fontWeight: 800, fontSize: '0.72rem', color: 'secondary.main' }}>
                            {highlight.value}
                          </Typography>
                          <Typography component="span" sx={{ fontSize: '0.72rem' }}>
                            {highlight.label}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    <Typography
                      sx={{
                        mt: 1.15,
                        color: 'secondary.main',
                        fontWeight: 900,
                        fontSize: { md: '1.42rem', lg: '1.6rem' },
                        lineHeight: 1.08,
                        letterSpacing: '-0.03em',
                        maxWidth: 420,
                      }}
                    >
                      {desktopPanelContent.title}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.9,
                        color: 'text.secondary',
                        fontSize: { md: '0.92rem', lg: '0.98rem' },
                        lineHeight: 1.65,
                        maxWidth: 430,
                      }}
                    >
                      {desktopPanelContent.description}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      gap: 0.95,
                    }}
                  >
                    {desktopFeatureItems.map((feature) => (
                      <Paper
                        key={feature.title}
                        elevation={0}
                        sx={{
                          p: 1.15,
                          borderRadius: 2.25,
                          bgcolor: alpha(theme.palette.background.paper, 0.78),
                          backdropFilter: 'blur(8px)',
                          boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.08)}`,
                        }}
                      >
                        <Stack direction="row" spacing={1.05} alignItems="flex-start">
                          <Box
                            sx={{
                              width: 34,
                              height: 34,
                              flexShrink: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 1.2,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.light',
                              '& .MuiSvgIcon-root': {
                                fontSize: 18,
                              },
                            }}
                          >
                            {feature.icon}
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.9rem', lineHeight: 1.2 }}>
                              {feature.title}
                            </Typography>
                            <Typography sx={{ mt: 0.35, color: 'text.secondary', fontSize: '0.8rem', lineHeight: 1.5 }}>
                              {feature.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                  </Box>

                  <Stack direction={{ md: 'column', lg: 'row' }} spacing={1}>
                    <BaseButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={desktopPanelContent.primaryAction}
                      sx={{
                        minHeight: 48,
                        borderRadius: 2.2,
                        px: 1.5,
                        fontSize: '0.82rem',
                        fontWeight: 900,
                        boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                      }}
                    >
                      {desktopPanelContent.primaryLabel}
                    </BaseButton>
                    <BaseButton
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={desktopPanelContent.secondaryAction}
                      startIcon={desktopPanelContent.secondaryIcon}
                      sx={{
                        minHeight: 48,
                        borderRadius: 2.2,
                        px: 1.5,
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        bgcolor: alpha(theme.palette.background.paper, 0.66),
                        borderWidth: 1.5,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.light, 0.18),
                          borderWidth: 1.5,
                        },
                      }}
                    >
                      {desktopPanelContent.secondaryLabel}
                    </BaseButton>
                  </Stack>
                </Stack>
              </Paper>
            </Box>

            <Box
              sx={{
                position: 'relative',
                pt: { xs: 0.45, md: 0.9 },
                pb: { xs: 0, md: 0.45 },
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: { xs: 1.1, md: 0.95 } }}>
                <Box>
                  <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: { xs: '1rem', md: '1.14rem' } }}>
                    Specijalizirani izvođači
                  </Typography>
                  <Typography
                    sx={{
                      display: { xs: 'none', md: 'block' },
                      mt: 0.22,
                      color: 'text.secondary',
                      fontSize: '0.8rem',
                    }}
                  >
                    Otvorite provjerene kategorije i dođite do pravih timova bez lutanja kroz cijeli direktorij.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={0.85} alignItems="center">
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'inline-flex' },
                      alignItems: 'center',
                      gap: 0.5,
                      px: 0.9,
                      py: 0.38,
                      borderRadius: 999,
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      color: 'primary.light',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase',
                    }}
                  >
                      <InsightsRoundedIcon sx={{ fontSize: 14 }} />
                    Brzi pristup
                  </Box>
                  <IconButton
                    onClick={() => navigateWithScroll('/izvodjaci')}
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      color: 'primary.light',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.18) },
                    }}
                  >
                    <ArrowForwardIosRoundedIcon sx={{ fontSize: 11 }} />
                  </IconButton>
                </Stack>
              </Stack>

              <Box
                sx={{
                  position: 'relative',
                  '&::after': {
                    content: { xs: '""', md: 'none' },
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: 28,
                    pointerEvents: 'none',
                    background: `linear-gradient(90deg, ${alpha(theme.palette.background.default, 0)} 0%, ${alpha(theme.palette.background.default, 0.96)} 100%)`,
                  },
                }}
              >
                <Box
                  sx={{
                    display: { xs: 'flex', md: 'grid' },
                    gridTemplateColumns: { md: 'repeat(6, minmax(0, 1fr))' },
                    gap: { xs: 0.85, md: 1.2, lg: 1.35 },
                    overflowX: { xs: 'auto', md: 'visible' },
                    pb: { xs: 0.6, md: 0 },
                    pr: { xs: 6, sm: 4, md: 0 },
                    scrollSnapType: { xs: 'x mandatory', md: 'none' },
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  {contractorShortcuts.map((shortcut) => (
                    <Paper
                      key={shortcut.label}
                      elevation={0}
                      onClick={() => navigateWithScroll(`/izvodjaci?category=${encodeURIComponent(shortcut.category)}`)}
                      sx={{
                        flex: { xs: '0 0 calc((100% - 10px) / 3.18)', sm: '0 0 120px', md: 'unset' },
                        minWidth: { xs: 'calc((100% - 10px) / 3.18)', sm: 120, md: 0 },
                        maxWidth: { xs: 'calc((100% - 10px) / 3.18)', sm: 120, md: 'none' },
                        p: { xs: 0.74, sm: 0.86, md: 1.05, lg: 1.15 },
                        minHeight: { xs: 82, sm: 92, md: 110, lg: 116 },
                        borderRadius: { xs: 1.5, md: 2.05 },
                        bgcolor: alpha(theme.palette.background.paper, 0.98),
                        backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.18)} 0%, ${theme.palette.background.paper} 100%)`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        scrollSnapAlign: { xs: 'start', md: 'none' },
                        boxShadow: `0 10px 22px ${alpha(theme.palette.common.black, 0.04)}`,
                        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                        '&:hover': {
                          transform: { md: 'translateY(-2px)' },
                          boxShadow: `0 18px 30px ${alpha(theme.palette.common.black, 0.08)}`,
                        },
                      }}
                    >
                      <Stack spacing={0.82} alignItems="center" justifyContent="center">
                        <Box
                          sx={{
                            width: { xs: 30, sm: 34, md: 40, lg: 44 },
                            height: { xs: 30, sm: 34, md: 40, lg: 44 },
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1.15,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.light',
                            '& .MuiSvgIcon-root': {
                              fontSize: { xs: 16, sm: 18, md: 20, lg: 22 },
                            },
                          }}
                        >
                          {shortcut.icon}
                        </Box>
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: { xs: '0.66rem', sm: '0.74rem', md: '0.8rem', lg: '0.84rem' },
                            lineHeight: 1.15,
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {shortcut.label}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))}
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    right: 4,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    display: { xs: 'flex', md: 'none' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.14),
                    color: 'primary.light',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                >
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: 9 }} />
                </Box>
              </Box>
            </Box>
          </Stack>

          {!user && (
            <Box sx={{ mt: 'auto', pt: { xs: 2.3, md: 3 }, display: { xs: 'block', md: 'none' } }}>
              <Paper
                elevation={0}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  p: { xs: 1.35, sm: 1.55 },
                  borderRadius: 2.6,
                  bgcolor: alpha(theme.palette.background.paper, 0.98),
                  backgroundImage: `linear-gradient(165deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 50%, ${theme.palette.background.paper} 100%)`,
                  boxShadow: `0 16px 34px ${alpha(theme.palette.common.black, 0.06)}`,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -52,
                    right: -34,
                    width: 132,
                    height: 132,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -42,
                    left: -26,
                    width: 104,
                    height: 104,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                  },
                }}
              >
                <Stack spacing={1.15} sx={{ position: 'relative', zIndex: 1 }}>
                  <Box>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1,
                        py: 0.35,
                        borderRadius: 999,
                        bgcolor: alpha(theme.palette.primary.main, 0.14),
                        color: 'primary.light',
                        fontWeight: 800,
                        fontSize: '0.66rem',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                        mb: 0.8,
                      }}
                    >
                      Novi korisnici
                    </Box>
                    <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: { xs: '1rem', md: '1.08rem' } }}>
                      Otvori profil i kreni raditi u par klikova
                    </Typography>
                    <Typography sx={{ mt: 0.45, color: 'text.secondary', fontSize: { xs: '0.78rem', md: '0.85rem' }, lineHeight: 1.5, maxWidth: 320 }}>
                      Registriraj se kao investitor ili izvođač i odmah pristupi poslovima, suradnjama i kontaktima.
                    </Typography>
                  </Box>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <BaseButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigateWithScroll('/register?role=INVESTITOR')}
                      sx={{
                        minHeight: 46,
                        borderRadius: 2.1,
                        px: 1.25,
                        fontSize: { xs: '0.76rem', sm: '0.8rem' },
                        fontWeight: 900,
                        lineHeight: 1.2,
                        boxShadow: `0 10px 22px ${alpha(theme.palette.primary.main, 0.22)}`,
                      }}
                    >
                      Registriraj se kao investitor
                    </BaseButton>
                    <BaseButton
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => navigateWithScroll('/register?role=IZVODJAC')}
                      sx={{
                        minHeight: 46,
                        borderRadius: 2.1,
                        px: 1.25,
                        fontSize: { xs: '0.76rem', sm: '0.8rem' },
                        fontWeight: 900,
                        lineHeight: 1.2,
                        bgcolor: alpha(theme.palette.background.paper, 0.72),
                        borderWidth: 1.5,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.light, 0.2),
                          borderWidth: 1.5,
                        },
                      }}
                    >
                      Registriraj se kao izvođač
                    </BaseButton>
                  </Stack>
                </Stack>
              </Paper>
            </Box>
          )}
        </Box>
      </BaseContainer>
    </Box>
  );
});

export default Home;
