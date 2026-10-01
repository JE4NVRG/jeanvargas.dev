"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Maximize2, X } from "lucide-react";
import styles from "@/components/sections/product-showcase.module.css";

type PublicSnapshot = {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
  kind?: "composition";
};

type Props = {
  slug: string;
  title: string;
  images: readonly PublicSnapshot[];
  tagline: string;
  accent: "cyan" | "amber" | "blue" | "violet";
  locale: "en" | "pt";
  priority?: boolean;
};

export function ProductShowcaseMedia({ slug, title, images, tagline, accent, locale, priority = false }: Props) {
  const [selected, setSelected] = useState(0);
  const [viewerImage, setViewerImage] = useState<PublicSnapshot | null>(null);
  const [actualSize, setActualSize] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const dialogId = useId();
  const current = images[selected] ?? images[0];
  const copy = locale === "pt" ? {
    enlarge: "Ampliar imagem", close: "Fechar", actual: "Tamanho real", previews: "Prévias do produto",
    snapshot: "Captura pública", composition: "Composição do produto", viewer: "Imagem ampliada", scroll: "Imagem do produto; use as setas para navegar em tamanho real",
  } : {
    enlarge: "Enlarge image", close: "Close", actual: "Actual size", previews: "Product previews",
    snapshot: "Public snapshot", composition: "Product composition", viewer: "Enlarged image", scroll: "Product image; use arrow keys to scroll at actual size",
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!viewerImage || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    const opener = openerRef.current;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    closeRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [viewerImage]);

  function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    ));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  function openViewer(opener: HTMLButtonElement) {
    openerRef.current = opener;
    setActualSize(false);
    setViewerImage(current);
  }

  if (!current) return null;
  const snapshotLabel = current.kind === "composition" ? copy.composition : copy.snapshot;

  return (
    <figure className={styles.figure} data-product={slug} data-accent={accent}>
      <button type="button" className={styles.imageButton} onClick={(event) => openViewer(event.currentTarget)}
        aria-label={`${copy.enlarge}: ${title} · ${current.label}`} aria-haspopup="dialog" aria-controls={dialogId}>
        <Image src={current.src} alt={current.alt} width={current.width} height={current.height}
          className={styles.image} sizes="(min-width: 1440px) 880px, (min-width: 1024px) 65vw, calc(100vw - 48px)"
          priority={priority && selected === 0} />
      </button>
      <figcaption className={styles.caption}>
        <div className={styles.captionText}>
          <span className={styles.snapshotLabel}>{snapshotLabel} / {current.label}</span>
          <p className={styles.tagline}>{tagline}</p>
        </div>
        <button type="button" className={styles.enlarge} onClick={(event) => openViewer(event.currentTarget)}
          aria-label={`${copy.enlarge}: ${title}`} aria-haspopup="dialog" aria-controls={dialogId}>
          <Maximize2 size={16} aria-hidden="true" />{copy.enlarge}
        </button>
      </figcaption>
      {images.length > 1 ? (
        <div className={styles.previews} role="group" aria-label={`${copy.previews}: ${title}`}>
          {images.map((image, index) => (
            <button type="button" key={image.src} className={styles.preview} aria-pressed={index === selected}
              onClick={() => setSelected(index)}>
              <Image src={image.src} alt="" width={image.width} height={image.height} sizes="112px" className={styles.previewImage} />
              <span>{image.label}</span>
            </button>
          ))}
        </div>
      ) : null}
      <dialog ref={dialogRef} id={dialogId} className={styles.dialog} aria-labelledby={`${dialogId}-title`}
        onCancel={(event) => { event.preventDefault(); setViewerImage(null); }}
        onClose={() => setViewerImage(null)} onKeyDown={trapFocus}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) {
            // Do not let the backdrop's default action steal restored focus.
            event.preventDefault();
            setViewerImage(null);
          }
        }}>
        {viewerImage ? (
          <div className={styles.viewer}>
            <div className={styles.viewerHeader}>
              <h4 id={`${dialogId}-title`} className={styles.viewerTitle}>{title} <span>· {viewerImage.label}</span></h4>
              <div className={styles.viewerActions}>
                <button type="button" className={styles.viewerButton} aria-pressed={actualSize} onClick={() => setActualSize(!actualSize)}>{copy.actual}</button>
                <button ref={closeRef} type="button" className={styles.viewerButton} onClick={() => setViewerImage(null)}>
                  <X size={18} aria-hidden="true" />{copy.close}
                </button>
              </div>
            </div>
            <div className={styles.viewerScroll} data-actual-size={actualSize} tabIndex={0} role="region" aria-label={copy.scroll}>
              <Image src={viewerImage.src} alt={viewerImage.alt} width={viewerImage.width} height={viewerImage.height}
                className={styles.viewerImage} data-actual-size={actualSize} sizes={`${viewerImage.width}px`}
                style={actualSize ? { width: viewerImage.width } : undefined} />
            </div>
            <p className={styles.viewerHint}>{copy.viewer} · {viewerImage.kind === "composition" ? copy.composition : copy.snapshot} · Esc</p>
          </div>
        ) : null}
      </dialog>
    </figure>
  );
}
