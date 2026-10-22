import React, { useEffect, useRef } from 'react';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  useTheme,
  useMediaQuery,
  Box,
  alpha,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRootStore } from '@/core/hooks/useRootStore';
import { BRAND_COLORS } from '@/ui/themes/default/theme';

const AppBottomNavigation: React.FC = observer(() => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { authenticationStore } = useRootStore();
  const user = authenticationStore.user;
  const shouldScrollAfterRouteChangeRef = useRef(false);

  useEffect(() => {
    if (!shouldScrollAfterRouteChangeRef.current) {
      return;
    }

    shouldScrollAfterRouteChangeRef.current = false;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  if (!isMobile) return null;

  const getCurrentNavValue = () => {
    const path = location.pathname;

    if (path === '/') return '/';
    if (path.startsWith('/marketplace') || path.startsWith('/posao/')) return '/marketplace';
    if (path.startsWith('/dashboard') || path.startsWith('/moji-poslovi')) return '/dashboard';
    if (path.startsWith('/objavi-posao')) return '/objavi-posao';
    if (path.startsWith('/profil/')) return '/profil';
    if (!user && path === '/login') return '/login';

    return false;
  };

  const handleNavigate = (target: string) => {
    if (!user && target === '/login') {
      authenticationStore.setLoginDialogOpen(true);
      return;
    }

    if (target === '/profil') {
      if (!user) {
        authenticationStore.setLoginDialogOpen(true);
        return;
      }
      shouldScrollAfterRouteChangeRef.current = true;
      navigate(`/profil/${user.id}`);
      return;
    }

    shouldScrollAfterRouteChangeRef.current = true;
    navigate(target);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: 0,
        borderTop: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(12px)',
        background: alpha(BRAND_COLORS.darkBase, 0.96),
      }}
      elevation={0}
    >
      <BottomNavigation
        showLabels
        value={getCurrentNavValue()}
        sx={{
          height: 70,
          bgcolor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
            minWidth: 0,
            maxWidth: 'none',
            flex: 1,
            px: 0.5,
            '& .MuiBottomNavigationAction-label': {
              fontWeight: 700,
              fontSize: '0.68rem',
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
            },
          },
          '& .Mui-selected': {
            color: 'primary.light',
            '& .MuiSvgIcon-root': {
              transform: 'scale(1.15)',
              transition: 'transform 0.2s ease-in-out',
            },
          },
        }}
      >
        <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} onClick={() => handleNavigate('/')} />
        <BottomNavigationAction
          label="Market"
          value="/marketplace"
          icon={<StorefrontIcon />}
          onClick={() => handleNavigate('/marketplace')}
        />

        {user?.role === 'INVESTITOR' && (
          <BottomNavigationAction
            label="Objavi"
            value="/objavi-posao"
            icon={<AddCircleIcon sx={{ fontSize: '2rem', color: 'primary.light' }} />}
            onClick={() => handleNavigate('/objavi-posao')}
          />
        )}

        {user && (
          <BottomNavigationAction
            label="Panel"
            value="/dashboard"
            icon={<DashboardIcon />}
            onClick={() => handleNavigate('/dashboard')}
          />
        )}

        <BottomNavigationAction
          label={user ? 'Profil' : 'Prijava'}
          value={user ? '/profil' : '/login'}
          icon={<AccountCircleIcon />}
          onClick={() => handleNavigate(user ? '/profil' : '/login')}
        />
      </BottomNavigation>

      <Box sx={{ height: 'env(safe-area-inset-bottom)', bgcolor: BRAND_COLORS.darkBase }} />
    </Paper>
  );
});

export default AppBottomNavigation;
