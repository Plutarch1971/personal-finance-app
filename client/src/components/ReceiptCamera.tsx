//ReceiptCamera.tsx
import React, { useRef, useEffect, useState } from 'react';
import api from '../api/axios';

interface ReceiptCameraProps {
    onUploadSuccess?: ( data: any) => void;
    onClose?: () => void;
}

const ReceiptCamera: React.FC<ReceiptCameraProps> = ( { onUploadSuccess, onClose }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [useFrontCamera, setUseFrontCamera] = useState(false);
    const [isCropEnabled, setIsCropEnabled] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Detect mobile
    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

    // Start camera
    const startCamera = async () => {
        setError(null);

        try {
            const constraints: MediaStreamConstraints = {
                video: {
                    facingMode: useFrontCamera ? "user" : { ideal: "environment"},
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },

            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

            if(videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }

            setStream(mediaStream);
        } catch (err:any) {
            console.error(err);
            setError("Unable to access camera. Please allow permissions.")
        }   
    };

    // Stop camera
    const stopCamera = () => {
        stream?.getTracks().forEach((track) => track.stop());
        setStream(null);
    }

    // Capture image
    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        if (isCropEnabled) {
            // Define crop area (80% centered)
            const cropWidth = videoWidth * 0.8;
            const cropHeight = videoHeight * 0.8;
            const startX = (videoWidth - cropWidth) / 2;
            const startY = (videoHeight - cropHeight) / 2;

            canvas.width = cropWidth;
            canvas.height = cropHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(video, startX, startY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        } else {
            canvas.width = videoWidth;
            canvas.height = videoHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(video, 0, 0);
        }

        const image = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(image);

        stopCamera();
    };

    // Upload to backend
    const uploadImage = async () => {
        if (!capturedImage) return;

        setLoading(true);

        try {
            const response = await fetch(capturedImage);
            const blob = await response.blob();
            const file = new File([blob], "receipt.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append('receipt', file);

            const res = await api.post('/receipts/extract', formData);

            if (onUploadSuccess) {
                onUploadSuccess(res.data.draft);
            }
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.error || err.message || 'Upload failed';
            setError(`Upload failed: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    // Restart camera
    const retake = () => {
        setCapturedImage(null);
        startCamera();
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="container-sm mx-auto text-center">
            <h2>Scan Receipt</h2>
            {error && <p style={{ color: "red"}}>{error}</p>}

            {/* CAMERA VIEW */}
            {!capturedImage && (
                <>
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 10 }}>
                    <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{
                        width: "100%",
                        display: 'block',
                        background: "#000",
                    }}
                    />

                    {isCropEnabled && stream && (
                        <div style={{
                            position: 'absolute',
                            top: '10%',
                            left: '10%',
                            width: '80%',
                            height: '80%',
                            border: '2px dashed #fff',
                            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                            pointerEvents: 'none',
                            zIndex: 1
                        }}>
                             <div style={{
                                position: 'absolute',
                                top: '-25px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                color: '#fff',
                                fontSize: '12px',
                                textShadow: '1px 1px 2px #000',
                                whiteSpace: 'nowrap'
                            }}>
                                Align receipt inside the box
                            </div>
                        </div>
                    )}
                </div>

                <canvas ref={canvasRef} className="d-none" />

                <div className="mt-2">
                    {!stream ? (
                        <button type="button" className="btn btn-primary"
                        onClick={startCamera}>Open Camera</button>
                    ): (
                    <>
                    <button type="button" className="btn btn-primary" onClick={captureImage}>Capture</button>

                    <button
                      type="button"
                      onClick={() => {
                        stopCamera();
                        setUseFrontCamera(prev => !prev);
                        setTimeout(startCamera, 200);
                      }}
                      className="btn btn-outline-secondary ms-2"
                      >
                        Switch Camera
                    </button>

                    <button 
                        type="button"
                        className="btn btn-outline-info ms-2"
                        onClick={() => setIsCropEnabled(!isCropEnabled)}
                    >
                        {isCropEnabled ? "Disable Crop" : "Enable Crop"}
                    </button>

                    <button type="button" onClick={() => {
                        stopCamera();
                        onClose?.();
                    }} className="btn btn-secondary ms-2">
                        Close
                    </button>
                        
                    </>
                    )}

                </div>
                </>
            )}


            {/* PREVIEW */}
            {capturedImage && (
                <>
                <img 
                    src={capturedImage}
                    alt="Captured"
                    className="w-100 rounded-3"
                />

                <div className="mt-2">
                    <button type="button" className="btn btn-secondary" onClick={retake}> Retake</button>

                    <button 
                        type="button"
                        onClick={uploadImage}
                        disabled={loading}
                        className="btn btn-success ms-2"
                    >
                        { loading ? "Processing..." : "Upload"}
                    </button>
                </div>
                </>
            )}

            {/*  Desktop fallback hint */}
            { !isMobile && !stream && !capturedImage && (
                <p className="mt-2 small opacity-75">
                    Tip: Uploading a receipt image may give better results on desktop.
                </p>
            )}
        </div>
    );
};

export default ReceiptCamera;

