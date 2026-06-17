import { useState } from 'react';
import { views } from '@/data/databaseObjects';
import {
  Eye,
  Code2,
  Play,
  Table2,
  CheckCircle,
  AlertCircle,
  Database,
  Layers
} from 'lucide-react';
import { api } from '@/services/api';

export default function ViewCenter() {
  const [selectedView, setSelectedView] = useState(views[0]);
  const [viewData, setViewData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [executedViews, setExecutedViews] = useState<Set<string>>(new Set());

  const executeView = async (view: typeof views[0]) => {
    setLoading(true);
    setError('');
    try {
      const methodMap: Record<string, () => Promise<any[]>> = {
        'v_task_progress_overview': api.view.getTaskProgress,
        'v_delay_user_warning': api.view.getDelayWarnings,
        'vw_exam_score_summary': api.view.getExamScoreSummary,
        'vw_answer_sheet_detail': api.view.getAnswerSheets,
        'v_全体学员学习考试统计': api.view.getLearningExamStats,
        'v_employee_anomaly_behavior': api.view.getEmployeeAnomalies,
        'v_user_safe': api.view.getSafeUsers,
        'v_lecturer_student_notes': api.view.getLecturerNotes,
        'view_course_category_stats': api.view.getCourseCategoryStats,
        'v_course_list_extended': api.view.getCourseListExtended,
      };

      const method = methodMap[view.name];
      if (method) {
        const data = await method();
        setViewData(data || []);
        setExecutedViews((prev) => new Set(prev).add(view.name));
      } else {
        // Mock data for demonstration
        setViewData(generateMockData(view));
        setExecutedViews((prev) => new Set(prev).add(view.name));
      }
    } catch (err: any) {
      setError(err.message || '查询失败');
      setViewData(generateMockData(view));
      setExecutedViews((prev) => new Set(prev).add(view.name));
    } finally {
      setLoading(false);
    }
  };

  // Generate mock data for views
  const generateMockData = (view: typeof views[0]) => {
    const mockDataMap: Record<string, any[]> = {
      'v_task_progress_overview': [
        { '任务编号': 'T001', '任务名称': '网络安全合规必备意识培训', '要求学时(小时)': 24, '参与总人数': 5, '已完成人数': 3, '任务完成率(%)': 60 },
        { '任务编号': 'T002', '任务名称': '高效产品设计规范', '要求学时(小时)': 12.5, '参与总人数': 3, '已完成人数': 2, '任务完成率(%)': 66.67 },
        { '任务编号': 'T003', '任务名称': '前端现代框架工程化实战', '要求学时(小时)': 48, '参与总人数': 4, '已完成人数': 1, '任务完成率(%)': 25 },
      ],
      'v_delay_user_warning': [
        { '进度精简码': 'P006', '学员编号': 'U006', '学员姓名': '贾向东', '当前岗位': '运维工程师', '高危未动工任务': 'Linux内核安全运维基线', '已学时长(分钟)': 0, '任务下发时间': '2026-05-01' },
        { '进度精简码': 'P010', '学员编号': 'U002', '学员姓名': '刘诗晨', '当前岗位': '合规专员', '高危未动工任务': '企业数字资产保护合规审计', '已学时长(分钟)': 0, '任务下发时间': '2026-05-01' },
      ],
      'vw_exam_score_summary': [
        { score_id: 1, user_id: 'U001', username: '李勇', position: '安全工程师', exam_id: 1, exam_name: '2026季度网络安全合规闭卷测评', final_score: 95.00, pass_result: '及格', review_time: '2026-06-15 14:00:00', reviewer_name: '向管理员' },
        { score_id: 2, user_id: 'U002', username: '刘诗晨', position: '合规专员', exam_id: 1, exam_name: '2026季度网络安全合规闭卷测评', final_score: 90.00, pass_result: '及格', review_time: '2026-06-15 14:05:00', reviewer_name: '向管理员' },
        { score_id: 7, user_id: 'U007', username: '陈宝玉', position: 'UI设计师', exam_id: 2, exam_name: '产品经理核心交互设计能力认证', final_score: 65.00, pass_result: '不及格', review_time: '2026-06-16 19:15:00', reviewer_name: '向管理员' },
      ],
      'v_user_safe': [
        { user_id: 'U001', username: '李勇', user_pwd: '******', contact: '135****2222', '岗位': '安全工程师' },
        { user_id: 'U002', username: '刘诗晨', user_pwd: '******', contact: '135****3333', '岗位': '合规专员' },
        { user_id: 'U003', username: '王一鸣', user_pwd: '******', contact: '135****4444', '岗位': 'Java开发' },
      ],
      'v_全体学员学习考试统计': [
        { '学员总数': 10, '活跃学习人数': 8, '学习活跃率': 80.00, '完成任务人数': 5, '总学习记录数': 10, '人均学习时长分钟': 127, '总考试人次': 10, '及格人次': 8, '考试及格率': 80.00, '全体平均分': 83.7, '综合评级': '优秀', '统计时间': '2026-06-13 10:00:00' },
      ],
      'v_employee_anomaly_behavior': [
        { user_id: 'U006', username: '贾向东', '所属部门': '运维工程师', '参与任务数': 1, '总学习时长_小时': 0, '学习天数': 0, '最近学习日期': null, '距最近学习天数': null, '参加考试数': 0, '平均成绩': 0, '最低分': 0, '最高分': 0, '打卡次数': 0, '异常标签': '从未学习', '风险等级': '高危', '统计时间': '2026-06-13 10:00:00' },
        { user_id: 'U007', username: '陈宝玉', '所属部门': 'UI设计师', '参与任务数': 2, '总学习时长_小时': 0.25, '学习天数': 1, '最近学习日期': '2026-05-01', '距最近学习天数': 43, '参加考试数': 1, '平均成绩': 65, '最低分': 65, '最高分': 65, '打卡次数': 1, '异常标签': '休眠学员', '风险等级': '中危', '统计时间': '2026-06-13 10:00:00' },
      ],
    };
    return mockDataMap[view.name] || [
      { message: '该视图需要连接后端数据库获取真实数据' },
    ];
  };

  const isExecuted = executedViews.has(selectedView.name);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="db-page-header">
        <h1 className="db-page-title">视图展示中心</h1>
        <p className="db-page-desc">
          共 {views.length} 个数据库视图 — 展示统计查询、数据脱敏、异常检测等多维度视图
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* View List */}
        <div className="lg:col-span-1 db-card p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-500" />
            视图列表
          </h3>
          <div className="space-y-1 max-h-[700px] overflow-y-auto">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => {
                  setSelectedView(view);
                  setViewData([]);
                  setError('');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  selectedView.id === view.id
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Eye className={`w-4 h-4 flex-shrink-0 ${
                  selectedView.id === view.id ? 'text-emerald-500' : 'text-slate-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    selectedView.id === view.id ? 'text-emerald-700' : 'text-slate-700'
                  }`}>
                    {view.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{view.nameCn}</p>
                </div>
                {executedViews.has(view.name) && (
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* View Detail */}
        <div className="lg:col-span-2 space-y-4">
          {/* View Info */}
          <div className="db-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-500" />
                  {selectedView.name}
                </h2>
                <p className="text-sm text-slate-500 mt-1">{selectedView.nameCn}</p>
                <p className="text-sm text-slate-600 mt-2">{selectedView.description}</p>
              </div>
              <button
                onClick={() => executeView(selectedView)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 text-sm font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                {loading ? '执行中...' : '执行查询'}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Database className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">关联表:</span>
              {selectedView.relatedTables.map((t) => (
                <span key={t} className="db-badge-table">{t}</span>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">输出列:</span>
              {selectedView.columns.map((c) => (
                <span key={c} className="db-badge-view">{c}</span>
              ))}
            </div>
          </div>

          {/* SQL Code */}
          <div className="db-card p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-violet-500" />
              SQL 定义
            </h3>
            <pre className="db-code-block text-xs leading-relaxed overflow-x-auto">
              <code>{selectedView.sql}</code>
            </pre>
          </div>

          {/* API Endpoint */}
          <div className="db-card p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">后端接口</h3>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">GET</span>
              <code className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded">{selectedView.endpoint}</code>
            </div>
          </div>

          {/* Query Results */}
          {isExecuted && (
            <div className="db-card p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Table2 className="w-4 h-4 text-blue-500" />
                查询结果
                <span className="text-xs font-normal text-slate-400">({viewData.length} 行)</span>
              </h3>
              {error && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg text-sm mb-3">
                  <AlertCircle className="w-4 h-4" />
                  {error}（显示模拟数据）
                </div>
              )}
              {viewData.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {Object.keys(viewData[0]).map((key) => (
                          <th key={key} className="text-left py-2.5 px-3 font-semibold text-slate-600 text-xs">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {viewData.map((row, idx) => (
                        <tr key={idx} className="border-b border-slate-100 db-table-row">
                          {Object.values(row).map((val: any, i) => (
                            <td key={i} className="py-2.5 px-3 text-slate-700 text-xs">
                              {val === null ? (
                                <span className="text-slate-300 italic">NULL</span>
                              ) : typeof val === 'number' ? (
                                <span className="font-mono">{val}</span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
