import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Avatar, 
  Container, 
  Paper,
  Box
} from '@mui/material';

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response); }
  else if (error) { console.log(error); }

  const sclassName = currentUser.sclassName;
  const studentSchool = currentUser.school;

  return (
    <Container
      maxWidth="lg"
      style={{
        background: "linear-gradient(135deg, #F3E5F5, #E3F2FD)",
        minHeight: "100vh",
        padding: "3rem 1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={12}
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "1.5rem",
          boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.15)",
          width: "100%",
          maxWidth: "800px",
          padding: "2rem",
        }}
      >
        <Box
          style={{
            background: "linear-gradient(90deg, #42A5F5, #AB47BC)",
            padding: "2rem",
            borderRadius: "1rem",
            textAlign: "center",
            color: "white",
          }}
        >
          <Avatar
            alt="Student Avatar"
            style={{
              width: "8rem",
              height: "8rem",
              margin: "0 auto",
              fontSize: "3rem",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #42A5F5, #64B5F6)",
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            {String(currentUser.name).charAt(0)}
          </Avatar>
          <Typography
            variant="h4"
            style={{
              marginTop: "1rem",
              fontWeight: "bold",
              textShadow: "1px 2px 5px rgba(0, 0, 0, 0.3)",
            }}
          >
            {currentUser.name}
          </Typography>
        </Box>
        
        <Grid container spacing={3} style={{ marginTop: "2rem" }}>
          {[{
            label: "Roll Number",
            value: currentUser.rollNum,
          }, {
            label: "Class",
            value: sclassName.sclassName,
          }, {
            label: "School",
            value: studentSchool.schoolName,
          }].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={6}
                style={{
                  borderRadius: "1rem",
                  background: "linear-gradient(135deg, #FFFFFF, #E3F2FD)",
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
                  textAlign: "center",
                  padding: "1.5rem",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0px 15px 25px rgba(0, 0, 0, 0.2)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.15)";
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    style={{
                      color: "#333",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      color: "#555",
                      fontWeight: "500",
                    }}
                  >
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default StudentProfile;
