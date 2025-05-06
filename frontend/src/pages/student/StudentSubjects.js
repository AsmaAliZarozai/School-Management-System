import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import {
    BottomNavigation,
    BottomNavigationAction,
    Container,
    Paper,
    Table,
    TableBody,
    TableHead,
    Typography,
    TableContainer,
    TableRow,
    TableCell,
    Box,
    CircularProgress,
} from '@mui/material';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

const StudentSubjects = () => {
    const dispatch = useDispatch();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectMarks(userDetails.examResult || []);
        }
    }, [userDetails]);

    useEffect(() => {
        if (subjectMarks.length === 0) {
            dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
        }
    }, [subjectMarks, dispatch, currentUser.sclassName._id]);

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => (
        <Box>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '1.5rem',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
                }}
            >
                Subject Marks
            </Typography>
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: '1rem',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#F5F5F5' }}>
                            <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>
                                Subject
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>
                                Marks
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subjectMarks.map((result, index) => (
                            <TableRow
                                key={index}
                                hover
                                sx={{
                                    '&:hover': { backgroundColor: '#F9F9F9' },
                                }}
                            >
                                <TableCell>{result.subName.subName}</TableCell>
                                <TableCell>{result.marksObtained}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderChartSection = () => (
        <Box>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '1.5rem',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
                }}
            >
                Subject Marks Chart
            </Typography>
            <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
        </Box>
    );

    const renderClassDetailsSection = () => (
        <Container>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ fontWeight: 'bold', color: '#333', marginBottom: '2rem' }}
            >
                Class Details
            </Typography>
            <Typography variant="h6" gutterBottom>
                You are currently in Class {sclassDetails && sclassDetails.sclassName}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Subjects:
            </Typography>
            {subjectsList.map((subject, index) => (
                <Typography key={index} variant="body1">
                    {subject.subName} ({subject.subCode})
                </Typography>
            ))}
        </Container>
    );

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #E3F2FD, #FCE4EC)',
                padding: '2rem',
            }}
        >
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {subjectMarks.length > 0 ? (
                        <>
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}
                            <Paper
                                sx={{
                                    position: 'fixed',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    boxShadow: '0px -5px 10px rgba(0,0,0,0.1)',
                                }}
                                elevation={3}
                            >
                                <BottomNavigation
                                    value={selectedSection}
                                    onChange={handleSectionChange}
                                    showLabels
                                    sx={{
                                        background: 'linear-gradient(90deg, #42A5F5, #64B5F6)',
                                        color: 'white',
                                    }}
                                >
                                    <BottomNavigationAction
                                        label="Table"
                                        value="table"
                                        icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Chart"
                                        value="chart"
                                        icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                    />
                                </BottomNavigation>
                            </Paper>
                        </>
                    ) : (
                        renderClassDetailsSection()
                    )}
                </>
            )}
        </Box>
    );
};

export default StudentSubjects;
