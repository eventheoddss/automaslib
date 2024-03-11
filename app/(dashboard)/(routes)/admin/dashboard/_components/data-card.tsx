import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataCardProps {
  value: number;
  label: string;
}

export const DataCard = ({ value, label }: DataCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
