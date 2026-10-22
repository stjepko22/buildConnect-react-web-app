import React from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
  const theme = useTheme();
  const mainColor = color || theme.palette.primary.light;

  return (
    <Box
      sx={{
        p: { xs: 2.4, md: 2.8 },
        borderRadius: { xs: 4, md: 5 },
        border: '1px solid',
        borderColor: alpha(mainColor, 0.16),
        bgcolor: 'background.paper',
        backgroundImage: `linear-gradient(180deg, ${alpha(mainColor, 0.12)} 0%, ${theme.palette.background.paper} 62%)`,
        boxShadow: `0 16px 34px ${alpha(theme.palette.common.black, 0.04)}`,
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1.8, md: 2.2 },
        minHeight: { xs: 112, md: 124 },
      }}
    >
      <Box
        sx={{
          width: { xs: 54, md: 60 },
          height: { xs: 54, md: 60 },
          borderRadius: 3,
          bgcolor: alpha(mainColor, 0.14),
          color: mainColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: { xs: 24, md: 28 },
          boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.08)}`,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 900,
            color: 'text.disabled',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: 'secondary.main',
            letterSpacing: '-0.03em',
            fontSize: { xs: '1.7rem', md: '2rem' },
            lineHeight: 1.05,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatCard;

