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

  const activeIndex = useMemo(
    () => topics.findIndex((t) => t.id === activeTopicId),
    [activeTopicId, topics]
  );

  const activeTopic = topics[activeIndex >= 0 ? activeIndex : 0];

  if (!activeTopic) return null;

  const prevTopic = activeIndex > 0 ? topics[activeIndex - 1] : null;
  const nextTopic = activeIndex < topics.length - 1 ? topics[activeIndex + 1] : null;
  const progressPercent = Math.round(((activeIndex + 1) / topics.length) * 100);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header Banner */}
      <div className="mb-8 md:mb-10 bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 px-4 py-1 text-xs font-bold uppercase tracking-wider">
            <span>⚡ {level}</span>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            {totalDuration}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">{title}</h1>
        
        {/* Overall Track Progress Bar */}
        <div className="max-w-md">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-1.5">
            <span>Module {activeIndex + 1} of {topics.length}</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Sidebar Topic List */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-4 sticky top-24">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
              Course Outline ({topics.length})
            </h2>
            <div className="space-y-2">
              {topics.map((topic, index) => {
                const isActive = activeTopic.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setActiveTopicId(topic.id)}
                    className={`w-full text-left rounded-xl border p-3.5 transition-all group ${
                      isActive
                        ? "border-blue-500 bg-blue-50/80 shadow-sm"
                        : "border-slate-200/80 hover:border-blue-200 hover:bg-slate-50/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? "text-blue-700" : "text-slate-400"}`}>
                        Topic 0{index + 1}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {topic.duration}
                      </span>
                    </div>
                    <p className={`font-bold text-sm leading-snug ${isActive ? "text-blue-950" : "text-slate-700 group-hover:text-slate-900"}`}>
                      {topic.title}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-8 xl:col-span-9">
          <article className="bg-white border border-slate-200/80 rounded-3xl shadow-sm p-6 md:p-12 mb-8">
            <header className="border-b border-slate-100 pb-6 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                  Topic {activeIndex + 1} of {topics.length}
                </span>
                <span className="text-xs text-slate-400 font-medium">⏱️ {activeTopic.duration} read</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4">{activeTopic.title}</h2>
              {activeTopic.summary && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-slate-700 font-medium text-sm md:text-base leading-relaxed">
                  💡 {activeTopic.summary}
                </div>
              )}
            </header>

            <div
              className="max-w-none text-slate-700
              [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-8 [&_h3]:mb-3
              [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-blue-700 [&_h4]:mt-6 [&_h4]:mb-2
              [&_p]:leading-8 [&_p]:my-4 [&_p]:text-base [&_p]:md:text-lg
              [&_ul]:my-5 [&_ul]:pl-6 [&_ul]:space-y-2.5 [&_ul]:list-disc
              [&_ol]:my-5 [&_ol]:pl-6 [&_ol]:space-y-2.5 [&_ol]:list-decimal
              [&_li]:leading-8 [&_li::marker]:text-blue-600
              [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-600 [&_blockquote]:bg-blue-50/60 [&_blockquote]:text-slate-800 [&_blockquote]:italic [&_blockquote]:p-5 [&_blockquote]:rounded-r-2xl
              [&_code]:font-mono [&_code]:text-rose-600 [&_code]:bg-slate-100 [&_code]:rounded-md [&_code]:px-2 [&_code]:py-0.5 [&_code]:text-sm
              [&_pre]:my-6 [&_pre]:p-6 [&_pre]:rounded-2xl [&_pre]:bg-slate-950 [&_pre]:text-slate-100 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-slate-800 [&_pre]:shadow-md
              [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0"
              dangerouslySetInnerHTML={{ __html: activeTopic.content }}
            />

            {/* Bottom Topic Navigation Buttons */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
              {prevTopic ? (
                <button
                  type="button"
                  onClick={() => setActiveTopicId(prevTopic.id)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <span>← Previous:</span>
                  <span className="font-bold">{prevTopic.title}</span>
                </button>
              ) : <div />}

              {nextTopic ? (
                <button
                  type="button"
                  onClick={() => setActiveTopicId(nextTopic.id)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
                >
                  <span>Next:</span>
                  <span className="font-bold">{nextTopic.title}</span>
                  <span>→</span>
                </button>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <span>🎉</span>
                  <span>You finished this tutorial track!</span>
                </div>
              )}
            </div>
          </article>
        </main>
      </div>
    </section>
  );
}
