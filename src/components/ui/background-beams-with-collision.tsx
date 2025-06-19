"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const beams = [
    // Primeira fileira - esquerda
    { initialX: 50, translateX: 50, duration: 7, repeatDelay: 3, delay: 1 },
    {
      initialX: 150,
      translateX: 150,
      duration: 5,
      repeatDelay: 4,
      delay: 2,
      className: "h-8",
    },
    { initialX: 250, translateX: 250, duration: 9, repeatDelay: 2, delay: 0.5 },
    { initialX: 350, translateX: 350, duration: 6, repeatDelay: 5, delay: 3 },
    {
      initialX: 450,
      translateX: 450,
      duration: 8,
      repeatDelay: 3,
      delay: 1.5,
      className: "h-20",
    },

    // Segunda fileira - centro
    { initialX: 550, translateX: 550, duration: 4, repeatDelay: 6, delay: 2.5 },
    { initialX: 650, translateX: 650, duration: 7, repeatDelay: 2, delay: 0 },
    {
      initialX: 750,
      translateX: 750,
      duration: 10,
      repeatDelay: 4,
      delay: 4,
      className: "h-12",
    },
    { initialX: 850, translateX: 850, duration: 5, repeatDelay: 3, delay: 1 },
    { initialX: 950, translateX: 950, duration: 6, repeatDelay: 5, delay: 3.5 },

    // Terceira fileira - direita
    { initialX: 1050, translateX: 1050, duration: 8, repeatDelay: 2, delay: 2 },
    {
      initialX: 1150,
      translateX: 1150,
      duration: 4,
      repeatDelay: 4,
      delay: 0.8,
      className: "h-16",
    },
    { initialX: 1250, translateX: 1250, duration: 7, repeatDelay: 3, delay: 3 },
    {
      initialX: 1350,
      translateX: 1350,
      duration: 9,
      repeatDelay: 5,
      delay: 1.2,
    },
    { initialX: 1450, translateX: 1450, duration: 5, repeatDelay: 2, delay: 4 },

    // Quarta fileira - extrema direita (para telas grandes)
    {
      initialX: 1550,
      translateX: 1550,
      duration: 6,
      repeatDelay: 4,
      delay: 2.8,
    },
    {
      initialX: 1650,
      translateX: 1650,
      duration: 8,
      repeatDelay: 3,
      delay: 0.3,
      className: "h-10",
    },
    {
      initialX: 1750,
      translateX: 1750,
      duration: 7,
      repeatDelay: 5,
      delay: 3.5,
    },
    {
      initialX: 1850,
      translateX: 1850,
      duration: 4,
      repeatDelay: 2,
      delay: 1.8,
    },
    {
      initialX: 1950,
      translateX: 1950,
      duration: 9,
      repeatDelay: 4,
      delay: 4.2,
    },
  ];

  return (
    <div
      ref={parentRef}
      className={cn(
        "fixed inset-0 h-screen w-screen bg-transparent flex items-center justify-center overflow-hidden pointer-events-none z-[-1]",
        className
      )}
    >
      {beams.map((beam) => (
        <CollisionMechanism
          key={beam.initialX + "beam-idx"}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}

      {children}
      <div
        ref={containerRef}
        className="absolute bottom-0 bg-transparent w-full inset-x-0 pointer-events-none h-20"
        style={{
          boxShadow: "none",
        }}
      ></div>
    </div>
  );
};

const CollisionMechanism = ({
  containerRef,
  parentRef,
  beamOptions = {},
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  parentRef: React.RefObject<HTMLDivElement | null>;
  beamOptions?: {
    initialX?: number;
    translateX?: number;
    initialY?: number;
    translateY?: number;
    rotate?: number;
    className?: string;
    duration?: number;
    delay?: number;
    repeatDelay?: number;
  };
}) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({
    detected: false,
    coordinates: null,
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX =
            beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: {
              x: relativeX,
              y: relativeY,
            },
          });
          setCycleCollisionDetected(true);
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 50);

    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected, containerRef, parentRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 2000);

      setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          y: "-200px",
          x: `${beamOptions.initialX || 0}px`,
          rotate: 0,
        }}
        variants={{
          animate: {
            y: "1800px",
            x: `${beamOptions.translateX || 0}px`,
            rotate: 0,
          },
        }}
        transition={{
          duration: beamOptions.duration || 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0,
        }}
        className={cn(
          "absolute left-0 top-0 m-auto h-14 w-1 rounded-full bg-gradient-to-t from-indigo-500 via-purple-500 to-transparent opacity-80",
          beamOptions.className
        )}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            className=""
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  const [mounted, setMounted] = useState(false);
  const [spans, setSpans] = useState<
    Array<{
      id: number;
      initialX: number;
      initialY: number;
      directionX: number;
      directionY: number;
    }>
  >([]);

  useEffect(() => {
    setMounted(true);
    setSpans(
      Array.from({ length: 20 }, (_, index) => ({
        id: index,
        initialX: 0,
        initialY: 0,
        directionX: Math.floor(Math.random() * 80 - 40),
        directionY: Math.floor(Math.random() * -50 - 10),
      }))
    );
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-sm"
      ></motion.div>
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-cyan-500 to-purple-500"
        />
      ))}
    </div>
  );
};
