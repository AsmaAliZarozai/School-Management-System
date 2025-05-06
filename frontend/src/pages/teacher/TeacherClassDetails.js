import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Avatar, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent 
} from '@mui/material';
import { 
  Person as PersonIcon, 
  AssignmentInd as AssignmentIndIcon, 
  School as SchoolIcon,
  CheckCircleOutline as AttendanceIcon,
  GradeOutlined as MarksIcon,
  Analytics
} from '@mui/icons-material';

const TeacherClassDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { 
    sclassStudents, 
    loading, 
    error, 
    getresponse 
  } = useSelector((state) => state.sclass);
  
  const { currentUser } = useSelector((state) => state.user);
  const classID = currentUser.teachSclass?._id;
  const subjectID = currentUser.teachSubject?._id;

  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (classID) {
      dispatch(getClassStudents(classID));
    }
  }, [dispatch, classID]);

  const handleStudentAction = (student, action) => {
    switch(action) {
      case 'view':
        navigate(`/Teacher/class/student/${student.id}`);
        break;
      case 'attendance':
        navigate(`/Teacher/class/student/attendance/${student.id}/${subjectID}`);
        break;
      case 'marks':
        navigate(`/Teacher/class/student/marks/${student.id}/${subjectID}`);
        break;
      case 'analytics':
        navigate(`/Teacher/student-analytics/${student.id}`);
        break;
      default:
        break;
    }
  };

  const StudentCard = ({ student }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 3
        }
      }}
    >
      <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        flex: 1 
      }}>
        <Avatar 
          sx={{ 
            width: 80, 
            height: 80, 
            mb: 2,
            bgcolor: 'primary.main' 
          }}
        >
          <PersonIcon sx={{ fontSize: 50 }} />
        </Avatar>
        <Typography variant="h6" gutterBottom>
          {student.name}
        </Typography>
        <Chip 
          icon={<AssignmentIndIcon />} 
          label={`Roll No: ${student.rollNum}`} 
          variant="outlined" 
          sx={{ mb: 1 }}
        />
      </CardContent>
      <CardActions sx={{ 
        justifyContent: 'center', 
        gap: 1, 
        pb: 2 
      }}>
        <Chip 
          icon={<SchoolIcon />}
          label="View Profile" 
          clickable 
          color="primary" 
          onClick={() => handleStudentAction(student, 'view')}
        />
        <Chip 
          icon={<AttendanceIcon />}
          label="Attendance" 
          clickable 
          color="secondary" 
          onClick={() => handleStudentAction(student, 'attendance')}
        />
      </CardActions>
      <CardActions sx={{ 
        justifyContent: 'center', 
        gap: 1, 
        pb: 2 
      }}>
        <Chip 
          icon={<MarksIcon />}
          label="Marks" 
          clickable 
          color="success" 
          onClick={() => handleStudentAction(student, 'marks')}
        />
        <Chip 
          icon={<Analytics />}
          label="Analytics" 
          clickable 
          color="success" 
          onClick={() => handleStudentAction(student, 'analytics')}
        />
      </CardActions>
    </Card>
  );

  if (loading) return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}
    >
      <Typography variant="h5">Loading Students...</Typography>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4, 
          textAlign: 'center', 
          fontWeight: 'bold',
          color: 'primary.main' 
        }}
      >
        Class Details: {currentUser.teachSclass?.sclassName}
      </Typography>

      {getresponse || !sclassStudents || sclassStudents.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh' 
          }}
        >
          <Typography 
            variant="h5" 
            color="text.secondary"
          >
            No Students Found in this Class
          </Typography>
        </Box>
      ) : (
        <Grid 
          container 
          spacing={3} 
          justifyContent="center"
        >
          {sclassStudents.map((student) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={student._id}
            >
              <StudentCard student={{
                id: student._id,
                name: student.name,
                rollNum: student.rollNum
              }} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TeacherClassDetails;