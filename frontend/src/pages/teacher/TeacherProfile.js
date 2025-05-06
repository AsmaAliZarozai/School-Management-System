import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Paper, 
  Divider 
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  Class as ClassIcon,
  Book as BookIcon,
  School as SchoolIcon 
} from '@mui/icons-material';
import { styled } from '@mui/system';

// Styled Components
const ProfileBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
  padding: theme.spacing(4),
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(4),
  maxWidth: 500,
  width: '100%',
  overflow: 'hidden',
  boxShadow: '0 25px 50px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  background: 'white',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)', // Green gradient
  },
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
  },
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4, 2, 2),
  background: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)', // Blue-Green gradient
  position: 'relative',
  clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
}));

const ProfileDetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: "#f5f5f5",
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(10px)',
    background: "#dfdfdf",
  },
}));

const TeacherProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  // Safely access nested properties with optional chaining
  const teachSclass = currentUser?.teachSclass || {};
  const teachSubject = currentUser?.teachSubject || {};
  const teachSchool = currentUser?.school || {};

  return (
    <ProfileBackground>
      <ProfileCard elevation={6}>
        <ProfileHeader>
          <Box 
            sx={{ 
              width: 120, 
              height: 120, 
              bgcolor: 'white', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 2,
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: '4px solid',
              borderColor: 'primary.main'
            }}
          >
            <Typography 
              variant="h2" 
              color="primary" 
              fontWeight="bold"
            >
              {currentUser?.name?.[0]?.toUpperCase()}
            </Typography>
          </Box>

          <Typography variant="h4" color="white" fontWeight="bold">
            {currentUser?.name || 'Teacher Profile'}
          </Typography>
          <Typography variant="subtitle1" color="white" sx={{ opacity: 0.8 }}>
            Educator
          </Typography>
        </ProfileHeader>

        <CardContent sx={{ pt: 3, pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ProfileDetailItem>
                <PersonIcon 
                  color="primary" 
                  sx={{ mr: 2, fontSize: 32 }} 
                />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Full Name
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {currentUser?.name || 'N/A'}
                  </Typography>
                </Box>
              </ProfileDetailItem>
            </Grid>

            <Grid item xs={12}>
              <ProfileDetailItem>
                <EmailIcon 
                  color="secondary" 
                  sx={{ mr: 2, fontSize: 32 }} 
                />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Email Address
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {currentUser?.email || 'N/A'}
                  </Typography>
                </Box>
              </ProfileDetailItem>
            </Grid>

            <Grid item xs={12}>
              <ProfileDetailItem>
                <ClassIcon 
                  color="info" 
                  sx={{ mr: 2, fontSize: 32 }} 
                />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Assigned Class
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {teachSclass?.sclassName || 'No Class Assigned'}
                  </Typography>
                </Box>
              </ProfileDetailItem>
            </Grid>

            <Grid item xs={12}>
              <ProfileDetailItem>
                <BookIcon 
                  color="success" 
                  sx={{ mr: 2, fontSize: 32 }} 
                />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Subject Taught
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {teachSubject?.subName || 'No Subject Assigned'}
                  </Typography>
                </Box>
              </ProfileDetailItem>
            </Grid>

            <Grid item xs={12}>
              <ProfileDetailItem>
                <SchoolIcon 
                  color="warning" 
                  sx={{ mr: 2, fontSize: 32 }} 
                />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    School
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {teachSchool?.schoolName || 'No School Information'}
                  </Typography>
                </Box>
              </ProfileDetailItem>
            </Grid>
          </Grid>
        </CardContent>
      </ProfileCard>
    </ProfileBackground>
  );
};

export default TeacherProfile;