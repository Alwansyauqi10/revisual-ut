import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  CheckCircle2,
  FileArchive,
  FileWarning,
  Users,
} from "lucide-react";

import {
  getStudentStatsService,
  type StudentStats,
} from "@/services/studentStatsService";

interface StudentStatsDashboardProps {
  eventId: number;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value);

export default function StudentStatsDashboard({
  eventId,
}: StudentStatsDashboardProps) {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);

        const response = await getStudentStatsService(eventId);

        setStats(response.data);
      } catch (error) {
        console.error(
          "GAGAL MENGAMBIL STUDENT STATS:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (Number.isInteger(eventId) && eventId > 0) {
      loadStats();
    }
  }, [eventId]);

  if (isLoading) {
    return (
      <section className="mt-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-xl bg-white"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <section className="mt-10">
      {/* Main Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={<Users className="h-5 w-5" />}
          value={stats.totalStudents}
          label="Students"
        />

        <StatsCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          value={stats.present}
          label="Present"
        />

        <StatsCard
          icon={<FileWarning className="h-5 w-5" />}
          value={stats.absent}
          label="Absent"
        />

        <StatsCard
          icon={<FileArchive className="h-5 w-5" />}
          value={stats.photos2}
          label="Photos 2/2"
        />
      </div>

      {/* Photo Stats */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <MiniStatsCard
          label="0 photos"
          value={stats.photos0}
        />

        <MiniStatsCard
          label="1 photo"
          value={stats.photos1}
        />

        <MiniStatsCard
          label="2 photos"
          value={stats.photos2}
        />
      </div>
    </section>
  );
}

function StatsCard({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#071A33]/8 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071A33]/5 text-[#071A33]">
          {icon}
        </div>

        <span className="text-3xl font-semibold tracking-tight text-[#071A33]">
          {formatNumber(value)}
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-[#071A33]/55">
        {label}
      </p>
    </div>
  );
}

function MiniStatsCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-[#071A33]/8 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#071A33]/55">
          {label}
        </span>

        <span className="text-lg font-semibold text-[#071A33]">
          {formatNumber(value)}
        </span>
      </div>
    </div>
  );
}