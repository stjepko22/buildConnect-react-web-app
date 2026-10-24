import { useState } from 'react';
import { Box, Typography, alpha } from '@mui/material';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';

interface ProfileCoverImageProps {
  src?: string;
  alt: string;
  isCompact?: boolean;
  placeholderLabel?: string;
}

export default function ProfileCoverImage({ src, alt, isCompact = false, placeholderLabel }: ProfileCoverImageProps) {
  const [failedSource, setFailedSource] = useState<string>();
  const hasImage = Boolean(src && src !== failedSource);

  return (
    <Box sx={{
      position: 'relative',
      height: isCompact ? { xs: 130, sm: 160 } : { xs: 176, sm: 240, md: 290 },
      overflow: 'hidden',
      bgcolor: 'background.default',
      backgroundImage: (theme) => `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.24)}, ${theme.palette.background.default} 68%, ${alpha(theme.palette.primary.light, 0.12)})`,
    }}>
      {hasImage ? (
        <Box component="img" src={src} alt={alt} onError={() => setFailedSource(src)}
          sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 1 }}>
          <BusinessOutlinedIcon aria-hidden="true" sx={{ fontSize: isCompact ? 42 : 76, color: 'primary.light', opacity: 0.45 }} />
          {placeholderLabel && <Typography variant="caption" color="text.secondary">{placeholderLabel}</Typography>}
        </Box>
      )}
    </Box>
  );
}
