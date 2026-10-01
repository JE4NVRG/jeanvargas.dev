"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowDown, ArrowUpRight, MessageCircle, Sparkles } from "lucide-react";
import { StudioAmbientMedia } from "@/components/ui/studio-hero-media";
import { useStudioMotionPreferences } from "@/components/ui/studio-motion-provider";
import { shouldLoadStudioMedia } from "@/lib/studio-motion-policy";
import { btnPrimary, btnSecondary } from "@/components/ui/button-classes";
import { getProductPresentation } from "@/data/product-presentation";
import { FLAGSHIP_SLUGS } from "@/data/flagships";
import { projects } from "@/data/projects";
import { useTranslation } from "@/i18n";
import { COMPANY } from "@/data/company";
import { contactEmailHref } from "@/lib/contact-email";
import styles from "./brand-hero.module.css";

const sceneQuery = "(min-width: 1024px) and (min-height: 700px)";
function subscribeSceneViewport(callback: () => void) {
  const query = window.matchMedia(sceneQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function sceneViewportSnapshot() { return window.matchMedia(sceneQuery).matches; }
function staticSceneSnapshot() { return false; }

export function Hero() {
  const { t, locale } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const profile = useStudioMotionPreferences();
  const wideScene = useSyncExternalStore(subscribeSceneViewport, sceneViewportSnapshot, staticSceneSnapshot);
  const immersive = wideScene && shouldLoadStudioMedia(profile);
  const [need, setNeed] = useState<number | null>(null);
  const pt = locale === "pt";
  const needs = pt
    ? [
      { title: "Um site", detail: "Uma presença digital à altura do seu trabalho.", message: "Quero criar um site para apresentar meu trabalho. Minha ideia é: " },
      { title: "Um sistema", detail: "Sua ideia vira uma ferramenta que funciona.", message: "Quero construir um sistema ou produto digital. Minha ideia é: " },
      { title: "Um assistente de IA", detail: "Contexto e ferramentas para a sua rotina.", message: "Quero um assistente de IA personalizado para minha rotina. Minha necessidade é: " },
    ]
    : [
      { title: "A website", detail: "A digital presence that reflects your work.", message: "I want a website to present my work. My idea is: " },
      { title: "A system", detail: "Your idea becomes a tool that works.", message: "I want to build a system or digital product. My idea is: " },
      { title: "An AI assistant", detail: "Context and tools for your everyday life.", message: "I want a custom AI assistant for my routine. What I need is: " },
    ];
  const message = (pt ? "Olá! " : "Hi! ") + (need === null
    ? (pt ? "Quero conversar sobre um projeto. Minha necessidade é: " : "I would like to discuss a project. What I need is: ")
    : needs[need].message);

  useEffect(() => {
    const element = root.current;
    const surface = stage.current;
    if (!element || !surface || !immersive) return;
    let live = true;
    let frame = 0;
    let x = 0;
    let y = 0;
    let lightX = 50;
    let lightY = 65;
    let revert = () => {};
    const applyPointer = () => {
      frame = 0;
      surface.style.setProperty("--tilt-x", (-y * 10).toFixed(2) + "deg");
      surface.style.setProperty("--tilt-y", (x * 14).toFixed(2) + "deg");
      surface.style.setProperty("--light-x", lightX.toFixed(2) + "%");
      surface.style.setProperty("--light-y", lightY.toFixed(2) + "%");
      surface.style.setProperty("--scene-x", (x * 6).toFixed(2) + "px");
      surface.style.setProperty("--scene-y", (y * 4).toFixed(2) + "px");
    };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = surface.getBoundingClientRect();
      x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
      lightX = (x + 1) * 50;
      lightY = (y + 1) * 50;
      surface.dataset.pointer = "active";
      if (!frame) frame = requestAnimationFrame(applyPointer);
    };
    const resetPointer = () => {
      x = 0; y = 0; lightX = 50; lightY = 65;
      delete surface.dataset.pointer;
      if (!frame) frame = requestAnimationFrame(applyPointer);
    };
    surface.addEventListener("pointermove", pointer, { passive: true });
    surface.addEventListener("pointerleave", resetPointer);

    void import("@/lib/gsap").then(({ gsap, ScrollTrigger }) => {
      if (!live) return;
      element.dataset.motion = "on";
      element.dataset.chapter = "1";
      const context = gsap.context(() => {
        const opening = surface.querySelector("[data-hero-opening]");
        const nodes = surface.querySelector("[data-hero-needs]");
        const field = surface.querySelector("[data-hero-field]");
        const chapter = surface.querySelector("[data-hero-chapter]");
        const proof = surface.querySelector("[data-hero-proof]");
        const artwork = surface.querySelector("[data-studio-parallax]");
        const cards = surface.querySelectorAll("[data-hero-card]");
        gsap.set([chapter, proof], { autoAlpha: 0 });
        gsap.from(opening, { y: 22, duration: 0.9, ease: "power3.out" });
        let currentChapter = 1;
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: element, start: "top top", end: "bottom bottom", scrub: 0.75,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              const next = progress < 0.3 ? 1 : progress < 0.66 ? 2 : 3;
              if (next !== currentChapter) {
                currentChapter = next;
                element.dataset.chapter = String(next);
                const active = document.activeElement;
                const outgoing = next === 1 ? [chapter, proof] : next === 2 ? [opening, nodes, proof] : [opening, nodes, chapter];
                if (active instanceof HTMLElement && outgoing.some(panel => panel?.contains(active))) {
                  surface.focus({ preventScroll: true });
                }
              }
            },
          },
        });
        timeline
          .to(opening, { autoAlpha: 0, y: -65, duration: 0.23 }, 0.08)
          .to([nodes, field], { autoAlpha: 0, duration: 0.2 }, 0.1)
          .fromTo(chapter, { y: 70 }, { autoAlpha: 1, y: 0, duration: 0.22 }, 0.27)
          .to(artwork, { scale: 1.12, yPercent: -5, duration: 0.5 }, 0.12)
          .to(chapter, { autoAlpha: 0, y: -50, duration: 0.17 }, 0.54)
          .fromTo(proof, { y: 75 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.63)
          .from(cards, { y: 100, rotationY: -16, duration: 0.2, stagger: 0.035 }, 0.65)
          .to(artwork, { scale: 1, yPercent: 0, duration: 0.2 }, 0.8);
        // Hold the final product composition before leaving the sticky scene.
        timeline.to({}, { duration: 0.12 }, 0.88);
      }, element);
      revert = () => context.revert();
      ScrollTrigger.refresh();
    }).catch(() => {
      delete element.dataset.motion;
      delete element.dataset.chapter;
    });

    return () => {
      live = false;
      const active = document.activeElement;
      if (active instanceof HTMLElement && Array.from(surface.querySelectorAll("[data-hero-chapter], [data-hero-proof]")).some(panel => panel.contains(active))) {
        surface.focus({ preventScroll: true });
      }
      revert();
      cancelAnimationFrame(frame);
      surface.removeEventListener("pointermove", pointer);
      surface.removeEventListener("pointerleave", resetPointer);
      ["--tilt-x", "--tilt-y", "--light-x", "--light-y", "--scene-x", "--scene-y"].forEach(key => surface.style.removeProperty(key));
      delete surface.dataset.pointer;
      delete element.dataset.motion;
      delete element.dataset.chapter;
    };
  }, [immersive, locale]);

  return (
    <section ref={root} className={styles.hero} aria-labelledby="hero-heading">
      <div ref={stage} className={styles.stage} tabIndex={-1} aria-label={pt ? "Sua ideia, a experiência e os produtos" : "Your idea, the experience and the products"}>
        <div className={styles.world}>
          <StudioAmbientMedia locale={locale} poster="/media/je4ndev/idea-space-v2.webp"
            videoSrc="/media/je4ndev/idea-space-v2.mp4" eager decorative allowMobilePlayback className={styles.scene} />
          <div className={styles.shade} aria-hidden="true" />
        </div>
        <div className={styles.pointerLight} aria-hidden="true" />
        <div data-hero-opening className={styles.opening}>
          <p className={styles.eyebrow}><span />JE4NDEV / {pt ? "Estúdio de produto digital" : "Remote studio · English & Portuguese"}</p>
          <h1 id="hero-heading" className={styles.title}>{t.hero.title}{" "}<span>{t.hero.titleHighlight}</span></h1>
          <p className={styles.description}>{t.hero.subtitle}</p>
          <div className={styles.actions}>
            <a href={pt ? COMPANY.whatsappUrl + "?text=" + encodeURIComponent(message) : contactEmailHref(locale)} target={pt ? "_blank" : undefined} rel={pt ? "noopener noreferrer" : undefined}
              data-analytics-event="lead-cta-click" data-cta={pt ? "hero-whatsapp" : "hero-email"} data-offer="diagnosis-first-milestone" className={btnPrimary}>
              {t.hero.secondaryCta}<ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a href="#work" data-analytics-event="portfolio-proof-cta" data-cta="hero-products" className={btnSecondary}>
              {t.hero.cta}<ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <button type="button" data-cta="hero-nora-demo" onClick={() => window.dispatchEvent(new Event("je4ndev:open-nora"))} className={styles.nora}>
            <MessageCircle size={15} aria-hidden="true" />{pt ? "Conheça a Nora, nossa assistente de IA" : "Meet Nora, our AI assistant"}
          </button>
        </div>
        <div data-hero-field className={styles.field} aria-hidden="true">
          <svg viewBox="0 0 1000 400" fill="none">
            <path d="M85 135 C285 70 355 360 510 225 S730 50 920 135" />
            <path d="M250 325 C360 80 630 70 760 300" />
            <ellipse cx="510" cy="225" rx="145" ry="80" />
            <circle cx="510" cy="225" r="9" />
            <circle cx="85" cy="135" r="4" /><circle cx="920" cy="135" r="4" /><circle cx="760" cy="300" r="4" />
          </svg>
        </div>
        <div data-hero-needs className={styles.needs} aria-label={pt ? "O que você quer criar?" : "What would you like to create?"}>
          {needs.map((option, index) => (
            <button key={option.title} type="button" data-selected={need === index} aria-pressed={need === index}
              onClick={() => setNeed(need === index ? null : index)} className={styles.need}>
              <span className={styles.node} aria-hidden="true"><Sparkles size={12} /></span>
              <span>{option.title}<small>{option.detail}</small></span>
            </button>
          ))}
        </div>
        <div data-hero-chapter className={styles.chapter}>
          <p className={styles.eyebrow}>{pt ? "DA INTENÇÃO À EXPERIÊNCIA" : "FROM INTENT TO EXPERIENCE"}</p>
          <h2>{pt ? "Pensado para você." : "Built around you."}<span>{pt ? "Construído para funcionar." : "Engineered to work."}</span></h2>
          <p>{pt ? "Um site que apresenta seu trabalho. Um sistema que facilita seu dia. Um assistente que entende seu contexto." : "A website that presents your work. A system that makes your day easier. An assistant that understands your context."}</p>
          <a href={pt ? COMPANY.whatsappUrl + "?text=" + encodeURIComponent(message) : contactEmailHref(locale)} target={pt ? "_blank" : undefined} rel={pt ? "noopener noreferrer" : undefined}
            data-analytics-event="lead-cta-click" data-cta={pt ? "hero-story-whatsapp" : "hero-story-email"} data-offer="diagnosis-first-milestone" className={btnPrimary}>
            {pt ? "Vamos construir sua ideia" : "Let's build your idea"}<ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div data-hero-proof className={styles.proof}>
          <p className={styles.eyebrow}>{pt ? "IDEIAS QUE JÁ GANHARAM FORMA" : "IDEAS WE HAVE BROUGHT TO LIFE"}</p>
          <h2>{pt ? "Agora, imagine o seu." : "Now, imagine yours."}</h2>
          <nav className={styles.cards} aria-label={pt ? "Explore nossos produtos" : "Explore our products"}>
            {FLAGSHIP_SLUGS.map(slug => {
              const project = projects.find(item => item.slug === slug);
              const presentation = getProductPresentation(slug, locale);
              const image = presentation.images[0];
              if (!project || !image) return null;
              return <a data-hero-card key={slug} href={"#project-" + slug} className={styles.card}>
                <div className={styles.cardImage}><Image src={image.src} alt="" width={image.width} height={image.height} sizes="(min-width: 1024px) 22vw, 100vw" /></div>
                <span>{project.title}<ArrowUpRight size={16} aria-hidden="true" /></span>
                <small>{slug === "fullcommerce360" ? (pt ? "Interface real · dados de demonstração" : "Real interface · demonstration data") : presentation.tagline}</small>
              </a>;
            })}
          </nav>
          <a className={styles.proofLink} href="#work">{pt ? "Explore os produtos e suas histórias" : "Explore the products and their stories"}<ArrowDown size={16} aria-hidden="true" /></a>
        </div>
        <div className={styles.footer}>
          <p>{pt ? "Design, engenharia e IA. Do seu jeito." : "Design, engineering and AI. Built around you."}</p>
          <div className={styles.chapters} aria-hidden="true"><span>01 / {pt ? "IDEIA" : "IDEA"}</span><span>02 / {pt ? "EXPERIÊNCIA" : "EXPERIENCE"}</span><span>03 / {pt ? "PRODUTOS" : "PRODUCTS"}</span></div>
          <a href="#work">{pt ? "Role para descobrir" : "Scroll to discover"}<ArrowDown size={14} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
