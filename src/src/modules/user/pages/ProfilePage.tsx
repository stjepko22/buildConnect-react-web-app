import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  CircularProgress,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
  Divider,
  Rating,
  alpha,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import { useRootStore } from '@/core/hooks/useRootStore';
import JobCard from '@/core/components/molecules/cards/JobCard';
import ProfileHeader from '@/modules/user/components/ProfileHeader';

const ProfilePage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { userStore, jobStore, reviewStore, authenticationStore } = useRootStore();

  useEffect(() => {
    void jobStore.loadJobs();
    if (id) {
      void userStore.loadUserById(id);
      void reviewStore.loadReviews(undefined, id);
    }
  }, [id, jobStore, reviewStore, userStore]);

  const user = userStore.getUserById(id || '');
  const isOwnProfile = authenticationStore.user?.id === id;

  const userJobs = jobStore.jobs.filter((job) => job.investitorId === id);
  const userReviews = reviewStore.reviews.filter((review) => review.revieweeId === id);
  const avgRating =
    userReviews.length > 0 ? userReviews.reduce((accumulator, review) => accumulator + review.rating, 0) / userReviews.length : 0;
  const isContractor = user?.role === 'IZVODJAC';
  const showInvestorJobsSection = !isContractor && !isOwnProfile;
  const isOwnInvestorProfile = isOwnProfile && !isContractor;
  const showSecondaryColumn = isContractor || showInvestorJobsSection;

  if (userStore.isLoadingUsers && !user) {
    return (
      <BaseContainer maxWidth="lg">
        <Box sx={{ pt: 1, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress color="primary" />
        </Box>
      </BaseContainer>
    );
  }

  if (!user) {
    return (
      <BaseContainer maxWidth="lg">
        <Box sx={{ pt: 1, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>Korisnik nije pronaden.</Typography>
          <BaseButton onClick={() => navigate(-1)} sx={{ mt: 2 }}>Povratak</BaseButton>
        </Box>
      </BaseContainer>
    );
  }

  const cardStyle = {
    p: { xs: 2.4, md: 3.2, lg: 3.5 },
    borderRadius: { xs: 4, md: 5 },
    border: '1px solid',
    borderColor: alpha(theme.palette.primary.main, 0.08),
    bgcolor: 'background.paper',
    boxShadow: `0 16px 36px ${alpha(theme.palette.common.black, 0.035)}`,
  };

  return (
    <BaseContainer maxWidth={false} disableGutters animate={false}>
      <Box sx={{ width: '100%' }}>
        <BaseButton
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 0.25, mb: 1.6, px: 0, fontWeight: 700 }}
        >
          Natrag
        </BaseButton>

        <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

        <Grid container spacing={{ xs: 2.2, md: 3.2 }} justifyContent={showSecondaryColumn ? undefined : 'center'}>
          <Grid size={isOwnInvestorProfile ? { xs: 12, md: 9, lg: 8 } : { xs: 12, md: 4 }}>
            <Paper sx={{ ...cardStyle, position: showSecondaryColumn ? { md: 'sticky' } : undefined, top: showSecondaryColumn ? { md: 24 } : undefined }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Stack spacing={1.4} sx={{ width: '100%', mt: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LocationOnIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{user.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CalendarMonthIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Clan od: {user.joinedAt.toLocaleDateString('hr-HR')}
                    </Typography>
                  </Box>
                  {(user.isPhoneVisible || isOwnProfile) && user.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PhoneOutlinedIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {user.phone}
                      </Typography>
                    </Box>
                  )}
                  {user.role === 'IZVODJAC' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <VerifiedUserIcon sx={{ color: 'success.main', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                        Provjereni izvođač
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="overline" sx={{ color: 'primary.light', fontWeight: 900, letterSpacing: '0.08em' }}>
                Biografija
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.7, lineHeight: 1.7, color: 'text.secondary' }}>
                {user.bio}
              </Typography>

              {isOwnProfile && user.phone && !user.isPhoneVisible && (
                <Box
                  sx={{
                    mt: 3.2,
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.warning.light, 0.18),
                    border: '1px solid',
                    borderColor: alpha(theme.palette.warning.main, 0.18),
                  }}
                >
                  <Typography sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.9rem' }}>
                    Broj je trenutno skriven
                  </Typography>
                  <Typography sx={{ mt: 0.35, color: 'text.secondary', fontSize: '0.8rem', lineHeight: 1.5 }}>
                    Samo vi vidite kontakt broj dok je opcija prikaza isključena.
                  </Typography>
                </Box>
              )}

            </Paper>
          </Grid>

          {showSecondaryColumn && (
            <Grid size={{ xs: 12, md: 8 }}>
              {isContractor ? (
              <Box>
                <Paper
                  sx={{
                    ...cardStyle,
                    mb: 3.2,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.18)} 0%, ${theme.palette.background.paper} 62%)`,
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                  >
                    <Box>
                      <Typography variant="overline" sx={{ color: 'primary.light', fontWeight: 900, letterSpacing: '0.08em' }}>
                        Reputacija
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 0.2, fontWeight: 900, color: 'secondary.main' }}>
                        Ukupna ocjena
                      </Typography>
                      <Typography sx={{ mt: 0.45, color: 'text.secondary', fontWeight: 600 }}>
                        Sazetak ocjena i dojmova nakon suradnje.
                      </Typography>
                    </Box>

                    <Box sx={{ minWidth: { md: 230 } }}>
                      <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: { xs: '2rem', md: '2.7rem' }, lineHeight: 1 }}>
                        {avgRating.toFixed(1)}
                      </Typography>
                      <Rating value={avgRating} readOnly precision={0.5} size="large" sx={{ mt: 0.5 }} />
                      <Typography sx={{ mt: 0.5, color: 'text.secondary', fontWeight: 700 }}>
                        {userReviews.length} recenzija
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                <Paper sx={cardStyle}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', md: 'flex-end' }}
                    spacing={1}
                    sx={{
                      mb: 2.8,
                      pb: 1.2,
                      borderBottom: '1px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.08),
                    }}
                  >
                    <Box>
                      <Typography variant="overline" sx={{ color: 'primary.light', fontWeight: 900, letterSpacing: '0.08em' }}>
                        Iskustva klijenata
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 0.2, fontWeight: 900, color: 'secondary.main' }}>
                        Recenzije klijenata
                      </Typography>
                    </Box>
                    <Chip
                      label={`${userReviews.length} recenzija`}
                      variant="outlined"
                      sx={{
                        height: 30,
                        borderRadius: 999,
                        fontWeight: 800,
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        borderColor: alpha(theme.palette.primary.main, 0.14),
                      }}
                    />
                  </Stack>

                  {userReviews.length === 0 ? (
                    <Paper
                      elevation={0}
                      sx={{
                        textAlign: 'center',
                        py: 6,
                        borderRadius: 4,
                        border: '1px dashed',
                        borderColor: alpha(theme.palette.primary.main, 0.18),
                        bgcolor: alpha(theme.palette.primary.light, 0.18),
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, color: 'text.secondary' }}>Jos nema recenzija.</Typography>
                    </Paper>
                  ) : (
                    <Stack spacing={2}>
                      {userReviews.map((review) => (
                        <Paper
                          key={review.id}
                          elevation={0}
                          sx={{
                            p: { xs: 2, md: 2.5 },
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: alpha(theme.palette.primary.main, 0.08),
                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                            backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.12)} 0%, ${theme.palette.background.paper} 100%)`,
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.2 }}>
                            <Rating value={review.rating} readOnly size="small" />
                            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700 }}>
                              {review.createdAt.toLocaleDateString('hr-HR')}
                            </Typography>
                          </Stack>
                          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1.2, lineHeight: 1.65, color: 'secondary.main' }}>
                            "{review.comment}"
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.light' }}>
                            PROJEKT: {jobStore.jobs.find((job) => job.id === review.jobId)?.title || 'Nepoznat posao'}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Paper>
              </Box>
              ) : (
                <Paper sx={cardStyle}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', md: 'flex-end' }}
                    spacing={1}
                    sx={{
                      mb: 2.8,
                      pb: 1.2,
                      borderBottom: '1px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.08),
                    }}
                  >
                    <Box>
                      <Typography variant="overline" sx={{ color: 'primary.light', fontWeight: 900, letterSpacing: '0.08em' }}>
                        Aktivnost investitora
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 0.2, fontWeight: 900, color: 'secondary.main' }}>
                        Objavljeni oglasi
                      </Typography>
                    </Box>
                    <Chip
                      label={`${userJobs.length} oglasa`}
                      variant="outlined"
                      sx={{
                        height: 30,
                        borderRadius: 999,
                        fontWeight: 800,
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        borderColor: alpha(theme.palette.primary.main, 0.14),
                      }}
                    />
                  </Stack>

                  {userJobs.length === 0 ? (
                    <Paper
                      elevation={0}
                      sx={{
                        textAlign: 'center',
                        py: 6,
                        borderRadius: 4,
                        border: '1px dashed',
                        borderColor: alpha(theme.palette.primary.main, 0.18),
                        bgcolor: alpha(theme.palette.primary.light, 0.18),
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        Korisnik trenutno nema aktivnih oglasa.
                      </Typography>
                    </Paper>
                  ) : (
                    <Grid container spacing={{ xs: 2, md: 2.6 }}>
                      {userJobs.map((job) => (
                        <Grid key={job.id} size={{ xs: 12, md: 12, lg: 6, xl: 4 }}>
                          <JobCard job={job} />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Paper>
              )}
            </Grid>
          )}
        </Grid>
      </Box>
    </BaseContainer>
  );
});

export default ProfilePage;
