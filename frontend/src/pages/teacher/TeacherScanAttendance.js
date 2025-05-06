import { useState, useEffect, useRef } from "react"
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode"
import axios from "axios"
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Snackbar,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"

// Styled components
const ScannerContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
}))

const ScannerHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  textAlign: "center",
}))

const QrReaderContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "100%",
  height: 300,
  position: "relative",
  overflow: "hidden",
  borderRadius: 12,
  marginBottom: theme.spacing(3),
  border: "2px solid #eaeaea",
  [theme.breakpoints.down("sm")]: {
    height: 250,
  },
}))

const ScanOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 10,
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

const ScanFrame = styled(Box)(({ theme }) => ({
  width: 200,
  height: 200,
  border: "2px solid #4caf50",
  borderRadius: 12,
  boxShadow: "0 0 0 4000px rgba(0, 0, 0, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    width: 180,
    height: 180,
  },
}))

const StatusCard = styled(Card)(({ theme, status }) => ({
  marginTop: theme.spacing(2),
  background:
    status === "success"
      ? "linear-gradient(135deg, #d4ffda, #e8fff0)"
      : status === "error"
        ? "linear-gradient(135deg, #ffe0e0, #fff0f0)"
        : "white",
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
}))

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  padding: "10px 24px",
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
}))

const TeacherScanAttendance = () => {
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [cameras, setCameras] = useState([])
  const [selectedCamera, setSelectedCamera] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")

  const scannerRef = useRef(null)
  const qrReaderRef = useRef(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    // Check if we're on HTTPS
    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
      setError("Camera access requires HTTPS. Please use a secure connection.")
    }

    // Clean up scanner on component unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [])

  const startScanner = async () => {
    setScanning(true)
    setScanResult(null)
    setError(null)
    setSuccess(null)
    setDebugInfo("")
    setPermissionDenied(false)

    try {
      setDebugInfo((prev) => prev + "Requesting camera access...\n")
      const devices = await Html5Qrcode.getCameras()
      setCameras(devices)

      if (devices && devices.length > 0) {
        setDebugInfo((prev) => prev + `Found ${devices.length} camera(s)\n`)
        setSelectedCamera(devices[0].id)
        initScanner(devices[0].id)
      } else {
        setDebugInfo((prev) => prev + "No cameras found\n")
        setError("No camera devices found. Please ensure your device has a camera and you've granted permission.")
        setScanning(false)
      }
    } catch (err) {
      setDebugInfo((prev) => prev + `Error: ${err.message}\n`)

      if (err.message.includes("permission")) {
        setPermissionDenied(true)
        setError("Camera permission denied. Please allow camera access and try again.")
      } else {
        setError("Error accessing camera: " + err.message)
      }
      setScanning(false)
    }
  }

  const initScanner = (deviceId) => {
    if (scannerRef.current) {
      scannerRef.current.clear()
    }

    const html5QrCode = new Html5Qrcode("qr-reader")
    scannerRef.current = html5QrCode

    // Configure scanner based on device
    const qrboxSize = isMobile ? 180 : 250
    const fps = 10

    setDebugInfo((prev) => prev + `Initializing scanner with camera ID: ${deviceId}\n`)
    setDebugInfo((prev) => prev + `QR box size: ${qrboxSize}, FPS: ${fps}\n`)

    html5QrCode
      .start(
        deviceId,
        {
          fps: fps,
          qrbox: { width: qrboxSize, height: qrboxSize },
          aspectRatio: 1.0,
          disableFlip: false, 
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE], // Use the correct format definition
        },
        (decodedText) => {
          setDebugInfo((prev) => prev + `QR code detected: ${decodedText.substring(0, 20)}...\n`)
          handleQrCodeScan(decodedText)
          html5QrCode.stop()
          setScanning(false)
        },
        (errorMessage) => {
          // This is called frequently when no QR code is in view, so we don't want to set an error
          // Only log for debugging
          if (errorMessage.includes("No QR code found")) {
            // Normal scanning state, don't log
          } else {
            setDebugInfo((prev) => prev + `Scanning error: ${errorMessage}\n`)
          }
        },
      )
      .catch((err) => {
        setDebugInfo((prev) => prev + `Failed to start scanner: ${err}\n`)
        setError("Error starting scanner: " + err)
        setScanning(false)
      })
  }

  const switchCamera = () => {
    if (cameras.length <= 1) return

    const currentIndex = cameras.findIndex((camera) => camera.id === selectedCamera)
    const nextIndex = (currentIndex + 1) % cameras.length

    setDebugInfo((prev) => prev + `Switching camera to: ${cameras[nextIndex].label || "Camera " + (nextIndex + 1)}\n`)

    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        setSelectedCamera(cameras[nextIndex].id)
        initScanner(cameras[nextIndex].id)
      })
    }
  }

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        setScanning(false)
        setDebugInfo((prev) => prev + "Scanner stopped\n")
      })
    }
  }

  const handleQrCodeScan = async (qrToken) => {
    setLoading(true)
    setScanResult(qrToken)

    try {
      setDebugInfo((prev) => prev + "Sending QR token to server...\n")
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/Teacher/mark-attendance/scan`, { qrToken })
      setSuccess(response.data.message)
      setSnackbarOpen(true)
      setDebugInfo((prev) => prev + "Attendance marked successfully\n")
    } catch (err) {
      setDebugInfo((prev) => prev + `API error: ${err.response?.data?.message || err.message}\n`)
      setError(err.response?.data?.message || "Failed to mark attendance")
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const resetScanner = () => {
    setScanResult(null)
    setError(null)
    setSuccess(null)
    setScanning(false)
    setDebugInfo("")
  }

  const handleHelpOpen = () => {
    setHelpDialogOpen(true)
  }

  const handleHelpClose = () => {
    setHelpDialogOpen(false)
  }

  const retryWithPermission = () => {
    // For browsers that need a user gesture to request permissions
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setPermissionDenied(false)
        startScanner()
      })
      .catch((err) => {
        setDebugInfo((prev) => prev + `Permission retry failed: ${err.message}\n`)
        setPermissionDenied(true)
        setError("Camera permission denied. Please check your browser settings.")
      })
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <ScannerContainer elevation={0}>
        <ScannerHeader>
          <Typography variant="h4" fontWeight="700" gutterBottom>
            Attendance Scanner
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Scan student QR codes to mark attendance
          </Typography>
          <IconButton onClick={handleHelpOpen} sx={{ position: "absolute", top: 16, right: 16 }}>
            <HelpOutlineIcon />
          </IconButton>
        </ScannerHeader>

        <QrReaderContainer>
          {scanning ? (
            <>
              <div id="qr-reader" ref={qrReaderRef} style={{ width: "100%", height: "100%" }} />

              {/* Scanning overlay with frame */}
              <ScanOverlay>
                <ScanFrame>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "white",
                      position: "absolute",
                      bottom: -30,
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    Position QR code here
                  </Typography>
                </ScanFrame>
              </ScanOverlay>

              {cameras.length > 1 && (
                <IconButton
                  onClick={switchCamera}
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    backgroundColor: "rgba(255,255,255,0.8)",
                    zIndex: 20,
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                  }}
                >
                  <FlipCameraAndroidIcon />
                </IconButton>
              )}
            </>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
              sx={{ backgroundColor: "#f8f9fa" }}
            >
              <CameraAltIcon sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Camera preview will appear here
              </Typography>
              {permissionDenied && (
                <Button variant="outlined" color="primary" size="small" onClick={retryWithPermission} sx={{ mt: 2 }}>
                  Grant Camera Permission
                </Button>
              )}
            </Box>
          )}
        </QrReaderContainer>

        <Grid container spacing={2} justifyContent="center">
          {!scanning ? (
            <Grid item>
              <ActionButton
                variant="contained"
                color="primary"
                onClick={startScanner}
                startIcon={<CameraAltIcon />}
                disabled={loading}
              >
                Start Scanning
              </ActionButton>
            </Grid>
          ) : (
            <Grid item>
              <ActionButton variant="outlined" color="secondary" onClick={stopScanner} disabled={loading}>
                Stop Scanning
              </ActionButton>
            </Grid>
          )}
        </Grid>

        {loading && (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress size={30} />
          </Box>
        )}

        {(error || success) && (
          <StatusCard status={error ? "error" : "success"}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                {error ? (
                  <ErrorIcon color="error" sx={{ mr: 1 }} />
                ) : (
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                )}
                <Typography variant="h6">{error ? "Error" : "Success"}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {error || success}
              </Typography>
              {(error || success) && (
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button size="small" onClick={resetScanner} sx={{ textTransform: "none" }}>
                    Scan Another
                  </Button>
                </Box>
              )}
            </CardContent>
          </StatusCard>
        )}
        
      </ScannerContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: "100%" }}>
          {success}
        </Alert>
      </Snackbar>

      {/* Help Dialog */}
      <Dialog open={helpDialogOpen} onClose={handleHelpClose} maxWidth="sm" fullWidth>
        <DialogTitle>QR Code Scanning Help</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Troubleshooting Camera Issues
          </Typography>
          <Typography variant="body2" paragraph>
            1. <strong>Camera Permission:</strong> Make sure you've allowed camera access when prompted.
          </Typography>
          <Typography variant="body2" paragraph>
            2. <strong>HTTPS Required:</strong> Camera access requires a secure connection (HTTPS).
          </Typography>
          <Typography variant="body2" paragraph>
            3. <strong>Mobile Devices:</strong> On some mobile browsers, you may need to enable camera access in your
            browser settings.
          </Typography>
          <Typography variant="body2" paragraph>
            4. <strong>Lighting:</strong> Ensure the QR code is well-lit and not reflective.
          </Typography>
          <Typography variant="body2" paragraph>
            5. <strong>Distance:</strong> Hold the QR code 6-10 inches (15-25cm) from the camera.
          </Typography>
          <Typography variant="body2" paragraph>
            6. <strong>Stability:</strong> Keep both the camera and QR code steady.
          </Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Still Having Issues?
          </Typography>
          <Typography variant="body2">
            Try switching cameras if available, refreshing the page, or using a different device.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHelpClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default TeacherScanAttendance

