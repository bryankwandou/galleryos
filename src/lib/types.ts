export type CullFlag = "keep" | "review" | "remove";

export type StudioImage = {
  id: string;
  name: string;
  url: string;
  flag: CullFlag;
  reason: string;
  included: boolean;
};

export type VisionCullResult = {
  decision: CullFlag;
  confidence: number;
  visibleReason: string;
  technicalNotes: string[];
  model: string;
  requestId: string;
  analyzedAt: string;
};

export type Booking = {
  id: string;
  client: string;
  event: string;
  date: string;
  status: "Inquiry" | "Booked" | "Culling" | "Proofing" | "Delivered";
  imageCount: number;
  value: number;
};
