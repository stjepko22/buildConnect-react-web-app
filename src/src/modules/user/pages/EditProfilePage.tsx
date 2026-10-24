import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import { useRootStore } from '@/core/hooks/useRootStore';
import OwnProfileEditor from '@/modules/user/components/OwnProfileEditor';

const EditProfilePage: React.FC = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticationStore, userStore } = useRootStore();
  const authenticatedUser = authenticationStore.user;
  const authenticatedUserId = authenticatedUser?.id;
  const [initializedUserId, setInitializedUserId] = useState<string>();
  const [hasProfileLoadError, setHasProfileLoadError] = useState(false);
  const currentUser = authenticatedUser ? userStore.getUserById(authenticatedUser.id) : null;
  const navigationState = location.state as { returnTo?: string; returnLabel?: string } | null;
  const backTarget = navigationState?.returnTo || (authenticatedUser ? `/profil/${authenticatedUser.id}` : '/dashboard');
  const backLabel = navigationState?.returnLabel || 'Povratak na profil';

  useEffect(() => {
    if (!authenticatedUserId) {
      return;
    }

    let isActive = true;
    void userStore.loadUserById(authenticatedUserId).then((profile) => {
      if (isActive) {
        if (profile) userStore.initializeProfileForm(profile);
        setHasProfileLoadError(!profile);
        setInitializedUserId(authenticatedUserId);
      }
    });
    return () => { isActive = false; };
  }, [authenticatedUserId, userStore]);

  useEffect(() => {
    if (location.hash === '#fotografije' && initializedUserId === authenticatedUserId) {
      document.getElementById('fotografije')?.scrollIntoView({ block: 'start' });
    }
  }, [location.hash, initializedUserId, authenticatedUserId]);

  if (!authenticatedUser) {
    return null;
  }

  if (initializedUserId !== authenticatedUserId) {
    return (
      <BaseContainer maxWidth="md" withPadding={false}>
        <Box sx={{ pt: 1, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress color="primary" />
        </Box>
      </BaseContainer>
    );
  }

  if (!currentUser || hasProfileLoadError) {
    return (
      <BaseContainer maxWidth="md" withPadding={false}>
        <Alert severity="error" sx={{ mt: 1, borderRadius: 3 }}>
          {userStore.selectedUserError || 'Vaš profil nije dostupan za uređivanje.'}
        </Alert>
      </BaseContainer>
    );
  }

  return (
    <BaseContainer maxWidth={false} disableGutters animate={false}>
      <BaseButton
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(backTarget)}
        sx={{ mb: 1.5, mt: 0.25, px: 0, fontWeight: 700 }}
      >
        {backLabel}
      </BaseButton>

      <Stack
        spacing={0.55}
        sx={{
          mb: 2.15,
          px: { md: 0.15, lg: 0.25 },
          py: { md: 0.35, lg: 0.45 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: 'secondary.main',
            letterSpacing: '-0.04em',
            lineHeight: 1.04,
            fontSize: { xs: '1.7rem', md: '2rem', lg: '2.2rem' },
          }}
        >
          Uredi profil
        </Typography>
        <Typography sx={{ color: 'text.secondary', maxWidth: 720, lineHeight: 1.6, fontSize: { xs: '0.92rem', md: '0.98rem' } }}>
          Ažurirajte podatke koji se prikazuju na vašem profilu.
        </Typography>
      </Stack>

      <OwnProfileEditor
        onCancel={() => navigate(backTarget)}
        onSaved={() => navigate(backTarget)}
      />
    </BaseContainer>
  );
});

export default EditProfilePage;
