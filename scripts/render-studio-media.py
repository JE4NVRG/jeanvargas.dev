#!/usr/bin/env python3
"""Render JE4NDEV's bounded local media slice with existing Pillow and FFmpeg.

No network, environment/config discovery, source mutations, package installs, or
site builds. Default: render and verify. --self-test renders a second copy in the
explicit scratch scope, compares every deliverable byte-for-byte, and writes QA.
--verify reads and validates the current owned manifest without rewriting it.

Example (Windows, from the existing checkout):
    python3 scripts/render-studio-media.py --self-test
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import struct
import subprocess
import sys
import time
from pathlib import Path
from typing import Callable

from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageStat, __version__ as PILLOW_VERSION

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/media/je4ndev"
SCRATCH = Path("C:/Users/jeanc/AppData/Local/hermes/profiles/sage/cache/scratch")
PREFIX = "builder_media_20260930_f15f37_"
TOOLS = Path("C:/Users/jeanc/AppData/Local/hermes/tools/ffmpeg-9.0.1-win32-x64/bin")
FFMPEG = TOOLS / "ffmpeg.EXE"
FFPROBE = TOOLS / "ffprobe.EXE"
ART = Path("C:/Users/jeanc/AppData/Local/hermes/profiles/sage/cache/images/openai_codex_gpt-image-2.5-sunburst_20260930_134911_3df3bae2.png")
QA = Path("F:/JE4NDEV-QA/portfolio-readiness/builder-media-evidence.json")
OWNER = "je4ndev-builder-original-motion-20260930-f15f37"
FPS, WIDTH, HEIGHT = 24, 1280, 720
HERO_FRAMES, SCENE_FRAMES, OVERLAP_FRAMES = 168, 96, 18
REEL_FRAMES = SCENE_FRAMES * 3 - OVERLAP_FRAMES * 2
FILES = (
    "studio-architecture.webp", "studio-architecture-mobile.webp",
    "studio-architecture-loop.mp4", "studio-product-reel.mp4",
    "studio-product-reel-poster.webp", "asset-provenance.json",
)
ART_HASH = "4799082966a89c0ce62d31e8d128948616a886db4c4039446e1a1276e4d03ee8"
PROJECTS = (
    {"id": "archscene", "name": "ArchScene", "url": "https://archscene.com",
     "hash": "880ad146fc2f71a56f015a838331416ed0ec29e94bafb4b52581969f415355bb",
     "caption": "Captura pública existente · Produto em beta · Não é resultado de cliente"},
    {"id": "fullcommerce360", "name": "FullCommerce360", "url": "https://fullcommerce360.com",
     "hash": "f403595fb14ad51d9c22cef965135d738b2460ba6966c7a53aaceb4fe82fed8b",
     "caption": "Captura pública existente · Demonstração com dados sanitizados · Não é resultado de cliente"},
    {"id": "urlpivot", "name": "URLPivot", "url": "https://urlpivot.app",
     "hash": "be7dd19c4606060513228e1784b6c52c11428fb0ff636d31092dc304d81e4885",
     "caption": "Captura pública existente · Demo pública · Não é resultado de cliente"},
)
FONT_PATHS = {"regular": Path("C:/Windows/Fonts/segoeui.ttf"), "semibold": Path("C:/Windows/Fonts/seguisb.ttf")}
COMMANDS: list[dict] = []


def digest(path: Path) -> str:
    with path.open("rb") as handle:
        return hashlib.file_digest(handle, "sha256").hexdigest()


def write_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def run(args: list, label: str) -> str:
    command = [str(value) for value in args]
    result = subprocess.run(command, capture_output=True, text=True, encoding="utf-8", errors="replace")
    COMMANDS.append({"label": label, "argv": command, "exit_code": result.returncode})
    if result.returncode:
        raise RuntimeError(f"{label}: {result.stderr[-6000:]}")
    return result.stdout


def probe(path: Path) -> dict:
    return json.loads(run([FFPROBE, "-v", "error", "-count_frames", "-show_streams", "-show_format", "-of", "json", path], "ffprobe:" + path.name))


def source_inventory() -> list[dict]:
    entries = []
    inputs = [(ART, "conceptual-generated-art", None, ART_HASH)] + [
        (ROOT / "public/projects/captures" / (p["id"] + "-home-latest.png"), "existing-project-owned-public-capture", p["url"], p["hash"])
        for p in PROJECTS
    ]
    for path, category, url, expected in inputs:
        actual = digest(path)
        if actual != expected:
            raise RuntimeError(f"Source changed or does not match the approved input: {path}")
        with Image.open(path) as image:
            dimensions = list(image.size)
        entries.append({"id": "concept-art" if path == ART else path.name.split("-home")[0],
                        "file": path.name if path == ART else path.relative_to(ROOT).as_posix(),
                        "kind": category, "bytes": path.stat().st_size, "sha256": actual,
                        "dimensions": dimensions, "public_source_url": url,
                        "reuse_basis": "User-authorized original conceptual derivative; private visual candidate only" if path == ART else "Existing project-owned capture/reuse, provided in the checkout; not newly recaptured",
                        "customer_result_claim": False})
    return entries


def safe_destination(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)
    existing = [name for name in FILES if (path / name).exists()]
    if existing:
        manifest = path / "asset-provenance.json"
        if not manifest.is_file() or json.loads(manifest.read_text(encoding="utf-8")).get("owner") != OWNER:
            raise RuntimeError("Refusing to overwrite files not identified as this renderer's own deliverables")
        saved = json.loads(manifest.read_text(encoding="utf-8"))
        for asset in saved["assets"]:
            target = path / asset["file"]
            if target.exists() and digest(target) != asset["sha256"]:
                raise RuntimeError(f"Refusing to overwrite an independently modified asset: {target}")


def encode_frames(target: Path, count: int, frame: Callable[[int], Image.Image], lossless: bool = False) -> None:
    args = [FFMPEG, "-v", "error", "-nostdin", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
            "-s:v", f"{WIDTH}x{HEIGHT}", "-framerate", str(FPS), "-i", "pipe:0", "-an", "-map_metadata", "-1",
            "-frames:v", str(count), "-fps_mode", "vfr"]
    if lossless:
        args += ["-c:v", "ffv1", "-level", "3", "-threads", "1", "-pix_fmt", "bgr0"]
    else:
        args += h264_options()
    args += [target]
    log = SCRATCH / (PREFIX + target.stem + "_encode.log")
    with log.open("wb") as errors:
        process = subprocess.Popen([str(value) for value in args], stdin=subprocess.PIPE, stderr=errors)
        assert process.stdin is not None
        try:
            for index in range(count):
                process.stdin.write(frame(index).convert("RGB").tobytes())
            process.stdin.close()
            code = process.wait(timeout=180)
        except BaseException:
            process.kill()
            process.wait()
            raise
    COMMANDS.append({"label": "encode:" + target.name, "argv": [str(v) for v in args], "exit_code": code, "input_frames": count})
    if code:
        raise RuntimeError(log.read_text(encoding="utf-8", errors="replace"))


def h264_options() -> list[str]:
    return ["-vf", "scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p",
            "-c:v", "libx264", "-preset", "medium", "-crf", "22", "-threads", "1",
            "-maxrate", "1800k", "-bufsize", "3600k", "-g", "48", "-keyint_min", "48",
            "-sc_threshold", "0", "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709",
            "-colorspace", "bt709", "-color_range", "tv", "-movflags", "+faststart"]


def region_frame(image: Image.Image, size: tuple[int, int], box: tuple[float, float, float, float]) -> Image.Image:
    left, top, right, bottom = box
    return image.transform(size, Image.Transform.AFFINE,
                           ((right - left) / size[0], 0, left, 0, (bottom - top) / size[1], top),
                           resample=Image.Resampling.BICUBIC)


def hero_frame(art: Image.Image, index: int) -> Image.Image:
    phase = 2 * math.pi * index / (HERO_FRAMES - 1)
    zoom = 1.002 + 0.026 * (1 - math.cos(phase)) / 2
    w = art.width / zoom
    h = w * HEIGHT / WIDTH
    center_x = art.width / 2 + 2.0 * math.sin(phase)
    center_y = art.height / 2
    return region_frame(art, (WIDTH, HEIGHT), (center_x - w / 2, center_y - h / 2, center_x + w / 2, center_y + h / 2))


def webp(image: Image.Image, path: Path, ceiling: int) -> int:
    for quality in (88, 85, 82, 79, 76, 73, 70):
        image.save(path, "WEBP", quality=quality, method=6, exact=True)
        if path.stat().st_size <= ceiling:
            return quality
    raise RuntimeError(f"WebP exceeds the explicit byte budget: {path}")


def editorial_frame_factory(project: dict, scene: int) -> Callable[[int], Image.Image]:
    capture = Image.open(ROOT / "public/projects/captures" / (project["id"] + "-home-latest.png")).convert("RGB")
    font = lambda weight, size: ImageFont.truetype(str(FONT_PATHS[weight]), size)
    background = Image.new("RGB", (WIDTH, HEIGHT), (10, 12, 14))
    draw = ImageDraw.Draw(background)
    draw.text((44, 22), project["name"], font=font("semibold", 38), fill=(244, 245, 241))
    domain = project["url"].removeprefix("https://")
    draw.text((1236, 29), domain, font=font("regular", 18), fill=(186, 194, 181), anchor="ra")
    draw.line((44, 80, 1236, 80), fill=(50, 57, 49), width=1)
    draw.line((44, 80, 150, 80), fill=(207, 239, 87), width=2)
    draw.rounded_rectangle((128, 100, 1152, 684), radius=12, fill=(20, 24, 25), outline=(69, 76, 65), width=1)
    draw.text((44, 692), project["caption"], font=font("regular", 12), fill=(169, 178, 166))
    draw.text((1236, 692), f"JE4NDEV  /  0{scene + 1}", font=font("semibold", 12), fill=(207, 239, 87), anchor="ra")
    viewport = (1008, 567)
    mask = Image.new("L", viewport, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, viewport[0] - 1, viewport[1] - 1), radius=6, fill=255)
    crop_h = min(capture.height, capture.width * 9 / 16)
    crop_w = min(capture.width, capture.height * 16 / 9)

    def frame(index: int) -> Image.Image:
        progress = index / (SCENE_FRAMES - 1)
        eased = (1 - math.cos(math.pi * progress)) / 2
        zoom = 1.002 + 0.012 * eased
        w, h = crop_w / zoom, crop_h / zoom
        x = (capture.width - w) / 2
        y = 1 + (crop_h - h) * eased * 0.35
        screenshot = region_frame(capture, viewport, (x, y, x + w, y + h))
        output = background.copy()
        output.paste(screenshot, (136, 108), mask)
        return output
    return frame


def faststart_atoms(path: Path) -> dict:
    atoms = []
    with path.open("rb") as handle:
        total = path.stat().st_size
        while handle.tell() + 8 <= total:
            offset = handle.tell()
            size, atom = struct.unpack(">I4s", handle.read(8))
            if size == 1:
                size = struct.unpack(">Q", handle.read(8))[0]
            if size == 0:
                size = total - offset
            if size < 8 or offset + size > total:
                raise RuntimeError("Invalid MP4 top-level atom")
            atoms.append({"type": atom.decode("ascii", errors="replace"), "offset": offset, "bytes": size})
            handle.seek(offset + size)
    positions = {atom["type"]: atom["offset"] for atom in atoms}
    return {"moov_before_mdat": positions["moov"] < positions["mdat"], "top_level_atoms": atoms}


def asset_info(path: Path, source_ids: list[str], kind: str, ceiling: int) -> dict:
    info = {"file": path.name, "public_path": "/media/je4ndev/" + path.name, "bytes": path.stat().st_size,
            "sha256": digest(path), "source_ids": source_ids, "kind": kind, "target_max_bytes": ceiling,
            "customer_result_claim": False}
    if path.suffix == ".webp":
        with Image.open(path) as image:
            image.load()
            info.update({"dimensions": list(image.size), "codec": "webp", "duration_seconds": None})
    else:
        data = probe(path)
        stream = next(s for s in data["streams"] if s["codec_type"] == "video")
        info.update({"dimensions": [stream["width"], stream["height"]], "codec": stream["codec_name"],
                     "pixel_format": stream["pix_fmt"], "frame_rate": stream["avg_frame_rate"],
                     "frames": int(stream["nb_read_frames"]), "duration_seconds": float(data["format"]["duration"]),
                     "audio_streams": sum(s["codec_type"] == "audio" for s in data["streams"]),
                     "silent_intentional": True, "faststart": faststart_atoms(path)["moov_before_mdat"]})
    if info["bytes"] > ceiling:
        raise RuntimeError(f"Byte budget failed: {path.name}: {info['bytes']} > {ceiling}")
    return info


def render(destination: Path, tag: str, sources: list[dict], versions: dict) -> dict:
    safe_destination(destination)
    art = Image.open(ART).convert("RGB")
    wide_q = webp(art, destination / FILES[0], 400_000)
    # Remove left negative space; retain all three panels and the connecting bend.
    mobile_box = (496, 0, 1672, 941)
    mobile = art.crop(mobile_box).resize((900, 720), Image.Resampling.LANCZOS)
    mobile_q = webp(mobile, destination / FILES[1], 220_000)
    encode_frames(destination / FILES[2], HERO_FRAMES, lambda n: hero_frame(art, n))
    intermediates = []
    for scene, project in enumerate(PROJECTS):
        clip = SCRATCH / (PREFIX + tag + "_scene_" + str(scene) + ".nut")
        if clip.exists():
            raise RuntimeError(f"Scratch collision, refusing to overwrite: {clip}")
        encode_frames(clip, SCENE_FRAMES, editorial_frame_factory(project, scene), lossless=True)
        intermediates.append(clip)
    args = [FFMPEG, "-v", "error", "-nostdin", "-y", "-filter_complex_threads", "1"]
    for clip in intermediates:
        args += ["-i", clip]
    chain = (
        "[0:v]settb=1/24,setpts=PTS-STARTPTS,format=gbrp[a];"
        "[1:v]settb=1/24,setpts=PTS-STARTPTS,format=gbrp[b];"
        "[2:v]settb=1/24,setpts=PTS-STARTPTS,format=gbrp[c];"
        "[a][b]xfade=transition=fade:duration=0.75:offset=3.25[ab];"
        "[ab][c]xfade=transition=fade:duration=0.75:offset=6.5,"
        "scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p[out]"
    )
    options = h264_options()
    options = options[2:]  # Conversion belongs to the complex graph, not a second -vf.
    args += ["-filter_complex", chain, "-map", "[out]", "-an", "-map_metadata", "-1", "-frames:v", str(REEL_FRAMES),
             "-fps_mode", "vfr"] + options + [destination / FILES[3]]
    run(args, "editorial-xfade:" + tag)
    poster_png = SCRATCH / (PREFIX + tag + "_poster.png")
    run([FFMPEG, "-v", "error", "-nostdin", "-n", "-i", destination / FILES[3], "-map", "0:v:0", "-an",
         "-frames:v", "1", "-fps_mode", "vfr", poster_png], "actual-video-poster:" + tag)
    with Image.open(poster_png) as poster:
        poster_q = webp(poster, destination / FILES[4], 220_000)
    assets = [asset_info(destination / FILES[0], ["concept-art"], "conceptual-art-still", 400_000),
              asset_info(destination / FILES[1], ["concept-art"], "conceptual-art-mobile-crop", 220_000),
              asset_info(destination / FILES[2], ["concept-art"], "local-deterministic-still-camera-film", 2_500_000),
              asset_info(destination / FILES[3], [p["id"] for p in PROJECTS], "editorial-real-public-capture-reel", 3_000_000),
              asset_info(destination / FILES[4], ["archscene"], "decoded-product-reel-frame-poster", 220_000)]
    manifest = {
        "schema_version": 1, "owner": OWNER, "delivery_status": "private-visual-candidate-not-production-or-Jean-acceptance",
        "sources": sources, "assets": assets, "toolchain": versions, "script_sha256": digest(Path(__file__)),
        "generation_metadata_user_supplied_not_independently_server_verified": {
            "requested_model": "gpt-image-2.5-sunburst", "requested_quality": "high", "server_model": None,
            "model_verified": False, "reported_quality": "low", "reported_size": "1672x941", "pixel_size": [1672, 941],
            "imagegen_request_id": "7672e589-820d-40d1-bd45-420e96f12cde",
            "note": "The PNG does not verify the server model or requested high quality. No new provider call was made."},
        "recipes": {
            FILES[0]: {"source_aspect_preserved": True, "webp_quality": wide_q, "webp_method": 6},
            FILES[1]: {"source_crop_xyxy": list(mobile_box), "dimensions": [900, 720], "webp_quality": mobile_q,
                       "note": "Near-square mobile artwork retains the three panels and their connection; use natural aspect or contain, not a forced narrow portrait crop."},
            FILES[2]: {"frames": HERO_FRAMES, "fps": FPS, "method": "Pillow affine camera over unchanged source geometry, encoded locally with FFmpeg",
                       "zoom_range": [1.002, 1.028], "pan_max_source_pixels": 2, "periodic_cosine": True,
                       "first_last_camera_state_identical": True, "ai_still_to_video": False},
            FILES[3]: {"scene_frames": SCENE_FRAMES, "fps": FPS, "overlap_frames": OVERLAP_FRAMES,
                       "crossfade_seconds": 0.75, "transition_offsets_seconds": [3.25, 6.5],
                       "scene_order": [p["name"] for p in PROJECTS], "viewport_dimensions": [1008, 567],
                       "source_view": "Top-anchored 16:9 crop of unchanged authentic captures; lower capture content omitted, not reconstructed",
                       "zoom_range": [1.002, 1.014], "typography": "Native Windows Segoe UI / Semibold via Pillow, not embedded or redistributed",
                       "metrics_note": "Any figures within FullCommerce360 are pre-existing sanitized demo UI, not new metrics or customer results."},
            FILES[4]: {"decoded_video_frame_index": 0, "webp_quality": poster_q, "source_video": FILES[3]}},
        "excluded_existing_media": {"file": "public/videos/archscene-kitchen.mp4",
                                    "sha256": "c959277408bed4a67394a14e9a8560602e509fd255610112ac6650bf7078600c",
                                    "used": False, "inspected_seconds": [0, 4.51875015, 8.53541695],
                                    "reason": "Kitchen camera footage does not add authentic interface evidence for this capture-only three-product reel; its generation/customer provenance is not asserted."},
        "rights_and_claims": {"third_party_reference_media_reused": False, "inspiration_site_license_copied": False,
                             "new_ai_generation": False, "customer_claims": False,
                             "generated_concept_art_is_product_evidence": False,
                             "site_claims_independently_verified": False},
    }
    write_json(destination / FILES[5], manifest)
    return manifest


def verify(destination: Path) -> dict:
    manifest = json.loads((destination / FILES[5]).read_text(encoding="utf-8"))
    assert manifest["owner"] == OWNER
    assert len(manifest["assets"]) == 5
    checks = []
    for recorded in manifest["assets"]:
        path = destination / recorded["file"]
        actual = asset_info(path, recorded["source_ids"], recorded["kind"], recorded["target_max_bytes"])
        assert actual == recorded, f"Manifest mismatch: {path.name}"
        if path.suffix == ".mp4":
            assert actual["dimensions"] == [WIDTH, HEIGHT]
            assert actual["codec"] == "h264" and actual["pixel_format"] == "yuv420p"
            assert actual["frame_rate"] == "24/1" and actual["audio_streams"] == 0 and actual["faststart"]
            expected = HERO_FRAMES if "architecture" in path.name else REEL_FRAMES
            assert actual["frames"] == expected
            assert abs(actual["duration_seconds"] - expected / FPS) < 0.00001
            run([FFMPEG, "-v", "error", "-xerror", "-nostdin", "-i", path, "-map", "0:v:0", "-an",
                 "-fps_mode", "vfr", "-f", "null", "-"], "full-decode:" + path.name)
        checks.append({"file": path.name, "manifest_matches": True, "within_byte_target": True,
                       "full_decode_exit_code": 0 if path.suffix == ".mp4" else None})
    assert manifest["assets"][0]["dimensions"] == [1672, 941]
    assert manifest["assets"][1]["dimensions"] == [900, 720]
    assert manifest["script_sha256"] == digest(Path(__file__))
    assert source_inventory() == manifest["sources"], "Input preservation failed"
    return {"passed": True, "assets": checks, "sources_unchanged": True, "script_hash_matches": True}


def sampled_frames(path: Path, indices: list[int], tag: str) -> tuple[list[Path], list[Image.Image]]:
    pattern = SCRATCH / (PREFIX + tag + "_%02d.png")
    selection = "+".join(f"eq(n,{n})" for n in indices)
    run([FFMPEG, "-v", "error", "-nostdin", "-n", "-i", path, "-map", "0:v:0", "-an", "-vf", "select='" + selection + "'",
         "-fps_mode", "vfr", pattern], "temporal-samples:" + tag)
    paths = [SCRATCH / (PREFIX + tag + ("_%02d.png" % (i + 1))) for i in range(len(indices))]
    images = []
    for target in paths:
        with Image.open(target) as image:
            images.append(image.convert("RGB"))
    return paths, images


def sheet(images: list[Image.Image], indices: list[int], path: Path, title: str) -> None:
    columns, cell_w, cell_h = 2, 640, 394
    result = Image.new("RGB", (columns * cell_w, math.ceil(len(images) / columns) * cell_h), (17, 21, 22))
    draw = ImageDraw.Draw(result)
    font = ImageFont.truetype(str(FONT_PATHS["regular"]), 17)
    for i, image in enumerate(images):
        x, y = (i % columns) * cell_w, (i // columns) * cell_h
        draw.text((x + 10, y + 6), f"{title} | frame {indices[i]} | {indices[i] / FPS:.3f}s", font=font, fill=(217, 239, 135))
        result.paste(image.resize((640, 360), Image.Resampling.LANCZOS), (x, y + 32))
    result.save(path, "JPEG", quality=93)


def temporal_inspection(tag: str) -> dict:
    hero_indices = [0, 42, 84, 126, 167]
    reel_indices = [0, 48, 87, 126, 165, 204, 251]
    hero_paths, hero = sampled_frames(OUTPUT / FILES[2], hero_indices, tag + "_hero")
    reel_paths, reel = sampled_frames(OUTPUT / FILES[3], reel_indices, tag + "_reel")
    hero_sheet = SCRATCH / (PREFIX + tag + "_hero_temporal.jpg")
    reel_sheet = SCRATCH / (PREFIX + tag + "_reel_temporal.jpg")
    sheet(hero, hero_indices, hero_sheet, "Architecture")
    sheet(reel, reel_indices, reel_sheet, "Products")
    difference = lambda a, b: sum(ImageStat.Stat(ImageChops.difference(a, b)).mean) / 3
    movement = difference(hero[0], hero[2])
    seam = difference(hero[0], hero[-1])
    assert movement > 0.3, "Hero is not visibly moving"
    assert seam < 1.5 and seam < movement, "Hero seam exceeds tolerance"
    camera_seam = difference(hero_frame(Image.open(ART).convert("RGB"), 0), hero_frame(Image.open(ART).convert("RGB"), HERO_FRAMES - 1))
    assert camera_seam == 0.0, "Deterministic camera endpoints are not identical"
    return {"hero_sample_frame_indices": hero_indices, "reel_sample_frame_indices": reel_indices,
            "hero_sheet": str(hero_sheet), "reel_sheet": str(reel_sheet),
            "hero_frame_paths": [str(p) for p in hero_paths], "reel_frame_paths": [str(p) for p in reel_paths],
            "hero_actual_encoded_first_to_middle_rgb_mae_0_255": movement,
            "hero_actual_encoded_first_to_last_rgb_mae_0_255": seam,
            "hero_unencoded_first_to_last_rgb_mae_0_255": camera_seam,
            "movement_and_seam_tests_passed": True, "visual_review": "pending-tool-vision"}


def cleanup_owned_run(tag: str, evidence: dict, scratch: Path = SCRATCH) -> dict:
    """Discard only this verified run's reproducible intermediates; retain compact sheets."""
    root = scratch.resolve()
    prefix = PREFIX + tag + "_"
    files = [scratch / (prefix + "primary_scene_" + str(i) + ".nut") for i in range(3)]
    files.append(scratch / (prefix + "primary_poster.png"))
    temporal = evidence.get("temporal_inspection", {})
    files.extend(Path(p) for key in ("hero_frame_paths", "reel_frame_paths") for p in temporal.get(key, []))
    rerun = None
    if "determinism" in evidence:
        files.extend(scratch / (prefix + "rerun_scene_" + str(i) + ".nut") for i in range(3))
        files.append(scratch / (prefix + "rerun_poster.png"))
        rerun = Path(evidence["determinism"]["rerun_directory"])
    # Validate the full plan before removing anything. Unknown entries fail closed.
    for target in files + ([rerun] if rerun else []):
        if target.is_symlink() or target.resolve().parent != root or not target.name.startswith(prefix):
            raise RuntimeError(f"Refusing cleanup outside this owned scratch run: {target}")
    nested = []
    if rerun and rerun.exists():
        names = {p.name for p in rerun.iterdir()}
        if names != set(FILES):
            raise RuntimeError("Unknown entry in deterministic rerun; preserve the entire cleanup plan")
        saved = json.loads((rerun / FILES[5]).read_text(encoding="utf-8"))
        if saved.get("owner") != OWNER:
            raise RuntimeError("Rerun ownership does not match")
        pins = {r["file"]: r["rerun_sha256"] for r in evidence["determinism"]["comparisons"]}
        for name in FILES:
            target = rerun / name
            if target.is_symlink() or not target.is_file() or digest(target) != pins.get(name):
                raise RuntimeError(f"Rerun reference/hash drift: {target}")
            nested.append(target)
    removed_bytes = 0
    removed = []
    for target in files + nested:
        if target.exists():
            removed_bytes += target.stat().st_size
            target.unlink()
            removed.append(target.name)
    if rerun and rerun.exists():
        rerun.rmdir()
    return {"policy": "verified-run-intermediates-only", "removed_files": removed,
            "removed_bytes": removed_bytes, "contact_sheets_retained": True,
            "originals_and_primary_deliverables_preserved": True}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--keep-intermediates", action="store_true", help="Retain this run's intermediates for bounded diagnosis; default cleans verified disposable files")
    modes = parser.add_mutually_exclusive_group()
    modes.add_argument("--self-test", action="store_true", help="Render twice, exercise determinism, verify, and write QA evidence")
    modes.add_argument("--verify", action="store_true", help="Read and verify the existing deliverables without rewriting them")
    args = parser.parse_args()
    started = time.perf_counter()
    if args.verify:
        print(json.dumps(verify(OUTPUT), ensure_ascii=False, indent=2))
        return
    for tool in (FFMPEG, FFPROBE, *FONT_PATHS.values()):
        if not tool.is_file():
            raise RuntimeError(f"Required existing local tool/font not found: {tool}")
    SCRATCH.mkdir(parents=True, exist_ok=True)
    sources = source_inventory()
    versions = {"python": sys.version.split()[0], "pillow": PILLOW_VERSION,
                "ffmpeg": run([FFMPEG, "-version"], "ffmpeg-version").splitlines()[0],
                "ffprobe": run([FFPROBE, "-version"], "ffprobe-version").splitlines()[0],
                "native_fonts": [{"file": p.name, "sha256": digest(p)} for p in FONT_PATHS.values()]}
    # A time-based scratch suffix is not part of asset bytes or the public manifest.
    tag = str(time.time_ns())
    manifest = render(OUTPUT, tag + "_primary", sources, versions)
    primary_verification = verify(OUTPUT)
    evidence = {"schema_version": 1, "owner": OWNER, "output_directory": str(OUTPUT),
                "source_inventory": sources, "manifest": manifest, "primary_verification": primary_verification,
                "temporal_inspection": temporal_inspection(tag),
                "served_browser_verification": "Not performed: Sage owns the preview and final build gates",
                "production_or_Jean_acceptance": False,
                "fallbacks": {"architecture": FILES[0], "mobile": FILES[1], "product_reel": FILES[4], "film_render_failed": False}}
    if args.self_test:
        rerun = SCRATCH / (PREFIX + tag + "_determinism")
        second_manifest = render(rerun, tag + "_rerun", sources, versions)
        secondary_verification = verify(rerun)
        comparisons = [{"file": name, "first_sha256": digest(OUTPUT / name), "rerun_sha256": digest(rerun / name),
                        "byte_identical": (OUTPUT / name).read_bytes() == (rerun / name).read_bytes()} for name in FILES]
        assert manifest == second_manifest
        assert all(item["byte_identical"] for item in comparisons), "Determinism check failed"
        evidence["determinism"] = {"passed": True, "rerun_directory": str(rerun), "comparisons": comparisons,
                                   "secondary_verification": secondary_verification}
        # Mutation test only a copy of the in-memory manifest; never alter assets.
        mutated = json.loads(json.dumps(manifest))
        mutated["assets"][0]["bytes"] += 1
        actual = asset_info(OUTPUT / FILES[0], mutated["assets"][0]["source_ids"], mutated["assets"][0]["kind"], 400_000)
        assert actual != mutated["assets"][0]
        evidence["manifest_test"] = {"passed": True, "correct_manifest_matches_actual_files": True,
                                     "incorrect_in_memory_byte_count_detected": True, "required_asset_count": 5}
    evidence["sources_after_all_execution"] = source_inventory()
    assert sources == evidence["sources_after_all_execution"]
    evidence["commands"] = COMMANDS
    evidence["retention"] = ({"policy": "explicit-bounded-diagnostic-retention", "contact_sheets_retained": True}
                             if args.keep_intermediates else cleanup_owned_run(tag, evidence))
    evidence["elapsed_seconds"] = round(time.perf_counter() - started, 3)
    if args.self_test:
        write_json(QA, evidence)
    print(json.dumps({"status": "verified-local-media", "assets": manifest["assets"],
                      "determinism_passed": evidence.get("determinism", {}).get("passed", False),
                      "qa_evidence": str(QA) if args.self_test else None,
                      "temporal_inspection": evidence["temporal_inspection"],
                      "elapsed_seconds": evidence["elapsed_seconds"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
