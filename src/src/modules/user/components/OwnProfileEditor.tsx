import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Alert,
  Box,
  Chip,
  FormControlLabel,
  Switch,
  MenuItem,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import { useRootStore } from '@/core/hooks/useRootStore';
import ProfileImagesEditor from '@/modules/user/components/ProfileImagesEditor';

interface OwnProfileEditorProps {
  onCancel: () => void;
  onSaved: () => void;
}

const OwnProfileEditor: React.FC<OwnProfileEditorProps> = observer(({ onCancel, onSaved }) => {
  const theme = useTheme();
  const { authenticationStore, userStore } = useRootStore();
  const userRole = authenticationStore.user?.role;
  const hasPhone = userStore.profilePhone.trim().length > 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userStore.savingProfileImageKind) return;
    const isSaved = await userStore.submitCurrentUserProfile();
    if (isSaved) {
      onSaved();
    }
  };

  return (
    <Paper
      sx={{
        p: { xs: 2.4, md: 3.1 },
        mt: 0,
        borderRadius: { xs: 4, md: 5 },
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.1),
        bgcolor: 'background.paper',
        backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.14)} 0%, ${theme.palette.background.paper} 38%)`,
        boxShadow: `0 16px 36px ${alpha(theme.palette.common.black, 0.035)}`,
      }}
      >
        <ProfileImagesEditor />
        <form onSubmit={handleSubmit}>
        <Stack spacing={2.4}>
          <Box>
            <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: { xs: '1.02rem', md: '1.15rem' } }}>
              Javni podaci profila
            </Typography>
            <Typography sx={{ mt: 0.25, color: 'text.secondary', fontSize: '0.86rem', lineHeight: 1.55 }}>
              Ove informacije vide drugi korisnici kada otvore vas profil.
            </Typography>
          </Box>
          {userStore.profileSaveError && (
            <Alert severity="error" sx={{ borderRadius: 3 }}>
              {userStore.profileSaveError}
            </Alert>
          )}

          <BaseInput
            label="Ime i prezime / naziv"
            value={userStore.profileDisplayName}
            onChange={(event) => userStore.setProfileDisplayName(event.target.value)}
            required
          />

          <BaseInput
            select
            label="Tip korisnika"
            value={userStore.profileLegalType}
            onChange={(event) => userStore.setProfileLegalType(event.target.value as 'FIZICKA_OSOBA' | 'FIRMA')}
            required
          >
            <MenuItem value="FIZICKA_OSOBA">Fizička osoba</MenuItem>
            <MenuItem value="FIRMA">Firma</MenuItem>
          </BaseInput>

          <BaseInput
            label="Lokacija"
            value={userStore.profileLocation}
            onChange={(event) => userStore.setProfileLocation(event.target.value)}
            required
          />

          <BaseInput
            label="Kontakt broj"
            value={userStore.profilePhone}
            onChange={(event) => userStore.setProfilePhone(event.target.value)}
            required
            helperText="Broj je obavezan. Javno se prikazuje samo ako uključite vidljivost."
          />

          <Box
            sx={{
              px: 0.25,
              py: 0.2,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.light, 0.08),
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.08),
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={userStore.profileIsPhoneVisible}
                  onChange={(event) => userStore.setProfileIsPhoneVisible(event.target.checked)}
                  color="primary"
                  disabled={!hasPhone}
                />
              }
              label={
                <Box>
                  <Typography sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.95rem' }}>
                      Prikazi broj telefona na profilu
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                      {hasPhone
                        ? 'Ako je isključeno, drugi korisnici neće vidjeti vaš broj.'
                        : 'Unesite broj telefona da biste mogli uključiti prikaz.'}
                    </Typography>
                  </Box>
                }
              sx={{ m: 0, alignItems: 'flex-start' }}
            />
          </Box>

          <BaseInput
            label="Biografija"
            value={userStore.profileBio}
            onChange={(event) => userStore.setProfileBio(event.target.value)}
            multiline
            rows={4}
            required
            helperText="Najmanje 10 znakova."
          />

          {userRole === 'IZVODJAC' && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.secondary', mb: 0.45 }}>
                Usluge
              </Typography>
              <Typography sx={{ mb: 1.25, color: 'text.secondary', fontSize: '0.83rem', lineHeight: 1.5 }}>
                Odaberite usluge koje želite isticati na profilu.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {userStore.availableServiceCategories.map((category) => {
                  const isSelected = userStore.profileServiceCategories.includes(category);
                  return (
                    <Chip
                      key={category}
                      clickable
                      label={category}
                      color={isSelected ? 'primary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      onClick={() => userStore.toggleProfileServiceCategory(category)}
                      sx={{ fontWeight: 700, borderRadius: 999 }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <BaseButton
              type="submit"
              variant="contained"
              color="primary"
              loading={userStore.isSavingProfile}
              disabled={!userStore.isProfileFormValid || Boolean(userStore.savingProfileImageKind)}
              sx={{
                minHeight: 42,
                borderRadius: 999,
                fontWeight: 800,
                boxShadow: `0 14px 28px ${alpha(theme.palette.primary.main, 0.18)}`,
              }}
            >
              Spremi promjene
            </BaseButton>
            <BaseButton
              type="button"
              variant="outlined"
              color="secondary"
              disabled={userStore.isSavingProfile || Boolean(userStore.savingProfileImageKind)}
              onClick={() => {
                userStore.resetProfileForm();
                onCancel();
              }}
              sx={{
                minHeight: 42,
                borderRadius: 999,
                fontWeight: 800,
              }}
            >
              Odustani
            </BaseButton>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
});

export default OwnProfileEditor;
