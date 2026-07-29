import { ClientGallery } from "@/components/client-gallery";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return { title: token === "harper-chen" ? "Harper & Chen" : "Gallery not found" };
}

export default async function GalleryPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (token !== "harper-chen") notFound();
  return <ClientGallery />;
}
