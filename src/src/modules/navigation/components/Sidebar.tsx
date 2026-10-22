import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useRootStore } from '@/core/hooks/useRootStore';
import { BRAND_COLORS } from '@/ui/themes/default/theme';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = observer(({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { authenticationStore } = useRootStore();
  const user = authenticationStore.user;

  const handleNav = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    authenticationStore.logout();
    navigate('/');
    if (onClose) onClose();
  };

  const handleAuthAction = () => {
    if (user) {
      handleLogout();
      return;
    }

    authenticationStore.setLoginDialogOpen(true);
    if (onClose) onClose();
  };

  const handleLogoClick = () => {
    navigate('/');
    if (onClose) onClose();
  };

  const menuItems = [
    { label: 'Marketplace', icon: <StorefrontIcon />, path: '/marketplace' },
    ...(user ? [{ label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' }] : []),
    ...(user ? [{ label: 'Moji poslovi', icon: <WorkOutlineIcon />, path: '/moji-poslovi' }] : []),
    ...(user?.role === 'INVESTITOR' ? [{ label: 'Izvođači', icon: <EngineeringIcon />, path: '/izvodjaci' }] : []),
    ...(user ? [{ label: 'Moj Profil', icon: <AccountCircleIcon />, path: `/profil/${user.id}` }] : []),
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: BRAND_COLORS.darkSurface,
        color: 'common.white',
        backgroundImage: `
          radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 18%),
          linear-gradient(180deg, ${BRAND_COLORS.darkSurface} 0%, ${BRAND_COLORS.darkBase} 100%)
        `,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          px: 3,
          pt: 3.2,
          pb: 2.5,
          textAlign: 'left',
          background: BRAND_COLORS.heroGradient,
          borderBottom: '1px solid',
          borderColor: alpha(theme.palette.common.white, 0.08),
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -34,
            right: -22,
            width: 108,
            height: 108,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.primary.main, 0.08),
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h5"
            onClick={handleLogoClick}
            sx={{ fontWeight: 900, color: 'text.primary', mb: 0.55, cursor: 'pointer', letterSpacing: '-0.03em' }}
          >
            Build<Box component="span" sx={{ color: 'primary.light' }}>Connect</Box>
          </Typography>
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontWeight: 800,
              color: alpha(theme.palette.common.white, 0.72),
              textTransform: 'uppercase',
              letterSpacing: 1.1,
            }}
          >
            Premium mreža za građevinu
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 2, py: 2.2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = item.path === '/dashboard'
            ? location.pathname === '/dashboard'
            : item.path === '/moji-poslovi'
              ? location.pathname === '/moji-poslovi'
              : location.pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNav(item.path)}
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  py: 1.05,
                  px: 1.2,
                  bgcolor: active ? alpha(theme.palette.primary.main, 0.14) : 'transparent',
                  color: active ? 'common.white' : alpha(theme.palette.common.white, 0.8),
                  border: '1px solid',
                  borderColor: active ? alpha(theme.palette.primary.main, 0.32) : alpha(theme.palette.common.white, 0.03),
                  boxShadow: active ? `0 10px 22px ${alpha(theme.palette.common.black, 0.18)}` : 'none',
                  '&:hover': {
                    bgcolor: active ? alpha(theme.palette.primary.main, 0.18) : alpha(theme.palette.common.white, 0.05),
                    borderColor: active ? alpha(theme.palette.primary.main, 0.38) : alpha(theme.palette.common.white, 0.08),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 42,
                    color: active ? 'primary.light' : alpha(theme.palette.common.white, 0.82),
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: active ? 800 : 600,
                    color: 'inherit',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.08) }} />

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleAuthAction}
          sx={{
            borderRadius: 2,
            py: 1.15,
            color: user ? 'error.light' : 'primary.light',
            border: '1px solid',
            borderColor: user ? alpha(theme.palette.error.main, 0.25) : alpha(theme.palette.primary.main, 0.28),
            bgcolor: user ? alpha(theme.palette.error.main, 0.04) : alpha(theme.palette.primary.main, 0.08),
            '&:hover': {
              bgcolor: user ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.primary.main, 0.14),
            },
          }}
        >
          <ListItemIcon sx={{ color: user ? 'error.light' : 'primary.light', minWidth: 40 }}>
            {user ? <LogoutIcon /> : <LoginIcon />}
          </ListItemIcon>
          <ListItemText primary={user ? 'Odjava' : 'Prijava'} primaryTypographyProps={{ fontWeight: 800 }} />
        </ListItemButton>
      </Box>
    </Box>
  );
});

export default Sidebar;
