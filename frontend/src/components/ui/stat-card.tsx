interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
}

export default function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
      <div className="bg-gray-100 p-2 rounded">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
