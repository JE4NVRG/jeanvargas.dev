"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { folioPose } from "@/lib/folio-pose";

const IVORY = "#E1CDA8";
const MINERAL = "#5EEAD4";

class SculptureBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Folio() {
  const group = useRef<THREE.Group>(null);
  const sheet = useRef<THREE.Mesh>(null);
  const plateA = useRef<THREE.Mesh>(null);
  const plateB = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const shape = useRef(0);
  const spin = useRef(0);
  const root = useRef<HTMLElement | null>(null);

  useFrame((_, delta) => {
    const groupNode = group.current;
    if (!groupNode) return;
    root.current ??= groupNode.parent
      ? document.querySelector<HTMLElement>("[data-hero-root]")
      : null;
    const section = root.current;
    const need = section?.dataset.need;
    const chapter = Number(section?.dataset.chapter || "1");
    const target = need === "0" || need === "1" || need === "2"
      ? Number(need)
      : Math.max(0, Math.min(2, (Number.isFinite(chapter) ? chapter : 1) - 1));
    shape.current = THREE.MathUtils.damp(shape.current, target, 3.4, delta);
    const pose = folioPose(shape.current);
    const place = (mesh: THREE.Mesh | null, part: { x: number; y: number; z: number; sx: number; sy: number; sz: number }) => {
      if (!mesh) return;
      mesh.position.set(part.x, part.y, part.z);
      mesh.scale.set(Math.max(0.001, part.sx), Math.max(0.001, part.sy), Math.max(0.001, part.sz));
    };
    place(sheet.current, pose.sheet);
    place(plateA.current, pose.plateA);
    place(plateB.current, pose.plateB);
    place(core.current, pose.core);
    place(ring.current, pose.ring);

    const tiltX = Number.parseFloat(section?.style.getPropertyValue("--tilt-x") || "0") || 0;
    const tiltY = Number.parseFloat(section?.style.getPropertyValue("--tilt-y") || "0") || 0;
    const engaged = Math.min(1, Math.hypot(tiltX, tiltY) / 8);
    spin.current += delta * 0.18 * (1 - engaged);
    groupNode.rotation.y = spin.current + THREE.MathUtils.degToRad(tiltY) * 0.85;
    groupNode.rotation.x = THREE.MathUtils.degToRad(tiltX) * 0.55;
    if (ring.current) ring.current.rotation.x = Math.PI / 2.35;
    if (core.current) core.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={group}>
      <mesh ref={sheet}>
        <boxGeometry args={[1.62, 1.12, 0.04]} />
        <meshStandardMaterial color={IVORY} roughness={0.46} metalness={0.04} />
      </mesh>
      <mesh ref={plateA}>
        <boxGeometry args={[1.15, 0.07, 0.62]} />
        <meshStandardMaterial color={MINERAL} roughness={0.32} metalness={0.08} />
      </mesh>
      <mesh ref={plateB}>
        <boxGeometry args={[0.92, 0.07, 0.5]} />
        <meshStandardMaterial color={MINERAL} roughness={0.32} metalness={0.08} />
      </mesh>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.46, 0]} />
        <meshStandardMaterial color={MINERAL} roughness={0.24} metalness={0.16} flatShading />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[0.68, 0.016, 10, 42]} />
        <meshStandardMaterial color={IVORY} roughness={0.4} metalness={0.06} />
      </mesh>
    </group>
  );
}

export default function HeroSculptureCanvas({ onReady }: { onReady: () => void }) {
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  const flags = useRef({ visible: true, onScreen: true });

  useEffect(() => {
    const section = document.querySelector<HTMLElement>("[data-hero-root]");
    const sync = () => setFrameloop(flags.current.visible && flags.current.onScreen ? "always" : "never");
    const onVisibility = () => {
      flags.current.visible = !document.hidden;
      sync();
    };
    const observer = typeof IntersectionObserver === "undefined" || !section
      ? null
      : new IntersectionObserver(([entry]) => {
        flags.current.onScreen = entry.isIntersecting;
        sync();
      }, { threshold: 0.08 });
    observer?.observe(section!);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <SculptureBoundary>
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.25]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.05, 4.5], fov: 32 }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        aria-hidden="true"
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          onReady();
        }}
      >
        <hemisphereLight args={["#f6f1e6", "#10181c", 0.9]} />
        <directionalLight position={[2.4, 2.8, 3.6]} intensity={1.55} color="#fff8ee" />
        <directionalLight position={[-2.8, -1.2, -2]} intensity={0.38} color={MINERAL} />
        <Folio />
      </Canvas>
    </SculptureBoundary>
  );
}
