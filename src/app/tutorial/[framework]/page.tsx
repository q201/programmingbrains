import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import TutorialViewer from "@/components/tutorial/TutorialViewer";
import type { TutorialTrack } from "@/types/tutorial";

interface TutorialFrameworkPageProps {
  params: Promise<{ framework: string }>;
}

async function getBaseUrl() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") || "http";

  if (host) return `${protocol}://${host}`;
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5000";
}

async function fetchTutorialTrack(framework: string): Promise<TutorialTrack | null> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/tutorials/${framework}`, { cache: "no-store" });

  if (!response.ok) return null;

  const data = (await response.json()) as { track: TutorialTrack };
  return data.track;
}

export async function generateMetadata({ params }: TutorialFrameworkPageProps): Promise<Metadata> {
  const { framework } = await params;
  const track = await fetchTutorialTrack(framework);

  if (!track) {
    return {
      title: "Tutorial Not Found | Programming Brains",
    };
  }

  return {
    title: `${track.title} | Programming Brains`,
    description: track.description,
  };
}

export default async function TutorialFrameworkPage({ params }: TutorialFrameworkPageProps) {
  const { framework } = await params;
  const track = await fetchTutorialTrack(framework);

  if (!track) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <TutorialViewer
        title={track.title}
        level={track.level}
        totalDuration={track.totalDuration}
        topics={track.topics}
      />
      <Footer />
    </div>
  );
}
