'use client';

import { useMemo, useState } from "react";
import type { TutorialTopic } from "@/types/tutorial";

interface TutorialViewerProps {
  title: string;
  level: string;
  totalDuration: string;
  topics: TutorialTopic[];
}

export default function TutorialViewer({ title, level, totalDuration, topics }: TutorialViewerProps) {
  const [activeTopicId, setActiveTopicId] = useState(topics[0]?.id ?? "");

  const activeTopic = useMemo(
    () => topics.find((topic) => topic.id === activeTopicId) ?? topics[0],
    [activeTopicId, topics]
  );

  if (!activeTopic) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8 md:mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-sm font-semibold mb-4">
          {level}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">{title}</h1>
        <p className="text-slate-600 text-lg">Complete duration: {totalDuration}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Topics</h2>
            <div className="space-y-2">
              {topics.map((topic, index) => {
                const isActive = activeTopic.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setActiveTopicId(topic.id)}
                    className={`w-full text-left rounded-xl border px-4 py-3 transition ${
                      isActive
                        ? "border-blue-300 bg-blue-50 shadow-sm"
                        : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <p className={`text-xs font-semibold mb-1 ${isActive ? "text-blue-700" : "text-slate-500"}`}>
                      Topic {index + 1}
                    </p>
                    <p className={`font-semibold leading-6 ${isActive ? "text-slate-900" : "text-slate-700"}`}>
                      {topic.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{topic.duration}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="lg:col-span-8 xl:col-span-9">
          <article className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 md:p-10">
            <header className="border-b border-slate-200 pb-5 mb-6">
              <p className="text-sm font-semibold text-blue-700 mb-2">{activeTopic.duration}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{activeTopic.title}</h2>
              <p className="text-slate-600 leading-7">{activeTopic.summary}</p>
            </header>

            <div
              className="max-w-none text-slate-700
              [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:leading-8 [&_p]:my-4
              [&_ul]:my-5 [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:list-disc
              [&_ol]:my-5 [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:list-decimal
              [&_li]:leading-8 [&_li::marker]:text-blue-600
              [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-600 [&_blockquote]:bg-blue-50/70 [&_blockquote]:text-slate-700 [&_blockquote]:italic [&_blockquote]:px-4 [&_blockquote]:py-3
              [&_code]:font-mono [&_code]:text-rose-700 [&_code]:bg-slate-100 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5"
              dangerouslySetInnerHTML={{ __html: activeTopic.content }}
            />
          </article>
        </main>
      </div>
    </section>
  );
}
