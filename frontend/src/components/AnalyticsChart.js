import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
  Chip,
  CircularProgress,
  Skeleton,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  School,
  CalendarMonth,
  Timeline,
  InsertChart,
  EmojiEvents,
  Warning,
  Lightbulb,
  ArrowUpward,
  ArrowDownward,
  Person,
  Info,
  Download,
  Refresh
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const StudentAnalytics = () => {
  const theme = useTheme();
  const { currentUser } = useSelector(state => state.user);
  const params = useParams();
  const userId = params.id || currentUser._id;
  
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Enhanced color palette
  const chartColors = {
    historical: '#6366f1', // Indigo
    predicted: '#8b5cf6', // Purple
    attendance: '#10b981', // Emerald
    improving: '#10b981', // Emerald
    declining: '#ef4444', // Red
    stable: '#3b82f6', // Blue
    background: '#f9fafb', // Light gray background
    cardBg: '#ffffff',
    gradientStart: '#e0e7ff', // Light indigo
    gradientEnd: '#e0f2fe', // Light blue
    borderColor: '#e5e7eb',
    passingLine: '#8b5cf6', // Purple
    targetLine: '#f59e0b', // Amber
    radar: '#6366f1', // Indigo
    radarFill: 'rgba(99, 102, 241, 0.2)' // Transparent indigo
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/student-analytics/${userId}`);
        setAnalytics(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching student analytics:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userId]);

  // Helper function to render trend icon
  const renderTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp sx={{ color: chartColors.improving }} />;
      case 'declining':
        return <TrendingDown sx={{ color: chartColors.declining }} />;
      default:
        return <TrendingFlat sx={{ color: chartColors.stable }} />;
    }
  };

  // Helper function to determine color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return chartColors.improving;
    if (score >= 70) return chartColors.stable;
    if (score >= 60) return '#f59e0b'; // Amber
    return chartColors.declining;
  };

  // Helper function to create gradient for area charts
  const getChartGradient = (id, color, opacity = 0.2) => (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
      <stop offset="95%" stopColor={color} stopOpacity={opacity} />
    </linearGradient>
  );

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
  };

  // Render loading skeleton
  if (loading) {
    return (
      <Box sx={{ 
        p: { xs: 2, md: 4 }, 
        bgcolor: chartColors.background,
        minHeight: '100vh'
      }}>
        <Skeleton variant="rectangular" height={80} sx={{ mb: 4, borderRadius: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={300} sx={{ mt: 4, borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box sx={{ 
        p: { xs: 2, md: 4 }, 
        bgcolor: chartColors.background,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            maxWidth: 500,
            width: '100%',
            textAlign: 'center',
            borderRadius: 3,
            border: `1px solid ${chartColors.borderColor}`
          }}
        >
          <Warning sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Data Retrieval Error
          </Typography>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            startIcon={<Refresh />}
            sx={{ 
              borderRadius: 8,
              px: 3,
              py: 1,
              bgcolor: chartColors.historical,
              '&:hover': {
                bgcolor: '#4f46e5'
              }
            }}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  // Render empty state if no data
  if (!analytics) {
    return (
      <Box sx={{ 
        p: { xs: 2, md: 4 },
        bgcolor: chartColors.background,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            maxWidth: 500,
            width: '100%',
            textAlign: 'center',
            borderRadius: 3,
            border: `1px solid ${chartColors.borderColor}`
          }}
        >
          <School sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            No Analytics Data
          </Typography>
          <Typography variant="body1" color="text.secondary">
            There is no analytics data available for this student at the moment.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Generate predictions array from subject performance if not provided
  const predictions = analytics.subjectPerformance.map(subject => {
    // Use overall prediction for all subjects if individual predictions aren't available
    const predictedScore = analytics.metrics.overallPrediction;
    const trend = analytics.metrics.performanceTrend;
    return {
      subject: subject.subject,
      currentScore: subject.average,
      predictedScore,
      trend
    };
  });

  // Data formatting for charts
  const formatProgressChartData = () => {
    return analytics.chartData.progressChart.map(item => ({
      ...item,
      // Convert null to undefined for better chart rendering
      average: item.average === null ? undefined : item.average,
      predicted: item.predicted === null ? undefined : item.predicted
    }));
  };

  // Generate insights if not provided
  const insightSummary = [
    `Attendance is ${analytics.metrics.attendanceTrend} at ${analytics.metrics.overallAttendance}%.`,
    `Overall performance is ${analytics.metrics.performanceTrend} with a predicted score of ${analytics.metrics.overallPrediction}%.`,
    analytics.metrics.overallPrediction < 70 ? 
      "Warning: Predicted performance is below the passing threshold." : 
      "Positive: Current performance is above average."
  ];

  // Format data for radar chart
  const radarData = analytics.subjectPerformance.map(subject => ({
    subject: subject.subject,
    score: subject.average,
    fullMark: 100
  }));

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      bgcolor: chartColors.background,
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 4 }, 
          mb: 4, 
          background: `linear-gradient(135deg, ${chartColors.gradientStart}, ${chartColors.gradientEnd})`,
          borderRadius: 3,
          border: `1px solid ${chartColors.borderColor}`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: { xs: '100%', md: '30%' },
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 70%)',
            zIndex: 0
          }}
        />
        
        <Grid container spacing={2} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item>
            <Avatar 
              sx={{ 
                bgcolor: chartColors.historical,
                width: { xs: 56, md: 72 },
                height: { xs: 56, md: 72 },
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
              }}
            >
              <Person sx={{ fontSize: { xs: 30, md: 40 } }} />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
              {analytics.student.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#475569', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <span>Class {analytics.student.class}</span>
              <span style={{ fontSize: '20px', lineHeight: 0 }}>•</span>
              <span>Section {analytics.student.section}</span>
              <span style={{ fontSize: '20px', lineHeight: 0 }}>•</span>
              <span>Roll #{analytics.student.rollNum}</span>
            </Typography>
          </Grid>
          <Grid item sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip 
              icon={renderTrendIcon(analytics.metrics.performanceTrend)} 
              label={`${analytics.metrics.performanceTrend.charAt(0).toUpperCase() + analytics.metrics.performanceTrend.slice(1)}`}
              color={analytics.metrics.performanceTrend === 'improving' ? 'success' : analytics.metrics.performanceTrend === 'declining' ? 'error' : 'primary'}
              sx={{ 
                px: 1, 
                borderRadius: 6,
                fontWeight: 500,
                '& .MuiChip-icon': { 
                  color: 'inherit' 
                }
              }}
            />
            {/* <Tooltip title="Download Report">
              <IconButton 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.5)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' }
                }}
              >
                <Download />
              </IconButton>
            </Tooltip> */}
          </Grid>
        </Grid>
      </Paper>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', 
              transition: 'all 0.3s', 
              '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.05)' },
              borderRadius: 3,
              border: `1px solid ${chartColors.borderColor}`,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ height: 6, bgcolor: chartColors.historical }} />
            <CardContent sx={{ height: 'calc(100% - 6px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ mr: 1.5, color: chartColors.historical }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Current Average
                </Typography>
              </Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 700,
                  color: getScoreColor(analytics.metrics.overallAverage),
                  display: 'flex',
                  alignItems: 'baseline'
                }}
              >
                {analytics.metrics.overallAverage.toFixed(1)}
                <Typography component="span" variant="h6" sx={{ ml: 0.5, fontWeight: 500, opacity: 0.7 }}>%</Typography>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Info sx={{ fontSize: 18, color: '#94a3b8', mr: 1 }} />
                <Typography variant="body2" color="#64748b">
                  Average score across all subjects
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', 
              transition: 'all 0.3s', 
              '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.05)' },
              borderRadius: 3,
              border: `1px solid ${chartColors.borderColor}`,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ height: 6, bgcolor: chartColors.predicted }} />
            <CardContent sx={{ height: 'calc(100% - 6px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline sx={{ mr: 1.5, color: chartColors.predicted }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Predicted Performance
                </Typography>
              </Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 700,
                  color: getScoreColor(analytics.metrics.overallPrediction),
                  display: 'flex',
                  alignItems: 'baseline'
                }}
              >
                {analytics.metrics.overallPrediction.toFixed(1)}
                <Typography component="span" variant="h6" sx={{ ml: 0.5, fontWeight: 500, opacity: 0.7 }}>%</Typography>
              </Typography>
              <Box sx={{ mt: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {renderTrendIcon(analytics.metrics.performanceTrend)}
                  <Typography 
                    variant="body2" 
                    sx={{ ml: 1, fontWeight: 500 }} 
                    color={
                      analytics.metrics.performanceTrend === 'improving' ? chartColors.improving : 
                      analytics.metrics.performanceTrend === 'declining' ? chartColors.declining : 
                      chartColors.stable
                    }
                  >
                    {analytics.metrics.overallPrediction > analytics.metrics.overallAverage 
                      ? `+${(analytics.metrics.overallPrediction - analytics.metrics.overallAverage).toFixed(1)}%` 
                      : `${(analytics.metrics.overallPrediction - analytics.metrics.overallAverage).toFixed(1)}%`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Info sx={{ fontSize: 18, color: '#94a3b8', mr: 1 }} />
                  <Typography variant="body2" color="#64748b">
                    Projected average for next assessment
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', 
              transition: 'all 0.3s', 
              '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.05)' },
              borderRadius: 3,
              border: `1px solid ${chartColors.borderColor}`,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ height: 6, bgcolor: chartColors.attendance }} />
            <CardContent sx={{ height: 'calc(100% - 6px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarMonth sx={{ mr: 1.5, color: chartColors.attendance }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Attendance Rate
                </Typography>
              </Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 700,
                  color: getScoreColor(analytics.metrics.overallAttendance),
                  display: 'flex',
                  alignItems: 'baseline'
                }}
              >
                {analytics.metrics.overallAttendance}
                <Typography component="span" variant="h6" sx={{ ml: 0.5, fontWeight: 500, opacity: 0.7 }}>%</Typography>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Info sx={{ fontSize: 18, color: '#94a3b8', mr: 1 }} />
                <Typography variant="body2" color="#64748b">
                  Overall attendance percentage
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Progress Chart */}
      <Card 
        elevation={0} 
        sx={{ 
          mb: 4, 
          transition: 'all 0.3s', 
          '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.05)' },
          borderRadius: 3,
          border: `1px solid ${chartColors.borderColor}`,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ height: 6, bgcolor: chartColors.historical }} />
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
              <InsertChart sx={{ mr: 1.5, color: chartColors.historical }} />
              Performance Trend & Prediction
            </Typography>
            <Tooltip title="This chart shows historical performance and future predictions based on current trends">
              <IconButton size="small">
                <Info sx={{ fontSize: 18, color: '#94a3b8' }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ height: 380, px: { xs: 0, md: 1 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formatProgressChartData()}
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
              >
                <defs>
                  {getChartGradient('colorHistorical', chartColors.historical)}
                  {getChartGradient('colorPrediction', chartColors.predicted, 0.4)}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tickCount={6} 
                  tick={{ fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <RechartsTooltip 
                  formatter={(value) => [`${value}%`, value === undefined ? 'Predicted' : 'Actual']}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => <span style={{ color: '#1e293b', fontWeight: 500 }}>{value}</span>}
                />
                <ReferenceLine 
                  y={70} 
                  label={{ 
                    value: "Passing Grade", 
                    position: 'insideBottomRight',
                    fill: chartColors.passingLine,
                    fontSize: 12,
                    fontWeight: 500
                  }} 
                  stroke={chartColors.passingLine} 
                  strokeDasharray="3 3" 
                />
                <Area 
                  type="monotone" 
                  dataKey="average" 
                  name="Historical" 
                  stroke={chartColors.historical} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorHistorical)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  name="Predicted" 
                  stroke={chartColors.predicted} 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={1} 
                  fill="url(#colorPrediction)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
      
      {/* Attendance Chart and Subject Performance */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', 
              transition: 'all 0.3s', 
              '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.05)' },
              borderRadius: 3,
              border: `1px solid ${chartColors.borderColor}`,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ height: 6, bgcolor: chartColors.attendance }} />
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
                  <CalendarMonth sx={{ mr: 1.5, color: chartColors.attendance }} />
                  Attendance Trend
                </Typography>
                <Tooltip title="Monthly attendance percentage">
                  <IconButton size="small">
                    <Info sx={{ fontSize: 18, color: '#94a3b8' }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ height: 280, px: { xs: 0, md: 1 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.chartData.attendanceTrend}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={formatDate}
                      tick={{ fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tickCount={6} 
                      tick={{ fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <RechartsTooltip 
                      formatter={(value) => [`${value}%`, 'Attendance']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return `Month: ${date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}`;
                      }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                    />
                    <ReferenceLine 
                      y={75} 
                      label={{ 
                        value: "Target", 
                        position: 'insideBottomRight',
                        fill: chartColors.targetLine,
                        fontSize: 12,
                        fontWeight: 500
                      }} 
                      stroke={chartColors.targetLine} 
                      strokeDasharray="3 3" 
                    />
                    <Bar 
                      dataKey="percentage" 
                      name="Attendance" 
                      fill={chartColors.attendance} 
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', 
              transition: 'all 0.3s', 
              '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.05)' },
              borderRadius: 3,
              border: `1px solid ${chartColors.borderColor}`,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ height: 6, bgcolor: chartColors.radar }} />
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
                  <School sx={{ mr: 1.5, color: chartColors.radar }} />
                  Subject Performance
                </Typography>
                <Tooltip title="Performance across different subjects">
                  <IconButton size="small">
                    <Info sx={{ fontSize: 18, color: '#94a3b8' }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ height: 280, px: { xs: 0, md: 1 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={{ fill: '#64748b' }}
                    />
                    <Radar 
                      name="Score" 
                      dataKey="score" 
                      stroke={chartColors.radar} 
                      fill={chartColors.radarFill} 
                      fillOpacity={0.6} 
                    />
                    <RechartsTooltip 
                      formatter={(value) => [`${value}%`, 'Score']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '10px' }}
                      formatter={(value) => <span style={{ color: '#1e293b', fontWeight: 500 }}>{value}</span>}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Insights */}
      <Card 
        elevation={0} 
        sx={{ 
          mb: 4, 
          transition: 'all 0.3s', 
          '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.05)' },
          borderRadius: 3,
          border: `1px solid ${chartColors.borderColor}`,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ height: 6, bgcolor: '#f59e0b' }} />
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', px: 1 }}>
            <Lightbulb sx={{ mr: 1.5, color: '#f59e0b' }} />
            AI Insights & Recommendations
          </Typography>
          <List sx={{ 
            bgcolor: 'rgba(245, 158, 11, 0.05)', 
            borderRadius: 2,
            py: 1
          }}>
            {insightSummary.map((insight, index) => (
              <ListItem key={index} sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                  {insight.includes('Warning') || insight.includes('attention') ? (
                    <Warning fontSize="small" sx={{ color: chartColors.declining }} />
                  ) : insight.includes('Positive') || insight.includes('Strongest') ? (
                    <EmojiEvents fontSize="small" sx={{ color: chartColors.improving }} />
                  ) : (
                    <Lightbulb fontSize="small" sx={{ color: '#f59e0b' }} />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={insight} 
                  primaryTypographyProps={{ 
                    sx: { 
                      fontWeight: 500,
                      color: insight.includes('Warning') ? chartColors.declining : 
                             insight.includes('Positive') ? chartColors.improving : 
                             '#1e293b'
                    } 
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      
      {/* Predictions Detail */}
      <Card 
        elevation={0} 
        sx={{ 
          transition: 'all 0.3s', 
          '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.05)' },
          borderRadius: 3,
          border: `1px solid ${chartColors.borderColor}`,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ height: 6, bgcolor: chartColors.predicted }} />
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', px: 1 }}>
            <Timeline sx={{ mr: 1.5, color: chartColors.predicted }} />
            Performance Predictions
          </Typography>
          <Grid container spacing={2}>
            {predictions.map((prediction, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%',
                    borderRadius: 2,
                    border: `1px solid ${chartColors.borderColor}`,
                    transition: 'all 0.2s',
                    '&:hover': { 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      borderColor: chartColors.predicted
                    }
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {prediction.subject}
                      </Typography>
                      {renderTrendIcon(prediction.trend)}
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748b" sx={{ mb: 0.5 }}>
                          Current Score
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: getScoreColor(prediction.currentScore),
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'baseline'
                          }}
                        >
                          {prediction.currentScore.toFixed(1)}
                          <Typography component="span" variant="caption" sx={{ ml: 0.5, fontWeight: 500, opacity: 0.7 }}>%</Typography>
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748b" sx={{ mb: 0.5 }}>
                          Predicted
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: getScoreColor(prediction.predictedScore),
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {prediction.predictedScore.toFixed(1)}
                          <Typography component="span" variant="caption" sx={{ ml: 0.5, fontWeight: 500, opacity: 0.7 }}>%</Typography>
                          {prediction.predictedScore !== prediction.currentScore && (
                            <Box 
                              component="span" 
                              sx={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                ml: 1,
                                fontSize: '0.75rem',
                                color: prediction.predictedScore > prediction.currentScore ? chartColors.improving : chartColors.declining,
                                bgcolor: prediction.predictedScore > prediction.currentScore ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                px: 0.75,
                                py: 0.25,
                                borderRadius: 1
                              }}
                            >
                              {prediction.predictedScore > prediction.currentScore ? (
                                <ArrowUpward sx={{ fontSize: 12, mr: 0.5 }} />
                              ) : (
                                <ArrowDownward sx={{ fontSize: 12, mr: 0.5 }} />
                              )}
                              {Math.abs(prediction.predictedScore - prediction.currentScore).toFixed(1)}
                            </Box>
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentAnalytics;
