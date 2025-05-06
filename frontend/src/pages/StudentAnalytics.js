import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchStudentAnalytics } from '../redux/studentRelated/studentAnalyticsSlice'; 
import StudentAnalyticsDashboard from '../components/AnalyticsChart'; 

const StudentAnalytics = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { analytics, analyticsLoading, analyticsError } = useSelector(state => state.student);
  const params = useParams();
  const userId = params.id || currentUser._id;

  useEffect(() => {
    dispatch(fetchStudentAnalytics(userId));
  }, [dispatch, userId, currentUser._id]);

  return (
    <Box>
      <StudentAnalyticsDashboard 
        analytics={analytics}
        loading={analyticsLoading}
        error={analyticsError}
        userId={userId}
      />
    </Box>
  );
};

export default StudentAnalytics;
