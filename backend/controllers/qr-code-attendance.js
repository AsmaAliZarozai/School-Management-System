const QRCode = require('qrcode');
const Student = require('../models/studentSchema');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "Asdf@1234"; 
const EXPIRY_TIME = 30 * 60; // qr code 30 minutes expiry

const generateQRCode = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { subjectId } = req.query;
        const student = await Student.findById(studentId).populate('sclassName');
        
        if (!student) return res.status(404).json({ message: "Student not found" });
        
        // Create JWT with expiry
        const token = jwt.sign({ studentId, sclassName: subjectId }, SECRET_KEY, { expiresIn: EXPIRY_TIME });
        
        // Generate QR Code
        const qrCodeData = await QRCode.toDataURL(token);
        
        res.json({ qrCodeData });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const markAttendance = async (req, res) => {
    try {
        const { qrToken } = req.body;
        if (!qrToken) return res.status(400).json({ message: "QR Code missing" });
        
        // Verify QR Token
        const decoded = jwt.verify(qrToken, SECRET_KEY);
        if (!decoded) return res.status(401).json({ message: "Invalid or expired QR Code" });
        
        const student = await Student.findById(decoded.studentId);
        if (!student) return res.status(404).json({ message: "Student not found" });
        
        const today = new Date().toISOString().split('T')[0]; // Get only date part
        
        // Check if attendance already marked
        const alreadyMarked = student.attendance.some(att => att.date.toISOString().split('T')[0] === today && att.subName == decoded.sclassName );
        if (alreadyMarked) return res.status(400).json({ message: "Attendance already marked" });
        
        // Mark Attendance
        student.attendance.push({ date: new Date(), status: "Present", subName: decoded.sclassName });
        await student.save();
        
        res.json({ message: "Attendance marked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error processing QR Code", error: error.message });
    }
}

module.exports = { generateQRCode, markAttendance };
