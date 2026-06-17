# 后端接口规范与模板

本文档用于统一本项目 Spring Boot + MyBatis 后端接口写法，方便后端成员补接口，也方便前端按固定格式联调。

## 1. 基础约定

### 1.1 接口前缀

所有接口统一以 `/api` 开头。

```text
http://localhost:8080/api/模块/资源
```

示例：

```text
GET  /api/views/users/safe
POST /api/procedures/tasks/update-time
```

### 1.2 请求方法

| 类型 | 方法 | 说明 |
| --- | --- | --- |
| 查询视图/列表/详情 | `GET` | 不修改数据库 |
| 调用会修改数据的存储过程 | `POST` | 例如新增、更新、归档、下线 |
| 查询型存储过程 | `GET` | 存储过程只返回统计结果时使用 |

### 1.3 Content-Type

有请求体的接口统一使用：

```http
Content-Type: application/json
```

## 2. 统一响应格式

所有接口统一返回：

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

字段说明：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `success` | Boolean | 是否成功 |
| `message` | String | 成功提示或错误原因 |
| `data` | Object / Array / null | 返回数据 |

成功示例：

```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "user_id": "U001",
      "username": "李勇",
      "user_pwd": "******",
      "contact": "135****2222",
      "岗位": "安全工程师"
    }
  ]
}
```

失败示例：

```json
{
  "success": false,
  "message": "数据库调用失败：Table 'xxx' doesn't exist",
  "data": null
}
```

## 3. 接口命名规范

### 3.1 URL 命名

统一使用小写英文和中划线。

推荐：

```text
/api/views/exams/score-summary
/api/procedures/tasks/update-time
```

不推荐：

```text
/api/getExamScoreSummary
/api/views/exam_score_summary
```

### 3.2 模块划分

| 模块 | 路径建议 |
| --- | --- |
| 用户 | `/api/views/users/...` |
| 笔记 | `/api/views/notes/...`、`/api/procedures/notes/...` |
| 课程 | `/api/views/courses/...`、`/api/procedures/courses/...` |
| 任务 | `/api/views/tasks/...`、`/api/procedures/tasks/...` |
| 考试 | `/api/views/exams/...`、`/api/procedures/exams/...` |
| 成绩统计 | `/api/views/stats/...`、`/api/procedures/stats/...` |

## 4. 后端代码写法模板

新增一个接口时，一般需要改 4 个位置：

```text
Controller -> Service -> Mapper.java -> Mapper.xml
```

如果接口有 JSON 请求体，再新增一个 DTO。

## 5. 视图查询接口模板

适用于：

```sql
SELECT * FROM 某个视图;
```

### 5.1 Mapper.java

```java
List<Map<String, Object>> selectXxx();
```

### 5.2 Mapper.xml

```xml
<select id="selectXxx" resultType="map">
    SELECT * FROM `视图名`
</select>
```

### 5.3 Service

```java
public List<Map<String, Object>> xxx() {
    return viewMapper.selectXxx();
}
```

### 5.4 Controller

```java
@GetMapping("/模块/接口名")
public ApiResponse<List<Map<String, Object>>> xxx() {
    return ApiResponse.ok(viewService.xxx());
}
```

### 5.5 接口文档模板

```markdown
### 接口名称

- 请求方法：GET
- 请求路径：/api/views/模块/接口名
- 对应数据库对象：视图名
- 功能说明：说明这个接口给前端展示什么数据

#### 请求参数

无

#### 响应示例

```json
{
  "success": true,
  "message": "OK",
  "data": []
}
```
```

## 6. 存储过程接口模板

适用于：

```sql
CALL 存储过程名(...);
```

### 6.1 无返回结果，只执行操作

例如更新、下线、自动交卷。

#### Mapper.java

```java
void callXxx(Map<String, Object> params);
```

#### Mapper.xml

```xml
<update id="callXxx" parameterType="map" statementType="CALLABLE">
    {CALL 存储过程名(
        #{param1, mode=IN, jdbcType=INTEGER},
        #{param2, mode=IN, jdbcType=VARCHAR}
    )}
</update>
```

#### Controller

```java
@PostMapping("/模块/接口名")
public ApiResponse<Void> xxx(@Valid @RequestBody XxxRequest request) {
    procedureService.xxx(request);
    return ApiResponse.ok("操作成功", null);
}
```

### 6.2 有查询结果返回

例如统计、报表导出。

#### Mapper.java

```java
List<Map<String, Object>> callXxx(Map<String, Object> params);
```

#### Mapper.xml

```xml
<select id="callXxx" parameterType="map" resultType="map" statementType="CALLABLE">
    {CALL 存储过程名(
        #{param1, mode=IN, jdbcType=INTEGER}
    )}
</select>
```

#### Controller

```java
@GetMapping("/模块/接口名")
public ApiResponse<List<Map<String, Object>>> xxx(@RequestParam Integer param1) {
    return ApiResponse.ok(procedureService.xxx(param1));
}
```

### 6.3 有 OUT 参数返回

例如存储过程返回操作提示。

#### Mapper.xml

```xml
<update id="callXxx" parameterType="map" statementType="CALLABLE">
    {CALL 存储过程名(
        #{param1, mode=IN, jdbcType=VARCHAR},
        #{message, mode=OUT, jdbcType=VARCHAR}
    )}
</update>
```

#### Service

```java
public String xxx(String param1) {
    Map<String, Object> params = new HashMap<>();
    params.put("param1", param1);
    procedureMapper.callXxx(params);
    return String.valueOf(params.get("message"));
}
```

#### Controller

```java
@PostMapping("/模块/接口名")
public ApiResponse<Map<String, String>> xxx(@RequestBody XxxRequest request) {
    String message = procedureService.xxx(request.param1());
    return ApiResponse.ok(message, Map.of("message", message));
}
```

## 7. DTO 请求体模板

```java
package com.example.learning.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record XxxRequest(
        @NotNull Integer id,
        @NotBlank String name
) {
}
```

常用校验注解：

| 注解 | 说明 |
| --- | --- |
| `@NotNull` | 不能为 null |
| `@NotBlank` | 字符串不能为空 |
| `@DecimalMin("0.01")` | 数字最小值 |
| `@Pattern(regexp = "...")` | 正则格式校验 |

## 8. 接口文档填写模板

每个接口按下面格式写。

```markdown
### 1. 接口名称

- 请求方法：
- 请求路径：
- 对应数据库对象：
- 功能说明：

#### 请求参数

| 参数名 | 位置 | 类型 | 是否必填 | 示例 | 说明 |
| --- | --- | --- | --- | --- | --- |
| id | path/query/body | Integer | 是 | 1 | 参数说明 |

#### 请求示例

```json
{
  "id": 1,
  "name": "示例"
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "OK",
  "data": []
}
```

#### 备注

- 无
```

## 9. 当前项目接口清单

### 9.1 视图接口

| 方法 | 路径 | 数据库视图 |
| --- | --- | --- |
| GET | `/api/views/tasks/progress-overview` | `v_task_progress_overview` |
| GET | `/api/views/tasks/delay-warnings` | `v_delay_user_warning` |
| GET | `/api/views/stats/learning-exam` | `v_全体学员学习考试统计` |
| GET | `/api/views/stats/employee-anomalies` | `v_employee_anomaly_behavior` |
| GET | `/api/views/users/safe` | `v_user_safe` |
| GET | `/api/views/notes/lecturer-student` | `v_lecturer_student_notes` |
| GET | `/api/views/courses/category-stats` | `view_course_category_stats` |
| GET | `/api/views/exams/score-summary` | `vw_exam_score_summary` |
| GET | `/api/views/exams/answer-sheets` | `vw_answer_sheet_detail` |

### 9.2 存储过程接口

| 方法 | 路径 | 存储过程 |
| --- | --- | --- |
| POST | `/api/procedures/tasks/batch-assign` | `sp_batch_assign_task` |
| POST | `/api/procedures/tasks/update-time` | `sp_update_task_time` |
| GET | `/api/procedures/stats/export-anomaly-employees` | `sp_export_anomaly_employees` |
| POST | `/api/procedures/stats/archive-monthly/{statMonth}` | `sp_archive_monthly_stats` |
| POST | `/api/procedures/notes/update` | `sp_emp_update_note` |
| GET | `/api/procedures/notes/admin-all` | `sp_admin_get_all_notes` |
| POST | `/api/procedures/courses/{courseId}/offline` | `sp_course_offline` |
| POST | `/api/procedures/exams/auto-submit` | `auto_submit_exam` |
| GET | `/api/procedures/exams/{examId}/pass-rate` | `exam_pass_rate` |
