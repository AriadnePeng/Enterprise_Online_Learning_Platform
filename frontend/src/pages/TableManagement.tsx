import { useState } from 'react';
import { tables } from '@/data/databaseObjects';
import {
  Database,
  Key,
  Link2,
  Search,
  Table2,
  ChevronRight,
  Hash,
  FileText
} from 'lucide-react';

export default function TableManagement() {
  const [selectedTable, setSelectedTable] = useState(tables[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTables = tables.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nameCn.includes(searchTerm)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="db-page-header">
        <h1 className="db-page-title">数据表管理</h1>
        <p className="db-page-desc">
          共 {tables.length} 张核心数据表，涵盖用户、课程、考试、培训任务等业务实体
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List */}
        <div className="lg:col-span-1 db-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索表名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent"
            />
          </div>
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {filteredTables.map((table) => (
              <button
                key={table.id}
                onClick={() => setSelectedTable(table)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  selectedTable.id === table.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Database className={`w-4 h-4 flex-shrink-0 ${
                  selectedTable.id === table.id ? 'text-blue-500' : 'text-slate-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    selectedTable.id === table.id ? 'text-blue-700' : 'text-slate-700'
                  }`}>
                    {table.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{table.nameCn}</p>
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 ${
                  selectedTable.id === table.id ? 'text-blue-400' : 'text-slate-300'
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Table Detail */}
        <div className="lg:col-span-2 space-y-4">
          {/* Table Info Card */}
          <div className="db-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Table2 className="w-5 h-5 text-blue-500" />
                  {selectedTable.name}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedTable.nameCn} — {selectedTable.description}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  {selectedTable.fields.length} 个字段
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                  {selectedTable.recordCount} 条记录
                </span>
              </div>
            </div>

            {/* Related Tables */}
            {selectedTable.relatedTables.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500">关联表:</span>
                {selectedTable.relatedTables.map((rt) => (
                  <span key={rt} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                    {rt}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Fields Table */}
          <div className="db-card p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              字段定义
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">字段名</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">类型</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-600">主键</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-600">外键</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-600">可空</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">默认值</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">说明</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTable.fields.map((field) => (
                    <tr key={field.name} className="border-b border-slate-100 db-table-row">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Hash className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono text-slate-800">{field.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                          {field.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {field.isPrimary ? (
                          <Key className="w-4 h-4 text-amber-500 mx-auto" />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {field.isForeign ? (
                          <Link2 className="w-4 h-4 text-blue-500 mx-auto" />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {field.isNullable ? (
                          <span className="text-xs text-slate-400">YES</span>
                        ) : (
                          <span className="text-xs font-semibold text-rose-500">NO</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {field.default ? (
                          <span className="text-xs text-slate-500">{field.default}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{field.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ER Hint */}
          <div className="db-card p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">表关系说明</h3>
            <div className="flex items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                <span className="text-slate-600">主键 (Primary Key)</span>
              </div>
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-blue-500" />
                <span className="text-slate-600">外键 (Foreign Key)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-rose-500">NO</span>
                <span className="text-slate-600">非空约束 (NOT NULL)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
