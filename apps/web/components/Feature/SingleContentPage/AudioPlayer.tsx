"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { PlayIcon, PauseIcon, AudioIcon } from "@/assets/icons";
import { useTheme } from "styled-components";
import {
  AudioPlayerRoot,
  AudioBlurBg,
  AudioPlayerBody,
  AudioArtwork,
  AudioArtworkFallback,
  AudioMeta,
  AudioTitle,
  AudioLabel,
  AudioPlayButton,
  AudioControls,
  AudioTime,
  AudioProgressTrack,
  AudioProgressFill,
  AudioProgressInput,
  AudioBars,
  AudioBar,
} from "./styles";

type AudioPlayerProps = {
  src: string;
  title: string;
  coverImage?: string;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({
  src,
  title,
  coverImage,
}: AudioPlayerProps) {
  const theme = useTheme();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [coverFailed, setCoverFailed] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const showCover = Boolean(coverImage) && !coverFailed;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    void audio.play().catch(() => {
      setIsPlaying(false);
    });

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [src]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  };

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const next = (Number(event.target.value) / 100) * duration;
    audio.currentTime = next;
    setCurrentTime(next);
  };

  return (
    <AudioPlayerRoot>
      {showCover ? (
        <AudioBlurBg style={{ backgroundImage: `url("${coverImage}")` }} />
      ) : null}

      <audio ref={audioRef} src={src} preload="metadata" />

      <AudioPlayerBody>
        <AudioArtwork $playing={isPlaying}>
          {showCover ? (
            <Image
              src={coverImage!}
              alt={title}
              fill
              sizes="(max-width: 768px) 55vw, 280px"
              style={{ objectFit: "cover" }}
              unoptimized
              onError={() => setCoverFailed(true)}
            />
          ) : (
            <AudioArtworkFallback>
              <AudioIcon
                width={56}
                height={56}
                color={theme.colors.primary.GREEN}
              />
            </AudioArtworkFallback>
          )}
          {isPlaying ? (
            <AudioBars aria-hidden>
              <AudioBar $delay={0} />
              <AudioBar $delay={0.15} />
              <AudioBar $delay={0.3} />
              <AudioBar $delay={0.1} />
            </AudioBars>
          ) : null}
        </AudioArtwork>

        <AudioMeta>
          <AudioLabel>Audio</AudioLabel>
          <AudioTitle>{title}</AudioTitle>
        </AudioMeta>

        <AudioPlayButton
          type="button"
          $playing={isPlaying}
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? (
            <PauseIcon
              width={28}
              height={28}
              fg={theme.colors.neutral.GRAY_500}
            />
          ) : (
            <PlayIcon
              width={28}
              height={28}
              fg={theme.colors.neutral.GRAY_500}
            />
          )}
        </AudioPlayButton>

        <AudioControls>
          <AudioTime>{formatTime(currentTime)}</AudioTime>
          <AudioProgressTrack>
            <AudioProgressFill style={{ width: `${progress}%` }} />
            <AudioProgressInput
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={handleSeek}
              aria-label="Seek"
            />
          </AudioProgressTrack>
          <AudioTime>{formatTime(duration)}</AudioTime>
        </AudioControls>
      </AudioPlayerBody>
    </AudioPlayerRoot>
  );
}
