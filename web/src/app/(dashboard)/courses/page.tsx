import { DashboardShell } from "@/components/dashboard-shell";
import { TopicCard } from "@/components/topic-card";
import { ML_TOPICS } from "@/lib/topics";

export default function CoursesPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-wider">
            Learning Paths
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm uppercase tracking-widest">
            Select a topic to start your journey
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ML_TOPICS.map((topic) => (
            <TopicCard key={topic.id} {...topic} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
