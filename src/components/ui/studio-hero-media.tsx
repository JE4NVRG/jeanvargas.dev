"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useStudioMotionPreferences } from "@/components/ui/studio-motion-provider";
import { isStudioPlaybackFailure, shouldLoadStudioMedia, shouldPlayStudioMedia } from "@/lib/studio-motion-policy";
import styles from "@/components/sections/studio-motion.module.css";

interface StudioAmbientMediaProps {
  poster: string;
  mobilePoster?: string;
  videoSrc?: string;
  locale: "pt" | "en";
  className?: string;
  eager?: boolean;
  decorative?: boolean;
  allowMobilePlayback?: boolean;
  description?: string;
}

/** Shared lifecycle for owned art and authentic product film. No film source in SSR. */
export function StudioAmbientMedia({ poster, mobilePoster, videoSrc, locale, className = "", eager = false, decorative = false, allowMobilePlayback = false, description }: StudioAmbientMediaProps) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const mediaId = useId();
  const preferences = useStudioMotionPreferences();
  const [mobilePlayback, setMobilePlayback] = useState(false);
  const playbackPreferences = { ...preferences, isMobile: preferences.isMobile && !mobilePlayback };
  const eligible = shouldLoadStudioMedia(playbackPreferences);
  const manualPlayback = allowMobilePlayback && preferences.isMobile && !eligible
    && shouldLoadStudioMedia({ ...preferences, isMobile: false });
  const [inView, setInView] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [playing, setPlaying] = useState(false);
  // Latch loading after the first intersection; never fetch film on static profiles.
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const visibility = () => setDocumentVisible(!document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      setInView(visible);
      if (visible && eligible) setRequested(true);
    }, { threshold: 0.15 });
    observer?.observe(element);
    // Without observation support, retain a useful still instead of blind autoplay.
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [eligible]);

  const loadFilm = Boolean(videoSrc && eligible && requested && !failed);
  const shouldPlay = shouldPlayStudioMedia({ ...playbackPreferences, inView, documentVisible, userPaused, failed: failed || blocked });

  useEffect(() => {
    const element = video.current;
    if (!element || !loadFilm) return;
    let current = true;
    if (shouldPlay) {
      element.muted = true;
      const request = element.play();
      request?.catch((error: unknown) => {
        if (current && isStudioPlaybackFailure(error)) setBlocked(true);
      });
    } else element.pause();
    return () => {
      current = false;
      element.pause();
    };
  }, [loadFilm, shouldPlay]);

  const toggle = () => {
    if (playing || (!blocked && !userPaused)) {
      setUserPaused(true);
      video.current?.pause();
      root.current?.querySelector<HTMLElement>("[data-studio-parallax]")?.style.removeProperty("transform");
    } else {
      setBlocked(false);
      setUserPaused(false);
    }
  };
  const startManualPlayback = () => {
    setUserPaused(false);
    setBlocked(false);
    setMobilePlayback(true);
  };
  const paused = userPaused || blocked;
  const label = manualPlayback ? (locale === "pt" ? "Animar cena" : "Animate scene") : locale === "pt"
    ? playing ? "Pausar filme" : blocked ? "Reproduzir filme" : userPaused ? "Retomar filme" : "Filme em pausa"
    : playing ? "Pause film" : blocked ? "Play film" : userPaused ? "Resume film" : "Film paused";

  return (
    <div ref={root} className={`${styles.media} ${className}`} data-studio-media data-studio-paused={paused || !eligible} data-playing={playing && eligible && !failed}>
      <div id={mediaId} className={styles.mediaArtwork} data-studio-parallax={decorative ? "" : undefined}>
        <picture>
          {mobilePoster ? <source media="(max-width: 767px)" srcSet={mobilePoster} /> : null}
          {/* Native picture selects the owned portrait WebP without downloading both crops. */}
          <img src={poster} alt={decorative ? "" : description ?? ""} width={1920} height={1280} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" className={styles.mediaPoster} />
        </picture>
        {loadFilm ? (
          <video ref={video} src={videoSrc} poster={poster} muted playsInline loop preload="none" aria-hidden="true" className={styles.mediaFilm}
            onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
            onError={() => { setFailed(true); setPlaying(false); }}
          />
        ) : null}
      </div>
      {videoSrc && (eligible || manualPlayback) && !failed ? (
        <button type="button" className={styles.mediaControl} onClick={manualPlayback ? startManualPlayback : toggle} aria-label={label} aria-controls={mediaId}>
          {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          <span>{label}</span>
        </button>
      ) : null}
      <span className={styles.srOnly} role="status">{failed || blocked ? (locale === "pt" ? "Imagem estática exibida. O filme não iniciou." : "Still image displayed. The film did not start.") : ""}</span>
    </div>
  );
}

export function StudioHeroMedia({ locale }: { locale: "pt" | "en" }) {
  return (
    <figure className={styles.heroFigure}>
      <StudioAmbientMedia locale={locale} poster="/media/je4ndev/studio-architecture.webp" mobilePoster="/media/je4ndev/studio-architecture-mobile.webp" videoSrc="/media/je4ndev/studio-architecture-loop.mp4" eager decorative className={styles.heroMedia} />
      <figcaption className={styles.artCaption}>
        <span>{locale === "pt" ? "Estudo de forma / 01" : "Form study / 01"}</span>
        <span>{locale === "pt" ? "Arte conceitual original · não é uma tela de produto" : "Original conceptual art · not a product screenshot"}</span>
      </figcaption>
    </figure>
  );
}
