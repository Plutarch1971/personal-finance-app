//ReceiptCamera.tsx
import React, { useRef, useEffect, useState } from 'react';

interface ReceiptCameraProps {
    onUploadSuccess?: ( data: any) => void;
}

const ReceiptCamera: React.FC<ReceiptCameraProps> = ( { onUploadSuccess }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [useFrontCamera, setUseFrontCamera] = useState(false);
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

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(video, 0, 0);

        const image = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(image);

        stopCamera();
    };

    // Upload to backend
    const uplaodImage = async () => {
        if (!capturedImage) return;

        setLoading(true);

        try {
            const res = await fetch("/api/receipt/extract", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({image: capturedImage}),
            });

            const data = await res.json();

            if (onUploadSuccess) {
                onUploadSuccess(data);
            }
        } catch (err) {
            console.error(err);
            setError("Upload failed");
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
                <video 
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                    width: "100%",
                    borderRadius: 10,
                    background: "#000",
                }}
                />

                <canvas ref={canvasRef} className="d-none" />

                <div className="mt-2">
                    {!stream ? (
                        <button className="btn btn-primary"
                        onClick={startCamera}>Open Camera</button>
                    ): (
                    <>
                    <button onClick={captureImage}>Capture</button>

                    <button
                      onClick={() => {
                        stopCamera();
                        setUseFrontCamera(prev => !prev);
                        setTimeout(startCamera, 200);
                      }}
                      className="ms-2"
                      >
                        Switch Camera
                    </button>

                    <button onClick={stopCamera} className="ms-2">
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
                    <button onClick={retake}> Retake</button>

                    <button 
                        onClick={uplaodImage}
                        disabled={loading}
                        className="ms-2"
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

