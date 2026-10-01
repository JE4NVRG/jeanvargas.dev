"use client";

import { StudioAmbientMedia } from "@/components/ui/studio-hero-media";
import styles from "@/components/sections/studio-motion.module.css";

export function StudioReel({ locale }: { locale: "pt" | "en" }) {
  return (
    <figure className={styles.reel} data-studio-reveal>
      <StudioAmbientMedia locale={locale} poster="/media/je4ndev/studio-product-reel-poster.webp" videoSrc="/media/je4ndev/studio-product-reel.mp4" className={styles.reelMedia}
        description={locale === "pt" ? "Montagem de capturas reais de ArchScene, FullCommerce360 e URLPivot." : "Montage of real captures from ArchScene, FullCommerce360 and URLPivot."} />
      <figcaption className={styles.reelCaption}>
        <span>{locale === "pt" ? "Da interface à operação." : "From interface to operation."}</span>
        <span>{locale === "pt" ? "Capturas reais dos produtos · filme sem áudio" : "Real product captures · silent film"}</span>
      </figcaption>
    </figure>
  );
}
