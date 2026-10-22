import React from 'react';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';

interface AuthPageShellProps {
  children: React.ReactNode;
  onBack?: () => void;
  maxWidth?: 'xs' | 'sm';
}

const AuthPageShell: React.FC<AuthPageShellProps> = ({ children, onBack, maxWidth = 'xs' }) => {
  const navigate = useNavigate();

  const handleBrandClick = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: { xs: 'stretch', sm: 'center' },
        py: { xs: 2, sm: 4 },
      }}
    >
      <BaseContainer maxWidth={maxWidth} animate={true}>
        <Stack spacing={{ xs: 2, sm: 2.5 }} sx={{ width: '100%' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <IconButton
              aria-label="Natrag"
              onClick={onBack}
              sx={{
                color: 'text.primary',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              onClick={handleBrandClick}
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                cursor: 'pointer',
                textAlign: 'right',
              }}
            >
              Build
              <Box component="span" sx={{ color: 'primary.light' }}>
                Connect
              </Box>
            </Typography>
          </Stack>

          <Paper
            sx={{
              p: { xs: 3, sm: 4, md: '48px 56px' },
              borderRadius: 6,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 2,
              bgcolor: 'background.paper',
              width: '100%',
            }}
          >
            {children}
          </Paper>
        </Stack>
      </BaseContainer>
    </Box>
  );
};

export default AuthPageShell;
