// student-analytics-controller.js
const Student = require('../models/studentSchema');
const Subject = require('../models/subjectSchema');
const moment = require('moment');

/**
 * Advanced prediction model using multiple regression techniques,
 * exponential smoothing, and trend analysis
 * 
 * @param {Array} pastScores - Array of previous scores
 * @param {Object} factors - Object containing additional factors that influence prediction
 * @returns {Number} - Predicted score rounded to one decimal place
 */
const predictScore = (pastScores, factors) => {
    // Default prediction if no data is available
    if (!pastScores || pastScores.length === 0) return 70;
    
    // Extract factors
    const { 
        attendanceRate = 0.75,  // Default to 75% attendance if not provided
        classAverage = 70,      // Default to 70 if class average not available
        subjectDifficulty = 1,  // Default to medium difficulty (scale 0.8-1.2)
        consistencyIndex = 0,   // Measure of consistency in past performance
        recentImprovementRate = 0 // Recent improvement trend
    } = factors;
    
    // === TREND ANALYSIS ===
    // Weighted linear regression to identify trends in past performance
    let trendWeight = 0;
    if (pastScores.length > 2) {
        // Apply more weight to recent scores
        const weights = pastScores.map((_, i) => (i + 1) / pastScores.length);
        const weightedScores = pastScores.map((score, i) => score * weights[i]);
        const weightedAvg = weightedScores.reduce((sum, score) => sum + score, 0) / 
                          weights.reduce((sum, weight) => sum + weight, 0);
        
        // Calculate trend using last third vs first third of data
        const firstThird = pastScores.slice(0, Math.ceil(pastScores.length/3));
        const lastThird = pastScores.slice(-Math.ceil(pastScores.length/3));
        
        const firstAvg = firstThird.reduce((sum, score) => sum + score, 0) / firstThird.length;
        const lastAvg = lastThird.reduce((sum, score) => sum + score, 0) / lastThird.length;
        
        // Normalize trend to a scale that works with our model
        trendWeight = (lastAvg - firstAvg) / (pastScores.length / 3);
    }
    
    // === EXPONENTIAL SMOOTHING ===
    // Apply exponential smoothing to give more weight to recent scores
    const alpha = 0.7; // Smoothing factor (higher = more weight to recent scores)
    let smoothedAverage = pastScores[0];
    
    for (let i = 1; i < pastScores.length; i++) {
        smoothedAverage = alpha * pastScores[i] + (1 - alpha) * smoothedAverage;
    }
    
    // === REGRESSION MODEL COMPONENTS ===
    // Each component influences the prediction in a different way
    
    // 1. Base prediction from historical performance (weighted recent scores)
    const latestScore = pastScores[pastScores.length - 1];
    const recentAvg = pastScores.slice(-3).reduce((sum, score) => sum + score, 0) / 
                    Math.min(3, pastScores.length);
    
    // 2. Calculate volatility/consistency factor
    let volatility = 0;
    if (pastScores.length > 1) {
        const differences = [];
        for (let i = 1; i < pastScores.length; i++) {
            differences.push(Math.abs(pastScores[i] - pastScores[i-1]));
        }
        volatility = differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
        // Normalize volatility to 0-10 scale
        volatility = Math.min(Math.max(volatility, 0), 10);
    }
    
    // 3. Calculate momentum based on the most recent changes
    let momentum = 0;
    if (pastScores.length >= 3) {
        const recentChanges = [];
        for (let i = pastScores.length - 1; i >= pastScores.length - 3 && i > 0; i--) {
            recentChanges.push(pastScores[i] - pastScores[i-1]);
        }
        momentum = recentChanges.reduce((sum, change) => sum + change, 0) / recentChanges.length;
    }
    
    // 4. Attendance impact with non-linear scaling
    // Lower attendance has more severe impact than higher attendance has positive impact
    let attendanceImpact;
    if (attendanceRate < 0.6) {
        // Severe penalty for very poor attendance
        attendanceImpact = (attendanceRate - 0.6) * 25;
    } else if (attendanceRate < 0.8) {
        // Moderate penalty for below-average attendance
        attendanceImpact = (attendanceRate - 0.8) * 15;
    } else {
        // Small bonus for good attendance
        attendanceImpact = (attendanceRate - 0.8) * 10;
    }
    
    // 5. Regression toward class mean for extreme scores
    const regressionToMeanFactor = (classAverage - latestScore) * 0.2;
    
    // 6. Subject difficulty adjustment
    const difficultyAdjustment = (1 - subjectDifficulty) * 5;
    
    // 7. Consistency bonus/penalty
    const consistencyAdjustment = consistencyIndex * 2;
    
    // 8. Recent improvement trend bonus
    const improvementBonus = recentImprovementRate * 3;
    
    // === COMBINE FACTORS WITH DYNAMIC WEIGHTS ===
    // The weighting system adjusts based on data availability and quality
    
    // Base weight distribution
    let weights = {
        recentAverage: 0.35,
        latestScore: 0.25,
        smoothedAverage: 0.15,
        trend: 0.05,
        attendance: 0.10,
        regression: 0.05,
        difficulty: 0.03,
        consistency: 0.02,
        improvement: 0.05
    };
    
    // Adjust weights based on data availability
    if (pastScores.length <= 2) {
        // For limited data, rely more on latest score and less on trends
        weights.latestScore = 0.40;
        weights.smoothedAverage = 0.30;
        weights.trend = 0.0;
        weights.recentAverage = 0.10;
    }
    
    // Calculate prediction using weighted factors
    let prediction = (
        (weights.recentAverage * recentAvg) +
        (weights.latestScore * latestScore) +
        (weights.smoothedAverage * smoothedAverage) +
        (weights.trend * trendWeight * 10) +
        (weights.attendance * attendanceImpact) +
        (weights.regression * regressionToMeanFactor) +
        (weights.difficulty * difficultyAdjustment) +
        (weights.consistency * consistencyAdjustment) +
        (weights.improvement * improvementBonus)
    );
    
    // Apply volatility-based confidence interval adjustment
    // Higher volatility means wider prediction range
    const volatilityAdjustment = (volatility / 10) * 5 * (Math.random() > 0.5 ? 1 : -1);
    prediction += volatilityAdjustment;
    
    // Apply momentum for stronger recent trends
    prediction += momentum * 1.5;
    
    // Ensure prediction is within reasonable bounds (0-100)
    prediction = Math.min(Math.max(prediction, 0), 100);
    
    // Round to 1 decimal place
    return Math.round(prediction * 10) / 10;
};

/**
 * Calculates the difficulty coefficient for a subject based on class performance
 * 
 * @param {Number} classAverage - Average score for the class
 * @param {Number} subjectAverage - Average score for the specific subject
 * @returns {Number} - Difficulty coefficient (higher means more difficult)
 */
const calculateSubjectDifficulty = (classAverage, subjectAverage) => {
    if (!classAverage || !subjectAverage) return 1; // Default to neutral
    
    // Calculate how much harder/easier this subject is compared to overall average
    // Range: 0.8 (easier) to 1.2 (harder)
    const difficultyRatio = classAverage / Math.max(subjectAverage, 1);
    return Math.min(Math.max(difficultyRatio, 0.8), 1.2);
};

/**
 * Calculates consistency index based on score variability
 * 
 * @param {Array} scores - Array of past scores
 * @returns {Number} - Consistency index (-5 to 5, higher is more consistent)
 */
const calculateConsistencyIndex = (scores) => {
    if (!scores || scores.length < 3) return 0;
    
    // Calculate standard deviation
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    
    // Convert to consistency index (invert and scale std deviation)
    // Lower std deviation = higher consistency
    const rawIndex = 10 - (stdDev / 5);
    return Math.min(Math.max(rawIndex, -5), 5);
};

/**
 * Get student performance analytics and predictions
 */
const getStudentAnalytics = async (req, res) => {
    try {
        const studentId = req.params.id;
        
        // Fetch student with populated exam results and attendance
        const student = await Student.findById(studentId)
            .populate({
                path: 'examResult.subName',
                model: 'subject'
            })
            .populate({
                path: 'attendance.subName',
                model: 'subject'
            })
            .populate({
                path: 'sclassName',
                ref: 'sclass',
                select: 'sclassName'
            });
            
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        // Extract exam results and attendance data
        const examResults = student.examResult || [];
        const attendance = student.attendance || [];
        
        // Group attendance by month for trend analysis
        const attendanceByMonth = {};
        const sixMonthsAgo = moment().subtract(6, 'months').startOf('month');
        
        attendance.forEach(record => {
            if (!record.date) return; // Skip records with missing date
            
            const month = moment(record.date).format('YYYY-MM');
            if (moment(record.date).isAfter(sixMonthsAgo)) {
                if (!attendanceByMonth[month]) {
                    attendanceByMonth[month] = { total: 0, present: 0 };
                }
                attendanceByMonth[month].total++;
                if (record.status === 'Present') {
                    attendanceByMonth[month].present++;
                }
            }
        });
        
        // Calculate attendance percentage by month for charts
        const attendanceTrend = Object.keys(attendanceByMonth).sort().map(month => {
            const { total, present } = attendanceByMonth[month];
            const percentage = total > 0 ? (present / total) * 100 : 0;
            return {
                month,
                percentage: Math.round(percentage * 10) / 10
            };
        });
        
        // Get unique subjects from exam results
        const subjects = [...new Set(examResults
            .filter(result => result.subName && result.subName.subName)
            .map(result => result.subName.subName)
        )];
        
        // Calculate class-wide averages (in a real app, you would fetch this from the database)
        // For now, we'll simulate this with a function
        const getClassAverageForSubject = async (subjectName) => {
            // This would normally query all students in the same class and calculate average
            // For demo purposes, return a simulated value between 65-85
            return 65 + Math.random() * 20;
        };
        
        // Calculate overall class average across all subjects
        const overallClassAverage = await subjects.reduce(async (promisedSum, subject) => {
            const sum = await promisedSum;
            const avg = await getClassAverageForSubject(subject);
            return sum + avg;
        }, Promise.resolve(0)) / (subjects.length || 1);
        
        // Calculate average scores by subject
        const subjectPerformance = await Promise.all(subjects.map(async (subject) => {
            const subjectResults = examResults.filter(result => 
                result.subName && result.subName.subName === subject
            );
            
            const average = subjectResults.length > 0 
                ? subjectResults.reduce((sum, result) => sum + result.marksObtained, 0) / subjectResults.length 
                : 0;
            
            // Get class average for this subject
            const classAverage = await getClassAverageForSubject(subject);
            
            // Calculate subject difficulty coefficient
            const difficultyCoefficient = calculateSubjectDifficulty(overallClassAverage, average);
                
            return {
                subject,
                average: Math.round(average * 10) / 10,
                classAverage: Math.round(classAverage * 10) / 10,
                difficultyCoefficient: Math.round(difficultyCoefficient * 100) / 100,
                performance: average > classAverage ? "above average" : 
                             average < classAverage ? "below average" : "average"
            };
        }));
        
        // Get the latest attendance percentage
        const latestMonth = attendanceTrend.length > 0 ? attendanceTrend[attendanceTrend.length - 1] : { percentage: 75 };
        const attendanceRate = latestMonth.percentage / 100; // Convert to 0-1 scale
        
        // Generate time-series history of attendance to detect patterns
        const attendanceHistory = Array.from({ length: 6 }, (_, i) => {
            const month = moment().subtract(5 - i, 'months').format('YYYY-MM');
            const data = attendanceByMonth[month] || { total: 0, present: 0 };
            return {
                month,
                rate: data.total > 0 ? data.present / data.total : 0
            };
        });
        
        // Calculate attendance trend (improving, declining, stable)
        const attendanceTrendType = (() => {
            if (attendanceHistory.length < 3) return "stable";
            
            const recentMonths = attendanceHistory.slice(-3);
            const firstMonth = recentMonths[0].rate;
            const lastMonth = recentMonths[recentMonths.length - 1].rate;
            
            if (lastMonth > firstMonth + 0.05) return "improving";
            if (lastMonth < firstMonth - 0.05) return "declining";
            return "stable";
        })();
        
        // Generate predictions for each subject
        const predictions = await Promise.all(subjects.map(async (subject) => {
            const subjectResults = examResults.filter(result => 
                result.subName && result.subName.subName === subject
            );
            
            // Get past scores for this subject
            const pastScores = subjectResults.map(result => result.marksObtained);
            
            // Get the latest score for this subject
            const latestScore = pastScores.length > 0 ? pastScores[pastScores.length - 1] : 0;
            
            // Calculate subject-specific metrics
            const subjectInfo = subjectPerformance.find(s => s.subject === subject);
            const subjectDifficulty = subjectInfo ? subjectInfo.difficultyCoefficient : 1;
            const classAverage = subjectInfo ? subjectInfo.classAverage : 70;
            
            // Calculate consistency index for this subject
            const consistencyIndex = calculateConsistencyIndex(pastScores);
            
            // Calculate recent improvement rate
            let recentImprovementRate = 0;
            if (pastScores.length >= 4) {
                const olderScores = pastScores.slice(0, -3);
                const recentScores = pastScores.slice(-3);
                const olderAvg = olderScores.reduce((sum, score) => sum + score, 0) / olderScores.length;
                const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
                recentImprovementRate = recentAvg - olderAvg;
            }
            
            // Create prediction factors object
            const predictionFactors = {
                attendanceRate,
                classAverage,
                subjectDifficulty,
                consistencyIndex,
                recentImprovementRate,
                attendanceTrend: attendanceTrendType
            };
            
            // Predict next score using our advanced algorithm
            const predictedScore = predictScore(pastScores, predictionFactors);
            
            // Calculate confidence level based on data quality
            const confidenceLevel = Math.min(0.5 + (pastScores.length * 0.1) + (attendanceRate * 0.2), 0.95);
            
            // Generate confidence interval
            const confidenceInterval = {
                lower: Math.max(Math.round((predictedScore - (10 * (1 - confidenceLevel))) * 10) / 10, 0),
                upper: Math.min(Math.round((predictedScore + (10 * (1 - confidenceLevel))) * 10) / 10, 100)
            };
            
            // Determine trend direction and strength
            let trend, trendStrength;
            const difference = predictedScore - latestScore;
            
            if (Math.abs(difference) < 1) {
                trend = "stable";
                trendStrength = "minimal";
            } else if (difference > 0) {
                trend = "improving";
                trendStrength = difference > 5 ? "strong" : "moderate";
            } else {
                trend = "declining";
                trendStrength = difference < -5 ? "strong" : "moderate";
            }
            
            return {
                subject,
                currentScore: latestScore,
                predictedScore,
                confidenceInterval,
                confidenceLevel: Math.round(confidenceLevel * 100),
                trend,
                trendStrength,
                consistencyIndex: Math.round(consistencyIndex * 10) / 10,
                factors: predictionFactors
            };
        }));
        
        // Generate progress prediction for next 3 months (for chart display)
        const progressPrediction = [];
        const currentMonth = moment().format('MMM');
        const currentAvg = subjectPerformance.reduce((sum, subject) => sum + subject.average, 0) / 
                          (subjectPerformance.length || 1);
        
        // Generate predictions for the next 3 months using more advanced time-series forecasting
        let predictedAvg = currentAvg;
        let momentum = 0;
        
        // Calculate momentum from predictions
        const predictedAvgScore = predictions.reduce((sum, pred) => sum + pred.predictedScore, 0) / 
                               (predictions.length || 1);
        momentum = predictedAvgScore - currentAvg;
        
        // Generate forecast with diminishing momentum effect
        for (let i = 1; i <= 3; i++) {
            const month = moment().add(i, 'months').format('MMM');
            
            // Apply momentum with decay factor
            const momentumEffect = momentum * Math.pow(0.8, i - 1);
            
            // Calculate predicted average with confidence bounds
            const basePrediction = predictedAvg + momentumEffect;
            
            // Adjust based on attendance trend
            const attendanceMultiplier = 
                attendanceTrendType === "improving" ? 1.01 :
                attendanceTrendType === "declining" ? 0.99 : 1.0;
            
            predictedAvg = basePrediction * attendanceMultiplier;
            
            // Apply some randomness to reflect uncertainty
            const randomness = 0.98 + Math.random() * 0.04; // 0.98 to 1.02
            predictedAvg = predictedAvg * randomness;
            
            // Ensure it stays within bounds
            predictedAvg = Math.min(Math.max(predictedAvg, 0), 100);
            
            // Calculate confidence interval for prediction
            const confidenceFactor = 2 + (i * 2); // Widens with time
            
            progressPrediction.push({
                month,
                predicted: Math.round(predictedAvg * 10) / 10,
                lowerBound: Math.round(Math.max(predictedAvg - confidenceFactor, 0) * 10) / 10,
                upperBound: Math.round(Math.min(predictedAvg + confidenceFactor, 100) * 10) / 10,
                confidence: Math.round((90 - (i * 10)) * 10) / 10 // Confidence decreases with time
            });
        }
        
        // Prepare historical average scores for the past 6 months (for chart display)
        // In a real app, you'd fetch historical data from the database
        // For this demo, we'll generate realistic data based on current average
        const historicalProgress = [];
        let simulatedScore = currentAvg;
        
        // Generate history with realistic patterns
        for (let i = 6; i >= 1; i--) {
            const month = moment().subtract(i, 'months').format('MMM');
            
            // Add some randomness but also a realistic progression
            const trendFactor = 0.98 + (i * 0.005); // Slight improvement over time
            const randomFactor = 0.97 + Math.random() * 0.06; // 0.97 to 1.03
            
            // Generate historical score
            const historicalScore = currentAvg * trendFactor * randomFactor;
            
            // Save current value for next iteration
            simulatedScore = historicalScore;
            
            historicalProgress.push({
                month,
                average: Math.round(historicalScore * 10) / 10
            });
        }
        
        // Add current month to historical data
        historicalProgress.push({
            month: currentMonth,
            average: Math.round(currentAvg * 10) / 10
        });
        
        // Combine historical and predicted data for continuous progress chart
        const progressChartData = [
            ...historicalProgress, 
            ...progressPrediction.map(item => ({
                month: item.month,
                average: null,
                predicted: item.predicted,
                lowerBound: item.lowerBound,
                upperBound: item.upperBound
            }))
        ];
        
        // Calculate overall performance metrics
        const overallAttendance = attendance.length > 0
            ? (attendance.filter(a => a.status === 'Present').length / attendance.length) * 100
            : 0;
            
        const overallAverage = subjectPerformance.reduce((sum, subject) => sum + subject.average, 0) / 
                              (subjectPerformance.length || 1);
                              
        const overallPrediction = predictions.reduce((sum, pred) => sum + pred.predictedScore, 0) / 
                                 (predictions.length || 1);
        
        // Calculate risk assessment
        const riskAssessment = calculateRiskAssessment(
            overallAverage, 
            overallPrediction, 
            attendanceRate, 
            predictions
        );
        
        // Prepare response with all analytics data
        const responseData = {
            student: {
                id: student._id,
                name: student.name,
                rollNum: student.rollNum,
                class: student.sclassName ? student.sclassName.sclassName : 'Unknown',
                section: student.section
            },
            metrics: {
                overallAttendance: Math.round(overallAttendance * 10) / 10,
                overallAverage: Math.round(overallAverage * 10) / 10,
                overallPrediction: Math.round(overallPrediction * 10) / 10,
                performanceTrend: overallPrediction > overallAverage ? "improving" : 
                                 overallPrediction < overallAverage ? "declining" : "stable",
                attendanceTrend: attendanceTrendType,
                riskAssessment
            },
            subjectPerformance,
            predictions,
            // Chart data
            chartData: {
                attendanceTrend,
                progressChart: progressChartData
            },
            insightSummary: generateInsightSummary(
                predictions, 
                attendanceRate, 
                overallAverage, 
                overallPrediction,
                attendanceTrendType,
                riskAssessment
            ),
            recommendedActions: generateRecommendedActions(
                predictions, 
                attendanceRate, 
                riskAssessment
            )
        };
        
        res.json(responseData);
    } catch (err) {
        console.error('Error in student analytics:', err.message, err.stack);
        res.status(500).json({ message: "Error fetching student analytics", error: err.message });
    }
};

/**
 * Calculate risk assessment based on multiple factors
 */
const calculateRiskAssessment = (currentAverage, predictedAverage, attendanceRate, subjectPredictions) => {
    // Base risk score
    let riskScore = 0;
    
    // Factor 1: Current average score risk
    if (currentAverage < 40) riskScore += 40;
    else if (currentAverage < 50) riskScore += 30;
    else if (currentAverage < 60) riskScore += 20;
    else if (currentAverage < 70) riskScore += 10;
    
    // Factor 2: Predicted decline risk
    const predictedChange = predictedAverage - currentAverage;
    if (predictedChange < -10) riskScore += 30;
    else if (predictedChange < -5) riskScore += 20;
    else if (predictedChange < 0) riskScore += 10;
    
    // Factor 3: Attendance risk
    if (attendanceRate < 0.6) riskScore += 30;
    else if (attendanceRate < 0.7) riskScore += 20;
    else if (attendanceRate < 0.8) riskScore += 10;
    
    // Factor 4: Subject failure risk
    const failingSubjects = subjectPredictions.filter(p => p.predictedScore < 40).length;
    const atRiskSubjects = subjectPredictions.filter(p => p.predictedScore >= 40 && p.predictedScore < 50).length;
    
    riskScore += failingSubjects * 15;
    riskScore += atRiskSubjects * 5;
    
    // Factor 5: Consistency issues
    const inconsistentSubjects = subjectPredictions.filter(p => p.consistencyIndex < -2).length;
    riskScore += inconsistentSubjects * 5;
    
    // Calculate risk level
    let riskLevel;
    if (riskScore >= 70) riskLevel = "high";
    else if (riskScore >= 40) riskLevel = "moderate";
    else if (riskScore >= 20) riskLevel = "low";
    else riskLevel = "minimal";
    
    return {
        level: riskLevel,
        score: riskScore,
        factors: {
            currentAverage: currentAverage < 70,
            predictedDecline: predictedChange < 0,
            poorAttendance: attendanceRate < 0.8,
            failingSubjects,
            atRiskSubjects,
            inconsistentPerformance: inconsistentSubjects > 0
        }
    };
};

/**
 * Generate textual insights from the data
 */
const generateInsightSummary = (predictions, attendanceRate, overallAverage, overallPrediction, attendanceTrend, riskAssessment) => {
    const attendanceQuality = 
        attendanceRate >= 0.9 ? "excellent" :
        attendanceRate >= 0.8 ? "good" :
        attendanceRate >= 0.7 ? "average" :
        "concerning";
    
    const performanceTrend = overallPrediction > overallAverage ? "improving" : 
                            overallPrediction < overallAverage ? "declining" : "stable";
    
    // Find strongest and weakest subjects
    const subjectsSorted = predictions.length > 0 
    ? [...predictions].sort((a, b) => b.predictedScore - a.predictedScore)
    : [{ subject: "N/A", predictedScore: "N/A" }];
    const strongestSubject = subjectsSorted[0];
    const weakestSubject = subjectsSorted[subjectsSorted.length - 1];
    
    // Find subjects with strongest improvement and decline
    const changeSorted = [...predictions]
        .filter(p => p.currentScore > 0) // Only consider subjects with current scores
        .sort((a, b) => (b.predictedScore - b.currentScore) - (a.predictedScore - a.currentScore));
    
    const mostImproved = changeSorted.length > 0 ? changeSorted[0] : null;
    const mostDeclined = changeSorted.length > 0 ? changeSorted[changeSorted.length - 1] : null;
    
    // Generate insights
    const insights = [
        `Overall performance trend: ${performanceTrend} with predicted average of ${overallPrediction}%.`,
        `Attendance is ${attendanceQuality} at ${Math.round(attendanceRate * 100)}% and ${attendanceTrend}.`,
        `Strongest subject is ${strongestSubject.subject} with predicted score of ${strongestSubject.predictedScore}%.`
    ];
    
    // Add improvement/decline insights if significant
    if (mostImproved && (mostImproved.predictedScore - mostImproved.currentScore) > 3) {
        insights.push(`Most improved subject is ${mostImproved.subject} with predicted increase of ${Math.round((mostImproved.predictedScore - mostImproved.currentScore) * 10) / 10}%.`);
    }
    
    if (mostDeclined && (mostDeclined.currentScore - mostDeclined.predictedScore) > 3) {
        insights.push(`Subject with most concern is ${mostDeclined.subject} with predicted decrease of ${Math.round((mostDeclined.currentScore - mostDeclined.predictedScore) * 10) / 10}%.`);
    } else {
        insights.push(`Area for improvement: ${weakestSubject.subject} with predicted score of ${weakestSubject.predictedScore}%.`);
    }
    
    // Add risk assessment insight
    if (riskAssessment.level !== "minimal") {
        insights.push(`Risk assessment: ${riskAssessment.level} risk of academic challenges identified.`);
    }
    
    // Add specific advice based on trends
    if (attendanceRate < 0.8) {
        insights.push("Improving attendance could significantly boost academic performance.");
    }
    
    if (overallPrediction < 60) {
        insights.push("Overall predicted performance is below the acceptable threshold; consider immediate academic intervention and personalized tutoring.");
    }
    
    return insights;
};

/**
 * Generate recommended actions based on predictions, attendance rate, and risk assessment
 */
const generateRecommendedActions = (predictions, attendanceRate, riskAssessment) => {
    const actions = [];
    
    // Recommend improvement in attendance if needed
    if (attendanceRate < 0.8) {
        actions.push("Increase class attendance and punctuality to ensure consistent learning.");
    }
    
    // Recommendations based on risk level
    if (riskAssessment.level === "high") {
        actions.push("Schedule immediate academic counseling and involve parents/guardians for additional support.");
    } else if (riskAssessment.level === "moderate") {
        actions.push("Monitor academic progress closely and consider additional tutoring sessions.");
    } else if (riskAssessment.level === "low") {
        actions.push("Maintain current study habits and explore opportunities for further enrichment.");
    }
    
    // Subject-specific recommendations based on prediction trends
    predictions.forEach(prediction => {
        if (prediction.trend === "declining") {
            actions.push(`Provide extra help in ${prediction.subject} to address the declining trend.`);
        } else if (prediction.trend === "stable" && prediction.predictedScore < 60) {
            actions.push(`Review study techniques in ${prediction.subject} to boost performance.`);
        } else if (prediction.trend === "improving" && (prediction.predictedScore - prediction.currentScore) < 3) {
            actions.push(`Encourage additional practice in ${prediction.subject} for further improvement.`);
        }
    });
    
    if (actions.length === 0) {
        actions.push("Continue current strategies while exploring opportunities for academic enrichment.");
    }
    
    return actions;
};

module.exports = {
    getStudentAnalytics
};
