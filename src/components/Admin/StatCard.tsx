interface StatCardProps {
    value: string | number;
    label: string;
    bgColor?: string;
}

export default function StatCard({ value, label, bgColor = "bg-gray-50" }: StatCardProps) {
    return (
        <div className={`${bgColor} rounded-lg border border-gray-200 p-6 text-center`}>
            <div className="mb-2 text-3xl font-bold text-blue-600">{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
        </div>
    );
}
