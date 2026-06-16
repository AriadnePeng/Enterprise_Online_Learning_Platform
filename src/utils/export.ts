type ExportRow = Record<string, unknown>;

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function printable(value: unknown) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function exportToCsv(rows: ExportRow[], filename: string) {
  if (!rows.length) throw new Error('没有可导出的数据');
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => `"${printable(value).replace(/"/g, '""')}"`;
  const content = [
    headers.map(escape).join(','),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(',')),
  ].join('\r\n');
  downloadBlob(new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8' }), `${filename}.csv`);
}

export function exportToExcel(rows: ExportRow[], filename: string) {
  if (!rows.length) throw new Error('没有可导出的数据');
  const headers = Object.keys(rows[0]);
  const escapeHtml = (value: unknown) => printable(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const table = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8"></head>
      <body><table border="1">
        <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${headers.map((header) => `<td>${escapeHtml(row[header])}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></body>
    </html>`;
  downloadBlob(new Blob([table], { type: 'application/vnd.ms-excel;charset=utf-8' }), `${filename}.xls`);
}

