import React from 'react';
import { observer } from 'mobx-react-lite';
import { Alert, Box, MenuItem, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import RegistrationStore from '../stores/RegistrationStore';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import BaseLoadingButton from '@/core/components/atoms/buttons/BaseLoadingButton';

import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import KeyTwoToneIcon from '@mui/icons-material/KeyTwoTone';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';

interface RegistrationProps {
  registrationStore: RegistrationStore;
  onCustomSubmit: () => void;
  onGoToLogin: () => void;
}

const Registration: React.FC<RegistrationProps> = observer(({ registrationStore, onCustomSubmit, onGoToLogin }) => {
  const { isLoading, isFormValid } = registrationStore;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onCustomSubmit();
  };

  if (registrationStore.isSubmitted) {
    return (
      <Stack spacing={2.5} sx={{ width: '100%', textAlign: 'center' }}>
        <CheckCircleTwoToneIcon sx={{ mx: 'auto', color: 'success.main', fontSize: 58 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'secondary.main' }}>
            Provjerite email
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
            Račun je kreiran za {registrationStore.registeredEmail}. Potvrdite email adresu prije prve prijave.
          </Typography>
        </Box>

        <Alert severity={registrationStore.isVerificationEmailSent ? 'success' : 'warning'} sx={{ borderRadius: 3, textAlign: 'left' }}>
          {registrationStore.isVerificationEmailSent
            ? 'Poslali smo vam verifikacijski link.'
            : 'Račun je kreiran, ali email nije poslan jer Resend postavke nisu konfigurirane.'}
        </Alert>

        <BaseButton variant="contained" color="primary" fullWidth onClick={onGoToLogin}>
          Idi na prijavu
        </BaseButton>
      </Stack>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      gap={{ xs: 2, sm: 2.5 }}
      width="100%"
    >
      <Box textAlign="center">
        <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.light' }}>
          Kreiraj svoj račun
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Pridruži se zajednici majstora i investitora.
        </Typography>
      </Box>

      <Box>
        <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.7, display: 'block', color: 'text.secondary', ml: 0.5 }}>
          Registriram se kao
        </Typography>
        <ToggleButtonGroup
          color="primary"
          value={registrationStore.role}
          exclusive
          onChange={(_, value) => value && registrationStore.setRole(value)}
          fullWidth
        >
          <ToggleButton value="INVESTITOR" sx={{ fontWeight: 700, textTransform: 'none' }}>
            Investitor
          </ToggleButton>
          <ToggleButton value="IZVODJAC" sx={{ fontWeight: 700, textTransform: 'none' }}>
            Izvođač
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {registrationStore.role === 'IZVODJAC' && (
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.7, display: 'block', color: 'text.secondary', ml: 0.5 }}>
            Vrsta izvođača
          </Typography>
          <BaseInput
            select
            fullWidth
            value={registrationStore.legalType}
            onChange={(event) => registrationStore.setLegalType(event.target.value as 'FIZICKA_OSOBA' | 'FIRMA')}
          >
            <MenuItem value="FIRMA">Tvrtka/obrt</MenuItem>
            <MenuItem value="FIZICKA_OSOBA">Fizička osoba</MenuItem>
          </BaseInput>
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <BaseInput
          label="Ime"
          value={registrationStore.firstName}
          onChange={(event) => registrationStore.setFirstName(event.target.value)}
          sx={{ flex: 1 }}
          required
          slotProps={{ input: { startAdornment: <PersonTwoToneIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> } }}
        />
        <BaseInput
          label="Prezime"
          value={registrationStore.lastName}
          onChange={(event) => registrationStore.setLastName(event.target.value)}
          sx={{ flex: 1 }}
          required
        />
      </Box>

      <BaseInput
        label="Email adresa"
        type="email"
        value={registrationStore.email}
        onChange={(event) => registrationStore.setEmail(event.target.value)}
        required
        slotProps={{ input: { startAdornment: <EmailTwoToneIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> } }}
      />

      <BaseInput
        label="Broj telefona"
        value={registrationStore.phone}
        onChange={(event) => registrationStore.setPhone(event.target.value)}
        required
        helperText="Broj treba imati barem 6 znakova."
        slotProps={{ input: { startAdornment: <PhoneTwoToneIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> } }}
      />

      <BaseInput
        label="Lozinka"
        type="password"
        value={registrationStore.password}
        onChange={(event) => registrationStore.setPassword(event.target.value)}
        required
        helperText="Lozinka treba imati barem 6 znakova."
        slotProps={{ input: { startAdornment: <KeyTwoToneIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> } }}
      />

      {registrationStore.submitError && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {registrationStore.submitError}
        </Alert>
      )}

      <BaseLoadingButton
        title="Registriraj se"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        isLoading={isLoading}
        disabled={isLoading || !isFormValid}
        type="submit"
        sx={{ py: 1.45, mt: 0.35, borderRadius: 3, fontWeight: 800 }}
      />
    </Box>
  );
});

export default Registration;
