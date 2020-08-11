// from rollup
export function getExportFromNamespace(n: any): any {
  return (n && n['default']) || n;
}
