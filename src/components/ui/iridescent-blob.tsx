"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * IridescentBlob — a 3D ico-sphere with a custom fragment shader producing
 * a slowly morphing iridescent surface in the brand palette. Pure WebGL.
 *
 * Inspired by Venture Post's hero blob: domain warp + Fresnel + brand tints.
 */

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;

  // Simplex noise (Stefan Gustavson)
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    vec3 pos = position;
    // Multi-octave domain warp
    float n1 = snoise(pos * 0.9 + uTime * 0.12);
    float n2 = snoise(pos * 2.1 - uTime * 0.18);
    float displacement = n1 * 0.18 + n2 * 0.08;
    pos += normal * displacement;
    vNormal = normalize(normalMatrix * normal);
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    // Fresnel
    vec3 viewDir = normalize(-vPosition);
    float fresnel = 1.0 - max(0.0, dot(vNormal, viewDir));
    fresnel = pow(fresnel, 1.4);

    // Brand palette — cyan, violet, magenta, emerald
    vec3 cyan = vec3(0.369, 0.917, 0.831);    // #5EEAD4
    vec3 violet = vec3(0.545, 0.361, 0.965);  // #8B5CF6
    vec3 magenta = vec3(0.925, 0.282, 0.600); // #EC4899
    vec3 emerald = vec3(0.063, 0.725, 0.506); // #10B981

    // Time-varying iridescence based on view angle + position
    float angle = uTime * 0.3 + vPosition.x * 1.5 + vPosition.y * 1.2;
    vec3 colorA = mix(cyan, violet, sin(angle) * 0.5 + 0.5);
    vec3 colorB = mix(magenta, emerald, cos(angle * 0.7) * 0.5 + 0.5);
    vec3 base = mix(colorA, colorB, fresnel);

    // Brighter rim
    base += vec3(fresnel * 0.4);
    base *= 0.55;

    gl_FragColor = vec4(base, 1.0);
  }
`;

function Blob() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.06;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.09;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.4, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 } }}
      />
    </mesh>
  );
}

export function IridescentBlob() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Position blob to upper-right so left side stays clean for text */}
      <div className="pointer-events-none absolute right-[-10%] top-[5%] h-[80vh] w-[70vw] lg:right-[-5%] lg:top-[2%]">
        <Canvas
          camera={{ position: [0, 0, 3.4], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.5} />
          <Blob />
        </Canvas>
      </div>
      {/* Strong dark gradient on left side to ensure text legibility */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,#050505_0%,#050505_30%,rgba(5,5,5,0.55)_55%,transparent_85%)]" />
      {/* Soft top + bottom vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.5)_0%,transparent_15%,transparent_75%,#050505_100%)]" />
    </div>
  );
}
