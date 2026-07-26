"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTopicById, ML_TOPICS } from "@/lib/topics";
import { Mic, ArrowRight, Zap, Target, Brain } from "lucide-react";
import Link from "next/link";

export default function InterviewPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-wider">
            Interview Mode
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm uppercase tracking-widest">
            AI tests your true understanding — no memorization allowed
          </p>
        </div>

        {/* How it works */}
        <div className="border-2 border-[#a855f7] bg-[#a855f7]/5 backdrop-blur-xl p-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-4 text-[#a855f7]">
            How It Works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { step: "01", title: "AI Asks", desc: "6 open-ended questions, progressive difficulty", icon: Mic },
              { step: "02", title: "You Answer", desc: "Type your explanation — test real understanding", icon: Brain },
              { step: "03", title: "AI Scores", desc: "Accuracy, depth, clarity — must pass to master", icon: Target },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <span className="text-2xl font-black text-[#a855f7]">{item.step}</span>
                <div>
                  <h3 className="font-bold uppercase tracking-wider text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Select topic */}
        <h2 className="text-xl font-bold uppercase tracking-wider">Select Topic</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ML_TOPICS.map((topic) => (
            <Link key={topic.id} href={`/interview/${topic.id}`}>
              <Card className="group border-2 border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-[#a855f7]/50 hover:shadow-[6px_6px_0px_0px] hover:shadow-[#a855f7]/20 cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold uppercase tracking-wider">{topic.title}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[#a855f7] transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground">{topic.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {topic.subtopics.slice(0, 3).map((st) => (
                      <span key={st} className="text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 border border-white/10 text-muted-foreground">
                        {st}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
