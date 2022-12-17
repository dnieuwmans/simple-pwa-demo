import { useEffect, useState } from "react";

export default function useUserMedia(captureConstraints: MediaStreamConstraints, startRecording: boolean) {
    const [mediaStream, setMediaStream] = useState<MediaStream>(null);

    async function handleStartRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(captureConstraints);
            setMediaStream(stream);
        } catch (error) {
            // TODO: do something
        }
    }

    function handleStopRecording() {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => {
                track.stop();
            });

            setMediaStream(null);
        }
    }

    useEffect(() => {
        if (!mediaStream && startRecording) {
            handleStartRecording();
        }

        return () => handleStopRecording();
    }, [mediaStream, captureConstraints, startRecording]);

    return { mediaStream, handleStopRecording, handleStartRecording };
}