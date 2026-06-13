import { useNavigate } from 'react-router-dom';
import {
  Database,
  Eye,
  Cog,
  Zap,
  ArrowRight,
  Table2,
  Key,
  Link2,
  BarChart3,
  Layers,
  FileCode,
  Activity
} from 'lucide-react';
import { dbStats } from '@/data/databaseObjects';

const statsCards = [
  {
    title: '数据表',
    count: dbStats.totalTables,
    icon: Database,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    desc: '核心业务实体表',
    path: '/tables',
  },
  {
    title: '视图',
    count: dbStats.totalViews,
    icon: Eye,
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    desc: '数据查询与统计视图',
    path: '/views',
  },
  {
    title: '存储过程',
    count: dbStats.totalProcedures,
    icon: Cog,
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200',
    desc: '业务逻辑封装',
    path: '/procedures',
  },
  {
    title: '触发器',
    count: dbStats.totalTriggers,
    icon: Zap,
    color: 'bg-rose-500',
    lightColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    borderColor: 'border-rose-200',
    desc: '自动化业务规则',
    path: '/triggers',
  },
];

const highlights = [
  {
    icon: Table2,
    title: '16张核心业务表',
    desc: '涵盖用户、课程、考试、培训任务、学习进度等完整业务实体',
    color: 'text-blue-500',
  },
  {
    icon: Key,
    title: '完整的索引设计',
    desc: '聚集索引+非聚集索引，覆盖高频查询场景，经EXPLAIN验证',
    color: 'text-violet-500',
  },
  {
    icon: Link2,
    title: '三级完整性约束',
    desc: '实体完整性、参照完整性（级联/拒绝/置空）、用户自定义完整性',
    color: 'text-teal-500',
  },
  {
    icon: BarChart3,
    title: '10个统计分析视图',
    desc: '任务进度、异常检测、成绩汇总、员工行为分析等多维度统计',
    color: 'text-emerald-500',
  },
  {
    icon: Layers,
    title: '10个业务存储过程',
    desc: '批量任务派发、自动交卷、报表导出、数据归档等核心业务流程',
    color: 'text-amber-500',
  },
  {
    icon: Activity,
    title: '10个自动化触发器',
    desc: '打卡联动、防作弊检测、角色拦截、状态联动等自动化规则',
    color: 'text-rose-500',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="db-page-header">
        <h1 className="db-page-title">数据库全景概览</h1>
        <p className="db-page-desc">
          企业在线学习平台数据库设计成果展示 — 共 {dbStats.totalObjects} 个数据库对象
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className={`${card.lightColor} ${card.borderColor} border rounded-xl p-5 cursor-pointer hover:shadow-md transition-all group`}
            >
              <div className="flex items-start justify-between">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className={`w-5 h-5 ${card.textColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-slate-800">{card.count}</p>
                <p className={`text-sm font-semibold ${card.textColor} mt-1`}>{card.title}</p>
                <p className="text-xs text-slate-500 mt-1">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Summary */}
        <div className="lg:col-span-2 db-card p-6">
          <h2 className="db-section-title mb-4">
            <FileCode className="w-5 h-5 text-blue-500" />
            设计亮点
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                  <div className={`${item.color} mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Stats */}
        <div className="db-card p-6">
          <h2 className="db-section-title mb-4">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            数据统计
          </h2>
          <div className="space-y-4">
            {[
              { label: '数据表总数', value: dbStats.totalTables, unit: '张' },
              { label: '视图总数', value: dbStats.totalViews, unit: '个' },
              { label: '存储过程', value: dbStats.totalProcedures, unit: '个' },
              { label: '触发器', value: dbStats.totalTriggers, unit: '个' },
              { label: '字段总数', value: dbStats.totalFields, unit: '个' },
              { label: '索引数量', value: dbStats.totalIndexes, unit: '个' },
              { label: '表间关系', value: dbStats.totalRelations, unit: '对' },
              { label: '数据库对象总计', value: dbStats.totalObjects, unit: '个' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-600">{stat.label}</span>
                <span className="text-sm font-bold text-slate-800">
                  {stat.value} <span className="text-xs font-normal text-slate-400">{stat.unit}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module Map */}
      <div className="db-card p-6">
        <h2 className="db-section-title mb-4">
          <Layers className="w-5 h-5 text-blue-500" />
          功能模块与数据库对象映射
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              module: '用户与个人中心',
              tables: ['user_info', 'lecturer', 'administrator', 'learning_note', 'sys_role_audit_log'],
              views: ['v_user_safe', 'v_lecturer_student_notes'],
              procedures: ['sp_emp_update_note', 'sp_admin_get_all_notes'],
              triggers: ['tri_user_role_check', 'tri_admin_role_check'],
              color: 'blue',
            },
            {
              module: '课程管理',
              tables: ['course_category', 'course', 'course_chapter', 'learning_resource'],
              views: ['view_course_category_stats', 'v_course_list_extended'],
              procedures: ['sp_course_offline'],
              triggers: ['trg_course_status_change', 'trg_chapter_insert'],
              color: 'emerald',
            },
            {
              module: '培训任务与学习',
              tables: ['training_task', 'learning_progress', 'task_scope', 'learning_checkin'],
              views: ['v_task_progress_overview', 'v_delay_user_warning'],
              procedures: ['sp_batch_assign_task', 'sp_update_task_time', 'sp_learning_checkin'],
              triggers: ['trg_update_progress_after_checkin', 'trg_prevent_cheating_checkin'],
              color: 'amber',
            },
            {
              module: '考试中心',
              tables: ['exam', 'exam_question', 'answer_sheet', 'exam_score'],
              views: ['vw_exam_score_summary', 'vw_answer_sheet_detail'],
              procedures: ['auto_submit_exam', 'exam_pass_rate'],
              triggers: ['trg_prevent_answer_update', 'trg_exam_score_review_time'],
              color: 'rose',
            },
            {
              module: '统计分析',
              tables: ['user_info', 'learning_progress', 'exam_score', 'learning_checkin', 'monthly_stats_archive'],
              views: ['v_全体学员学习考试统计', 'v_employee_anomaly_behavior'],
              procedures: ['sp_export_anomaly_employees', 'sp_archive_monthly_stats'],
              triggers: ['trg_exam_score_after_insert', 'trg_learning_progress_after_update'],
              color: 'violet',
            },
          ].map((mod) => (
            <div key={mod.module} className={`bg-${mod.color}-50 border border-${mod.color}-200 rounded-lg p-4`}>
              <h3 className={`text-sm font-bold text-${mod.color}-800 mb-3`}>{mod.module}</h3>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {mod.tables.map((t) => (
                    <span key={t} className="db-badge-table">{t}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {mod.views.map((v) => (
                    <span key={v} className="db-badge-view">{v}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {mod.procedures.map((p) => (
                    <span key={p} className="db-badge-procedure">{p}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {mod.triggers.map((t) => (
                    <span key={t} className="db-badge-trigger">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
