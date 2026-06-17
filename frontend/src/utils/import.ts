export interface ImportPreview {
  headers: string[];
  rows: Record<string, string>[];
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];
    if (character === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      row.push(value.trim());
      value = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1;
      row.push(value.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = '';
    } else {
      value += character;
    }
  }
  row.push(value.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function tableToPreview(table: HTMLTableElement): ImportPreview {
  const matrix = Array.from(table.rows).map((row) => Array.from(row.cells).map((cell) => cell.textContent?.trim() ?? ''));
  return matrixToPreview(matrix);
}

function matrixToPreview(matrix: string[][]): ImportPreview {
  if (matrix.length < 2) throw new Error('文件中没有可导入的数据');
  const headers = matrix[0].map((header, index) => header || `column_${index + 1}`);
  const rows = matrix.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
  return { headers, rows };
}

export async function previewDataFile(file: File): Promise<ImportPreview> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !['csv', 'xls'].includes(extension)) {
    throw new Error('支持 CSV 和本系统导出的 Excel .xls 文件');
  }
  const text = (await file.text()).replace(/^\uFEFF/, '');
  if (extension === 'csv') return matrixToPreview(parseCsv(text));

  const documentNode = new DOMParser().parseFromString(text, 'text/html');
  const table = documentNode.querySelector('table');
  if (!table) throw new Error('Excel 文件中未找到数据表');
  return tableToPreview(table);
}

