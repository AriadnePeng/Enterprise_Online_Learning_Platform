import { LoaderCircle, SearchX } from 'lucide-react';

export function TableState({ loading, empty, colSpan }: { loading: boolean; empty: boolean; colSpan: number }) {
  if (!loading && !empty) return null;
  return (
    <tr>
      <td colSpan={colSpan} className="h-52 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
          {loading ? <LoaderCircle className="h-7 w-7 animate-spin text-blue-500" /> : <SearchX className="h-8 w-8" />}
          <p className="text-sm">{loading ? '正在加载数据...' : '没有找到符合条件的数据'}</p>
        </div>
      </td>
    </tr>
  );
}

