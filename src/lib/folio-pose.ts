/** Two-color folio poses: 0 site, 1 system, 2 assistant. No assets. */

export interface FolioPart {
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  sz: number;
}

export interface FolioPose {
  sheet: FolioPart;
  plateA: FolioPart;
  plateB: FolioPart;
  core: FolioPart;
  ring: FolioPart;
}

function weight(shape: number, center: number) {
  return Math.max(0, 1 - Math.abs(shape - center));
}

function part(
  shape: number,
  site: [number, number, number, number],
  system: [number, number, number, number],
  assistant: [number, number, number, number],
): FolioPart {
  const siteWeight = weight(shape, 0);
  const systemWeight = weight(shape, 1);
  const assistantWeight = weight(shape, 2);
  const total = siteWeight + systemWeight + assistantWeight || 1;
  const mix = (index: number) =>
    (siteWeight * site[index] + systemWeight * system[index] + assistantWeight * assistant[index]) / total;
  const scale = mix(3);
  return { x: mix(0), y: mix(1), z: mix(2), sx: scale, sy: scale, sz: scale };
}

export function folioPose(shape: number): FolioPose {
  const clamped = Math.max(0, Math.min(2, shape));
  return {
    sheet: {
      ...part(clamped, [0, 0.08, 0, 1], [0, -0.66, 0, 1], [0, -0.82, 0, 0.42]),
      sy: part(clamped, [0, 0, 0, 1], [0, 0, 0, 0.08], [0, 0, 0, 0.06]).sx,
      sx: part(clamped, [0, 0, 0, 1], [0, 0, 0, 1.18], [0, 0, 0, 0.46]).sx,
      sz: 1,
    },
    plateA: part(clamped, [0, -0.12, -0.04, 0.18], [-0.34, 0.22, 0.24, 1], [0.48, 0.42, 0.12, 0.28]),
    plateB: part(clamped, [0, -0.22, -0.02, 0.14], [0.38, -0.08, 0.36, 1], [-0.46, -0.18, 0.18, 0.24]),
    core: part(clamped, [0, 0.02, 0.08, 0.02], [0, 0.08, 0.1, 0.08], [0, 0.16, 0.2, 1]),
    ring: part(clamped, [0, 0.02, 0, 0.02], [0, 0.08, 0, 0.16], [0, 0.16, 0, 1]),
  };
}
