# 考试与试卷管理模块接口说明

本文档对应数据库文档《考试与试卷管理模块_负责部分完整稿.docx》中的视图和存储过程，用于给前端说明后端接口调用方式。

统一响应格式：

```json
{
  "success": true,
  "message": "OK",
  "data": []
}
```

## 1. 考试成绩汇总查询

- 请求方法：`GET`
- 请求路径：`/api/views/exams/score-summary`
- 对应数据库对象：视图 `vw_exam_score_summary`
- 功能说明：查询学员考试成绩汇总信息，包括学员、考试、最终成绩、是否及格、批阅时间和批阅管理员。

### 请求参数

无。

### 响应字段参考

| 字段名 | 说明 |
| --- | --- |
| `score_id` | 成绩编号 |
| `user_id` | 学员编号 |
| `username` | 学员姓名 |
| `position` | 岗位 |
| `exam_id` | 考试编号 |
| `exam_name` | 考试名称 |
| `final_score` | 最终成绩 |
| `pass_result` | 是否及格，值为“及格”或“不及格” |
| `review_time` | 批阅时间 |
| `reviewer_name` | 批阅管理员姓名 |

### 请求示例

```http
GET http://localhost:8080/api/views/exams/score-summary
```

### 响应示例

```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "score_id": 1,
      "user_id": "U001",
      "username": "李勇",
      "position": "安全工程师",
      "exam_id": 1,
      "exam_name": "2026季度网络安全合规闭卷测评",
      "final_score": 95.00,
      "pass_result": "及格",
      "review_time": "2026-06-15T14:00:00",
      "reviewer_name": "向管理员"
    }
  ]
}
```

## 2. 考试答卷详情查询

- 请求方法：`GET`
- 请求路径：`/api/views/exams/answer-sheets`
- 对应数据库对象：视图 `vw_answer_sheet_detail`
- 功能说明：查询学员答卷详情，包括答卷内容、提交时间、批阅状态和批阅管理员。

### 请求参数

无。

### 响应字段参考

| 字段名 | 说明 |
| --- | --- |
| `sheet_id` | 答卷编号 |
| `user_id` | 学员编号 |
| `username` | 学员姓名 |
| `exam_id` | 考试编号 |
| `exam_name` | 考试名称 |
| `answer_content` | 答卷内容 |
| `submit_time` | 提交时间 |
| `review_status_name` | 批阅状态，值为“已批阅”或“未批阅” |
| `reviewer_name` | 批阅管理员姓名 |

### 请求示例

```http
GET http://localhost:8080/api/views/exams/answer-sheets
```

### 响应示例

```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "sheet_id": 1,
      "user_id": "U001",
      "username": "李勇",
      "exam_id": 1,
      "exam_name": "2026季度网络安全合规闭卷测评",
      "answer_content": "我的选择是：C",
      "submit_time": "2026-06-15T09:45:00",
      "review_status_name": "已批阅",
      "reviewer_name": "向管理员"
    }
  ]
}
```

## 3. 自动交卷

- 请求方法：`POST`
- 请求路径：`/api/procedures/exams/auto-submit`
- 对应数据库对象：存储过程 `auto_submit_exam`
- 功能说明：根据考试编号和学员编号自动计算客观题得分，将结果写入 `exam_temp_result`，并将答卷状态更新为已批阅。

### 请求参数

| 参数名 | 位置 | 类型 | 是否必填 | 示例 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `examId` | body | Integer | 是 | `1` | 考试编号 |
| `userId` | body | String | 是 | `"U001"` | 学员编号 |

### 请求示例

```http
POST http://localhost:8080/api/procedures/exams/auto-submit
Content-Type: application/json
```

```json
{
  "examId": 1,
  "userId": "U001"
}
```

### 响应示例

```json
{
  "success": true,
  "message": "自动交卷完成",
  "data": null
}
```

## 4. 考试通过率统计

- 请求方法：`GET`
- 请求路径：`/api/procedures/exams/{examId}/pass-rate`
- 对应数据库对象：存储过程 `exam_pass_rate`
- 功能说明：统计指定考试的参考人数、通过人数和通过率。

### 请求参数

| 参数名 | 位置 | 类型 | 是否必填 | 示例 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `examId` | path | Integer | 是 | `1` | 考试编号 |

### 请求示例

```http
GET http://localhost:8080/api/procedures/exams/1/pass-rate
```

### 响应字段参考

| 字段名 | 说明 |
| --- | --- |
| `exam_id` | 考试编号 |
| `exam_name` | 考试名称 |
| `total_students` | 参考人数 |
| `pass_students` | 通过人数 |
| `pass_rate_percent` | 通过率百分比 |

### 响应示例

```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "exam_id": 1,
      "exam_name": "2026季度网络安全合规闭卷测评",
      "total_students": 2,
      "pass_students": 2,
      "pass_rate_percent": 100.00
    }
  ]
}
```

## 5. 你这部分需要确认的内容

后端接口已经写好，接口名也已经按模板填入。你主要需要确认数据库层是否已经执行下面 4 个对象的创建 SQL：

| 类型 | 数据库对象名 | 后端接口 |
| --- | --- | --- |
| 视图 | `vw_exam_score_summary` | `GET /api/views/exams/score-summary` |
| 视图 | `vw_answer_sheet_detail` | `GET /api/views/exams/answer-sheets` |
| 存储过程 | `auto_submit_exam` | `POST /api/procedures/exams/auto-submit` |
| 存储过程 | `exam_pass_rate` | `GET /api/procedures/exams/{examId}/pass-rate` |

如果数据库里还没有这些对象，需要先执行考试模块文档里的 SQL。对象创建完成后，不需要改后端代码，直接访问对应接口即可。
