import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Fab,
  Zoom,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { calculateOverallAttendancePercentage } from "../../components/attendanceCalculator";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
import axios from "axios";
import {
  School as SubjectIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationIcon,
  QrCode as QrCodeIcon,
  Close as CloseIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import SeeNotice from "../../components/SeeNotice";
import { useNavigate } from "react-router-dom";

const StudentHomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedSubject, setSelectedSubject] = useState("");

  const dispatch = useDispatch();
  const { userDetails, currentUser } = useSelector((state) => state.user);
  const { subjectsList } = useSelector((state) => state.sclass);

  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const [openQrDialog, setOpenQrDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const classID = currentUser?.sclassName?._id;
  const studentName = currentUser?.name || "Student";

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserDetails(currentUser._id, "Student"));
    }
    if (classID) {
      dispatch(getSubjectList(classID, "ClassSubjects"));
    }
  }, [dispatch, currentUser, classID]);

  useEffect(() => {
    if (userDetails) {
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const numberOfSubjects = subjectsList?.length || 0;
  const overallAttendancePercentage =
    calculateOverallAttendancePercentage(subjectAttendance);

  const getQrCode = async () => {
    if (!selectedSubject) {
      alert("Please select a subject.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/Student/qrcode/${currentUser._id}`,
        {
          params: { subjectId: selectedSubject },
        }
      );
      setQrCode(response.data.qrCodeData);
      setOpenQrDialog(true);
    } catch (error) {
      console.error("Error fetching QR Code", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseQrDialog = () => {
    setOpenQrDialog(false);
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return theme.palette.success.main;
    if (percentage >= 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const attendanceColor = getAttendanceColor(overallAttendancePercentage);

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      {/* Welcome Header */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: theme.palette.primary.light,
                border: "2px solid white",
              }}
            >
              {studentName.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" fontWeight="bold">
              Welcome, {studentName}
            </Typography>
            <Typography variant="body1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ mb: 2, minWidth: 200 }}>
              <Typography variant="body1" fontWeight="bold">
                Select Subject:
              </Typography>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  marginTop: "5px",
                }}
              >
                <option value="">-- Choose a Subject --</option>
                {subjectsList?.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subName}
                  </option>
                ))}
              </select>
            </Box>

            <Tooltip title="Mark Attendance">
              <Button
                variant="contained"
                color="secondary"
                startIcon={<QrCodeIcon />}
                onClick={getQrCode}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  fontWeight: "bold",
                  px: 3,
                }}
              >
                {loading ? "Loading..." : "Attendance QR"}
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Main Dashboard Area */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} sm={4}>
              <StatsCard
                icon={<SubjectIcon />}
                title="Subjects"
                value={numberOfSubjects}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatsCard
                icon={<AssignmentIcon />}
                title="Assignments"
                value={15}
                color={theme.palette.info.main}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatsCard
                icon={<NotificationIcon />}
                title="Notifications"
                value={3}
                color={theme.palette.secondary.main}
              />
            </Grid>

            {/* Notices Section */}
            <Grid item xs={12}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  height: "100%",
                  minHeight: 300,
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <NotificationIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="medium">
                    Recent Notices
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <SeeNotice />
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Attendance Section */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              Overall Attendance
            </Typography>

            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                my: 3,
              }}
            >
              <CircularProgress
                variant="determinate"
                value={overallAttendancePercentage}
                size={200}
                thickness={5}
                sx={{
                  color: attendanceColor,
                  "& .MuiCircularProgress-circle": {
                    strokeLinecap: "round",
                  },
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{ color: attendanceColor }}
                >
                  {Math.round(overallAttendancePercentage)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {overallAttendancePercentage >= 75
                    ? "Excellent"
                    : overallAttendancePercentage >= 50
                    ? "Good"
                    : "Needs Improvement"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ width: "100%", mt: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                {overallAttendancePercentage >= 75
                  ? "Keep up the good work!"
                  : "Try to improve your attendance"}
              </Typography>

              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<CalendarIcon />}
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={() => navigate("Student/attendance")}
              >
                View Attendance Details
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Mobile Floating QR Button */}
      {isMobile && (
        <>
        <Box sx={{ mb: 2, minWidth: 200 }}>
        <Typography variant="body1" fontWeight="bold">
          Select Subject:
        </Typography>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "16px",
            marginTop: "5px",
          }}
        >
          <option value="">-- Choose a Subject --</option>
          {subjectsList?.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.subName}
            </option>
          ))}
        </select>
      </Box>
        <Zoom in={true}>
          <Fab
            color="secondary"
            aria-label="attendance"
            onClick={getQrCode}
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              zIndex: 1000,
            }}
          >
            <QrCodeIcon />
          </Fab>
        </Zoom>
        </>
      )}

      {/* QR Code Dialog */}
      <Dialog
        open={openQrDialog}
        onClose={handleCloseQrDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            bgcolor: theme.palette.primary.main,
            color: "white",
          }}
        >
          Your Attendance QR Code
          <IconButton
            aria-label="close"
            onClick={handleCloseQrDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 3 }}>
          {qrCode ? (
            <>
              <Box
                sx={{
                  p: 2,
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <img
                  src={qrCode || "/placeholder.svg"}
                  alt="Student QR Code"
                  style={{ width: "100%", maxWidth: 250, margin: "0 auto" }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Show this QR code to your teacher to mark your attendance
              </Typography>
            </>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

// Stats Card Component
const StatsCard = ({ icon, title, value, color }) => {
  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: 2,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              bgcolor: `${color}15`,
              color: color,
              width: 56,
              height: 56,
              mb: 1,
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudentHomePage;
