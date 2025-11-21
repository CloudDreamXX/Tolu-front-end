import React, { useState, useRef, useEffect } from "react";
import { Button } from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { toast } from "shared/lib";

interface VoiceRecorderButtonProps {
  setVoiceFile?: (file: File | null) => void;
  disabled?: boolean;
}

export const VoiceRecorderButton: React.FC<VoiceRecorderButtonProps> = ({
  setVoiceFile,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [volumeBars, setVolumeBars] = useState<number[]>(Array(6).fill(2));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      audioContextRef.current?.close();
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      sourceRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);

      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      const animateWaveform = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);

        const avg =
          dataArrayRef.current.reduce((a, b) => a + b, 0) /
          dataArrayRef.current.length;

        const volume = Math.min(avg / 128, 1);

        const bars = Array(6)
          .fill(0)
          .map((_, i) =>
            Math.max(
              3,
              Math.round(3 + Math.sin(i + volume * 10) * (volume * 10))
            )
          );

        setVolumeBars(bars);
        rafRef.current = requestAnimationFrame(animateWaveform);
      };

      animateWaveform();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
        const file = new File([audioBlob], "voice_message.mp3", {
          type: "audio/mp3",
        });
        setVoiceFile?.(file);
        setAudioUrl(URL.createObjectURL(audioBlob));
        setElapsed(0);
        stopAnalyser();
      };

      mediaRecorder.start();
      setIsRecording(true);

      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((t) => t + 1), 1000);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Microphone not accessible",
        description: "Please allow microphone access to record audio.",
      });
    }
  };

  const stopAnalyser = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (sourceRef.current) sourceRef.current.disconnect();
    audioContextRef.current?.close();
    audioContextRef.current = null;
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    startRecording();
  };

  const handleCancel = () => {
    setAudioUrl(null);
    setVoiceFile?.(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="relative flex items-center gap-3">
      {(!audioUrl || isRecording) && (
        <Button
          variant="ghost"
          disabled={disabled}
          onClick={handleRecordClick}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
            isRecording
              ? "bg-red-500 text-white animate-pulse"
              : "bg-[#F3F6FB] text-[#1D1D1F] hover:bg-secondary/80"
          }`}
        >
          <MaterialIcon
            iconName={isRecording ? "stop" : "mic"}
            size={isRecording ? 24 : 22}
          />
        </Button>
      )}

      {isRecording && (
        <div className="flex items-baseline gap-2 text-[#1D1D1F]">
          <div className="flex gap-[3px] items-end h-[18px]">
            {volumeBars.map((h, i) => (
              <div
                key={i}
                className="w-[3px] bg-[#1C63DB] rounded-full transition-all duration-100 ease-linear"
                style={{ height: `${h * 2}px` }}
              />
            ))}
          </div>
          <span className="text-sm font-semibold">{formatTime(elapsed)}</span>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="flex items-center gap-2">
          <audio
            controls
            src={audioUrl}
            className="h-8 w-[250px] md:w-[300px]"
          />
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            onClick={handleCancel}
            className="flex items-center justify-center text-[#5F5F65] hover:text-red-500"
          >
            <MaterialIcon iconName="delete" />
          </Button>
        </div>
      )}
    </div>
  );
};
