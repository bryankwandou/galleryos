"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BrainCircuit, Check, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";
import type { StudioImage, VisionCullResult } from "@/lib/types";

async function measurePixels(imageUrl: string) {
  const response = await fetch(`/api/image-proxy?url=${encodeURIComponent(imageUrl)}`);
  if (!response.ok) throw new Error("Unable to load image pixels for analysis");
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  const originalWidth = bitmap.width;
  const originalHeight = bitmap.height;
  const width = Math.min(320, bitmap.width);
  const height = Math.max(1, Math.round(bitmap.height * (width / bitmap.width)));
  const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas analysis is unavailable");
  context.drawImage(bitmap, 0, 0, width, height); bitmap.close();
  const data = context.getImageData(0, 0, width, height).data;
  const luminance = new Float32Array(width * height); let sum = 0; let dark = 0; let bright = 0;
  for (let index = 0, pixel = 0; index < data.length; index += 4, pixel++) { const value = .2126 * data[index] + .7152 * data[index + 1] + .0722 * data[index + 2]; luminance[pixel] = value; sum += value; if (value < 5) dark++; if (value > 250) bright++; }
  let laplacianSum = 0; let laplacianSquared = 0; let samples = 0;
  for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) { const pixel = y * width + x; const value = 4 * luminance[pixel] - luminance[pixel - 1] - luminance[pixel + 1] - luminance[pixel - width] - luminance[pixel + width]; laplacianSum += value; laplacianSquared += value * value; samples++; }
  const laplacianMean = laplacianSum / samples;
  return { width: originalWidth, height: originalHeight, meanLuminance: sum / luminance.length, darkClippingRatio: dark / luminance.length, brightClippingRatio: bright / luminance.length, sharpnessVariance: laplacianSquared / samples - laplacianMean * laplacianMean };
}

export function AiCullAgent({ images, onApply }: { images: StudioImage[]; onApply: (id: string, result: VisionCullResult) => void }) {
  const [selectedId, setSelectedId] = useState(images[0]?.id ?? "");
  const [result, setResult] = useState<VisionCullResult | null>(null);
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const selected = images.find((image) => image.id === selectedId) ?? images[0];

  async function analyze() {
    setState("working"); setError(""); setResult(null);
    try {
      const metrics = await measurePixels(selected.url);
      const response = await fetch("/api/ai/cull", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ metrics, filename: selected.name, photographerNote: "Wedding documentary frame; preserve meaningful moments when uncertain." }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Analysis failed");
      setResult(payload); setState("done");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Analysis failed"); setState("error"); }
  }

  return <motion.section className="agent-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
    <div className="agent-title"><div><BrainCircuit /><span><b>Technical cull agent</b><small>Real browser pixel metrics + Groq reasoning</small></span></div><i>Human approval required</i></div>
      <div className="agent-body"><div className="agent-picker"><label>Frame to inspect<select value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setResult(null); setState("idle"); }}>{images.map((image) => <option value={image.id} key={image.id}>{image.name}</option>)}</select></label><div className="agent-thumb" style={{ backgroundImage: `url(${selected.url})` }} /><button onClick={analyze} disabled={state === "working"}>{state === "working" ? <><LoaderCircle className="spin" /> Measuring pixels</> : <><Sparkles /> Run real analysis</>}</button></div><div className="agent-result">{state === "idle" && <div className="agent-empty"><BrainCircuit /><p>GalleryOS measures actual sharpness, luminance, and clipping, then asks Groq for a conservative technical recommendation.</p></div>}{state === "working" && <div className="agent-empty"><LoaderCircle className="spin" /><p>Measuring real pixels and running grounded model reasoning…</p></div>}{state === "error" && <div className="agent-empty error"><RotateCcw /><p>{error}</p></div>}{result && <div className="analysis-result"><div><span className={`flag ${result.decision}`}>{result.decision}</span><b>{Math.round(result.confidence * 100)}% confidence</b></div><h3>{result.visibleReason}</h3><ul>{result.technicalNotes.map((note) => <li key={note}>{note}</li>)}</ul><small>{result.model} · {result.requestId.slice(0, 18)}</small><button onClick={() => onApply(selected.id, result)}><Check /> Apply as suggestion</button></div>}</div></div>
  </motion.section>;
}
