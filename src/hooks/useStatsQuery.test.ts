import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStatsQuery } from './useStatsQuery';

const queryClient = new QueryClient();

describe('useStatsQuery', () => {
  it('fetches stats data', async () => {
    // Здесь можно замокать fetch через msw или jest
    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result, waitFor } = renderHook(() => useStatsQuery(), { wrapper });
    await waitFor(() => result.current.isSuccess || result.current.isError);
    // Проверить результат
    // expect(result.current.data).toBeDefined();
  });
}); 