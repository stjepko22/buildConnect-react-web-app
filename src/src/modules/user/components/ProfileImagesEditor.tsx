import React, { useEffect, useId, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Alert, Box, Button, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useRootStore } from '@/core/hooks/useRootStore';
import ProfileAvatar from '@/modules/user/components/ProfileAvatar';
import ProfileCoverImage from '@/modules/user/components/ProfileCoverImage';
import ProfileImageKind from '@/modules/user/models/ProfileImageKind';
import { profileImageAccept, resolveProfileImageUrl, validateProfileImage } from '@/modules/user/utils/profileImages';

interface ProfileImageEditorProps {
  kind: ProfileImageKind;
}

const ProfileImageEditor = observer(({ kind }: ProfileImageEditorProps) => {
  const { authenticationStore, userStore } = useRootStore();
  const user = userStore.getUserById(authenticationStore.user?.id || '');
  const [selection, setSelection] = useState<{ file: File; url: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const headingId = useId();
  const descriptionId = useId();
  const isCover = kind === 'cover';
  const title = isCover ? 'Naslovna fotografija' : 'Logo / profilna slika';
  const savedImageUrl = isCover ? user?.coverImageUrl : user?.profileImageUrl;
  const isSaving = userStore.savingProfileImageKind === kind;
  const isBusy = Boolean(userStore.savingProfileImageKind) || userStore.isSavingProfile || isValidating;
  const error = validationError || userStore.profileImageErrors[kind];

  useEffect(() => {
    return () => { if (selection) URL.revokeObjectURL(selection.url); };
  }, [selection]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setIsValidating(true);
    setValidationError(null);
    setSuccessMessage(null);
    userStore.clearProfileImageError(kind);
    const message = await validateProfileImage(file);
    setIsValidating(false);
    if (message) {
      setValidationError(message);
      return;
    }
    setSelection({ file, url: URL.createObjectURL(file) });
  };

  const handleUpload = async () => {
    if (!selection) return;
    setSuccessMessage(null);
    if (await userStore.uploadCurrentUserImage(kind, selection.file)) {
      setSelection(null);
      setSuccessMessage('Slika je spremljena.');
    }
  };

  const handleRemove = async () => {
    setValidationError(null);
    setSuccessMessage(null);
    if (await userStore.removeCurrentUserImage(kind)) {
      setSelection(null);
      setSuccessMessage('Slika je uklonjena.');
    }
  };

  if (!user) return null;

  return (
    <Paper component="section" variant="outlined" aria-labelledby={headingId}
      sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 3, minWidth: 0, flex: 1 }}>
      <Stack spacing={1.5}>
        <Box>
          <Typography id={headingId} component="h3" variant="subtitle1" fontWeight={800}>{title}</Typography>
          <Typography id={descriptionId} variant="caption" color="text.secondary">
            {isCover ? 'Široka fotografija; prikazuje se s centriranim izrezom.' : 'Kvadratna slika; na profilu se prikazuje u krugu.'}
          </Typography>
        </Box>
        <Box sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'background.default' }}>
          {isCover ? (
            <ProfileCoverImage src={selection?.url || resolveProfileImageUrl(savedImageUrl)} alt={`Naslovna fotografija: ${user.displayName}`} isCompact placeholderLabel="Dodajte naslovnu fotografiju" />
          ) : (
            <Box sx={{ height: { xs: 130, sm: 160 }, display: 'grid', placeItems: 'center' }}>
              <ProfileAvatar displayName={user.displayName} imageUrl={selection ? undefined : savedImageUrl}
                src={selection?.url || resolveProfileImageUrl(savedImageUrl)}
                sx={{ width: 100, height: 100, bgcolor: 'primary.dark', color: 'primary.contrastText', fontSize: '2rem', fontWeight: 800 }} />
            </Box>
          )}
        </Box>
        <input ref={fileInput} id={inputId} type="file" accept={profileImageAccept} hidden
          aria-label={`Odaberite: ${title.toLocaleLowerCase('hr')}`} aria-describedby={descriptionId} disabled={isBusy}
          onChange={(event) => { void handleFileChange(event); }} />
        <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
          <Button type="button" variant="outlined" startIcon={<AddPhotoAlternateOutlinedIcon />} disabled={isBusy}
            onClick={() => fileInput.current?.click()} aria-controls={inputId}>
            {selection || savedImageUrl ? 'Odaberi drugu' : 'Odaberi sliku'}
          </Button>
          {savedImageUrl && !selection && (
            <Button type="button" color="error" startIcon={<DeleteOutlineRoundedIcon />} disabled={isBusy}
              onClick={() => { void handleRemove(); }}>Ukloni</Button>
          )}
        </Stack>
        {selection && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflowWrap: 'anywhere', mb: 1 }}>
              {selection.file.name} · {(selection.file.size / 1024 / 1024).toFixed(1)} MB · Pregled prije spremanja
            </Typography>
            <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
              <Button type="button" variant="contained" disabled={isBusy} onClick={() => { void handleUpload(); }}>Spremi sliku</Button>
              <Button type="button" disabled={isBusy} onClick={() => { setSelection(null); setValidationError(null); userStore.clearProfileImageError(kind); }}>Odustani od odabira</Button>
            </Stack>
          </Box>
        )}
        {(isSaving || isValidating) && (
          <Box role="status" aria-live="polite">
            <LinearProgress variant={isSaving && selection ? 'determinate' : 'indeterminate'} value={userStore.profileImageUploadProgress} />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
              {isValidating ? 'Provjera slike…' : selection ? userStore.profileImageUploadProgress < 100 ? `Slanje slike: ${userStore.profileImageUploadProgress}%` : 'Obrada slike…' : 'Uklanjanje slike…'}
            </Typography>
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success" role="status">{successMessage}</Alert>}
      </Stack>
    </Paper>
  );
});

const ProfileImagesEditor = () => (
  <Stack id="fotografije" spacing={2} sx={{ mb: 3, scrollMarginTop: 88 }}>
    <Box>
      <Typography component="h2" variant="h6" fontWeight={800}>Fotografije profila</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
        JPG, PNG ili WebP, do 5 MB po slici. Fotografije su javne. Spremaju se zasebno gumbom „Spremi sliku”; odustajanje od uređivanja podataka ne poništava spremljene fotografije.
      </Typography>
    </Box>
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
      <ProfileImageEditor kind="cover" />
      <ProfileImageEditor kind="profile" />
    </Stack>
  </Stack>
);

export default ProfileImagesEditor;
