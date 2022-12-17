import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "src/Components";
import useUserMedia from "./Hooks/useUserMedia";

interface IProps {
    open: boolean;
    onClose: () => void;
}

const captureConstraints: MediaStreamConstraints = {
    audio: false, // We don't need to capture the audio
    video: { facingMode: 'environment' },
}

export default function SingleProductCapture(props: IProps) {
    const { open, onClose } = props;

    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<Blob>();

    const { mediaStream } = useUserMedia(captureConstraints, open);
    const { showSnackbar } = useSnackbar()

    const containerRef = useRef<HTMLDivElement>();
    const videoRef = useRef<HTMLVideoElement>();
    const canvasRef = useRef<HTMLCanvasElement>();

    useEffect(() => {
        const handleClearOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        window.addEventListener('keydown', handleClearOnEscape);
        return () => window.removeEventListener('keydown', handleClearOnEscape);
    }, []);

    useEffect(() => {
        if (open && mediaStream) {
            videoRef.current.srcObject = mediaStream;
        }

        // Some clean up
        if (!open) {
            setIsCapturing(false);
            setCapturedImage(undefined);
            handleClearShot();
        }
    }, [open, mediaStream])

    function handleCanPlay() {
        videoRef.current.play();
    }

    function handleCaptureShot() {
        setIsCapturing(true);

        const context = canvasRef.current.getContext("2d");

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;

        canvasRef.current.width = width;
        canvasRef.current.height = height;

        context.drawImage(
            videoRef.current,
            0, 0, videoWidth, videoHeight, // Source
            0, 0, width, height, // Destination
        );

        canvasRef.current.toBlob(blob => setCapturedImage(blob), "image/jpeg", 1);

        setTimeout(() => setIsCapturing(false), 200);
    }

    function handleClearShot(shouldShowSnackbar?: boolean) {
        const context = canvasRef.current.getContext("2d");

        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        context.clearRect(0, 0, width, height);
        setCapturedImage(undefined);

        if (shouldShowSnackbar) {
            showSnackbar('Picture deleted', 'success');
        }
    }

    return (
        <div className={`video-dialog ${open ? 'video-dialog--open' : ''}`}>
            <div className='video-dialog__header'>
                <i className="fa-solid fa-angle-down"></i>
                <h5>Close camera</h5>
            </div>
            <div className='video-dialog__body'>
                <div className='video-capture' ref={containerRef}>
                    <video ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline muted />
                    <canvas ref={canvasRef} />

                    <div className={`video-capture-overlay ${isCapturing ? 'video-capture-overlay--enter' : ''}`} />
                </div>
            </div>

            <div className='video-dialog__footer'>
                {!capturedImage &&
                    <div className="capture-button" onClick={handleCaptureShot}>
                        <div className="capture-button__circle"></div>
                        <div className="capture-button__ring"></div>
                    </div>
                }

                {capturedImage &&
                    <div className="capture-button" onClick={() => handleClearShot(true)}>
                        <div className="capture-button__remove">
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                        <div className="capture-button__ring"></div>
                    </div>
                }
            </div>
        </div>
    );
}