import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Drawer, AppBar, Toolbar, IconButton, Typography, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useRootStore } from '@/core/hooks/useRootStore';
import Sidebar from '@/modules/navigation/components/Sidebar';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';

const DRAWER_WIDTH = 260;

const MainLayout: React.FC = observer(() => {
  const { navigationStore, authenticationStore } = useRootStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isAuthenticated = !!authenticationStore.user;
  const previousUserIdRef = useRef<string | null>(authenticationStore.user?.id ?? null);

  useEffect(() => {
    const currentUserId = authenticationStore.user?.id ?? null;
    if (previousUserIdRef.current && !currentUserId) {
      navigate('/');
    }
    previousUserIdRef.current = currentUserId;
  }, [authenticationStore.user, navigate]);

  const handleDrawerToggle = () => {
    navigationStore.toggleMobileSidebar();
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const openLogin = () => {
    authenticationStore.setLoginDialogOpen(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          maxWidth: '100vw',
          width: isAuthenticated ? { md: `calc(100% - ${DRAWER_WIDTH}px)` } : '100%',
          ml: isAuthenticated ? { md: `${DRAWER_WIDTH}px` } : 0,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: isAuthenticated ? { xs: 'flex', md: 'none' } : 'flex',
        }}
      >
        {isAuthenticated ? (
          <Toolbar sx={{ position: 'relative', justifyContent: 'flex-start' }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ display: { md: 'none' }, zIndex: 1 }}>
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              onClick={handleLogoClick}
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                fontWeight: 800,
                color: 'text.primary',
                cursor: 'pointer',
                textAlign: 'center',
                maxWidth: 'calc(100% - 96px)',
              }}
            >
              Build
              <Box component="span" sx={{ color: 'primary.light' }}>
                Connect
              </Box>
            </Typography>
          </Toolbar>
        ) : (
          <Toolbar
            sx={{
              minHeight: { xs: 64, md: 72 },
              px: { xs: 2, sm: 3, md: 4.5, lg: 5.5 },
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              noWrap
              onClick={handleLogoClick}
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Build
              <Box component="span" sx={{ color: 'primary.light' }}>
                Connect
              </Box>
            </Typography>

            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'center' }}>
              <BaseButton variant="text" color="secondary" onClick={() => navigate('/')} sx={{ fontWeight: 800 }}>
                Početna
              </BaseButton>
              <BaseButton variant="text" color="secondary" onClick={() => navigate('/marketplace')} sx={{ fontWeight: 800 }}>
                Marketplace
              </BaseButton>
              <BaseButton variant="text" color="secondary" onClick={() => navigate('/izvodjaci')} sx={{ fontWeight: 800 }}>
                Izvođači
              </BaseButton>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
              <BaseButton
                variant="text"
                color="secondary"
                onClick={openLogin}
                sx={{ fontWeight: 800, minWidth: 0, px: { xs: 1, md: 1.5 } }}
              >
                Prijava
              </BaseButton>
              <BaseButton
                variant="contained"
                color="primary"
                onClick={() => navigate('/register')}
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  borderRadius: 999,
                  px: 2.2,
                  minHeight: 40,
                  fontWeight: 900,
                }}
              >
                Registriraj se
              </BaseButton>
            </Stack>
          </Toolbar>
        )}
      </AppBar>

      <Box component="nav" sx={{ width: isAuthenticated ? { md: DRAWER_WIDTH } : 0, flexShrink: isAuthenticated ? { md: 0 } : 0 }}>
        {isAuthenticated && (
          <>
            <Drawer
              variant="temporary"
              open={navigationStore.isMobileSidebarOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
              }}
            >
              <Sidebar onClose={handleDrawerToggle} />
            </Drawer>

            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', md: 'block' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: DRAWER_WIDTH,
                  borderRight: '1px solid',
                  borderColor: 'divider',
                },
              }}
              open
            >
              <Sidebar />
            </Drawer>
          </>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: isLandingPage ? 0 : isAuthenticated ? { xs: 2, sm: 3 } : { xs: 2, sm: 3, md: 4.5, lg: 5.5 },
          pt: isLandingPage ? 0 : isAuthenticated ? { xs: 0.5, sm: 1 } : { xs: 0.75, md: 1.1 },
          pb: isLandingPage ? 0 : { xs: 2, sm: 3 },
          minWidth: 0,
          maxWidth: '100%',
          width: isAuthenticated ? { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` } : '100%',
          mt: isAuthenticated ? { xs: '64px', md: 0 } : { xs: '64px', md: '72px' },
          mb: { xs: '80px', md: 0 },
          bgcolor: 'background.default',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <Outlet />
      </Box>

    </Box>
  );
});

export default MainLayout;
