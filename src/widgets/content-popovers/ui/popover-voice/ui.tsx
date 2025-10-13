import React, { useState, useRef, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent, Button } from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { toast } from "shared/lib";

interface PopoverVoiceRecorderProps {
    setVoiceFile?: (file: File | null) => void;
    disabled?: boolean;
}

export const PopoverVoiceRecorder: React.FC<PopoverVoiceRecorderProps> = ({
    setVoiceFile,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    useEffect(() => {
        return () => {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunks.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunks.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
                const file = new File([audioBlob], "voice_recording.mp3", {
                    type: "audio/mp3",
                });
                setFile(file);
                setAudioUrl(URL.createObjectURL(audioBlob));
                setVoiceFile?.(file);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Microphone not accessible",
                description: "Please allow microphone access to record audio.",
            });
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleSave = () => {
        if (!file) {
            toast({ title: "No audio recorded", variant: "destructive" });
            return;
        }
        toast({ title: "Voice saved successfully" });
        setIsOpen(false);
    };

    const resetRecording = () => {
        setAudioUrl(null);
        setFile(null);
        setVoiceFile?.(null);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild disabled={disabled}>
                <Button
                    variant="secondary"
                    className="w-12 h-12 p-[10px] rounded-full relative bg-[#F3F6FB]"
                >
                    <MaterialIcon
                        iconName="mic"
                    />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[360px] p-6 bg-[#F9FAFB] rounded-2xl flex flex-col gap-4">
                <h4 className="text-[18px] font-bold text-[#1D1D1F] flex items-center gap-2">
                    <MaterialIcon iconName="mic" />
                    Voice Recorder
                </h4>
                <p className="text-[14px] text-[#5F5F65]">
                    Record a short voice message or audio note.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 p-6">
                    {!isRecording && !audioUrl && (
                        <Button
                            variant="brightblue"
                            className="w-[160px]"
                            onClick={startRecording}
                        >
                            <MaterialIcon iconName="mic" />
                            Start Recording
                        </Button>
                    )}

                    {isRecording && (
                        <Button
                            variant="destructive"
                            className="w-[160px]"
                            onClick={stopRecording}
                        >
                            <MaterialIcon iconName="stop" />
                            Stop Recording
                        </Button>
                    )}

                    {audioUrl && (
                        <>
                            <audio controls src={audioUrl} className="w-full" />
                            <div className="flex gap-2 justify-center">
                                <Button variant="light-blue" onClick={resetRecording}>
                                    <MaterialIcon iconName="replay" />
                                    Re-record
                                </Button>
                                <Button variant="brightblue" onClick={handleSave}>
                                    <MaterialIcon iconName="check_circle" />
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};
