import ProtectedRoute from '../../components/ProtectedRoute';
import { useStatsQuery } from '../../hooks/useStatsQuery';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { data, isLoading, error } = useStatsQuery();

  return (
    <ProtectedRoute>
      <div className="p-8 space-y-8">
        <h1 className="text-2xl font-bold mb-4">Дашборд</h1>
        {isLoading && <div>Загрузка...</div>}
        {error && <div className="text-red-500">Ошибка загрузки статистики</div>}
        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card>
                <CardHeader><CardTitle>Всего сообщений</CardTitle></CardHeader>
                <CardContent className="text-2xl font-bold">{data.total_messages}</CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Одобрено</CardTitle></CardHeader>
                <CardContent className="text-2xl font-bold">{data.approved}</CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Отклонено</CardTitle></CardHeader>
                <CardContent className="text-2xl font-bold">{data.declined}</CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Лайков</CardTitle></CardHeader>
                <CardContent className="text-2xl font-bold">{data.likes}</CardContent>
              </Card>
            </div>
            <div className="bg-white dark:bg-muted rounded-lg p-4 shadow mt-8">
              <h2 className="text-lg font-semibold mb-2">Динамика сообщений по дням</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.by_day} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="messages" stroke="#2563eb" name="Сообщения" />
                  <Line type="monotone" dataKey="likes" stroke="#f59e42" name="Лайки" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
} 