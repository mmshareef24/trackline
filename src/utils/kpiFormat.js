// Utility functions to format KPI values and trends consistently across modules

// Maps common unit keys to display labels and default decimals
const UNIT_FORMATS = {
  sar: { label: 'SAR', decimals: 0 },
  sar_per_mt: { label: 'SAR/MT', decimals: 0 },
  mt: { label: 'MT', decimals: 0 },
  percent: { label: '%', decimals: 0 },
  days: { label: 'days', decimals: 0 },
  hours: { label: 'h', decimals: 0 },
  mwh: { label: 'MWh', decimals: 2 },
  kwh: { label: 'kWh', decimals: 0 },
  kwh_per_mt: { label: 'kWh/MT', decimals: 0 },
  tco2: { label: 'tCO₂', decimals: 2 },
  tco2_per_mt: { label: 'tCO₂/MT', decimals: 2 },
  units: { label: 'units', decimals: 0 },
  ratio: { label: '', decimals: 2 },
};

function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const num = Number(value);
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Formats a KPI value with unit awareness
export function formatValue(value, unit, options = {}) {
  // Preserve placeholder
  if (value === '—') return '—';
  const unitInfo = UNIT_FORMATS[unit] || { label: unit || '', decimals: 0 };
  const decimals = options.decimals ?? unitInfo.decimals;
  const formatted = formatNumber(value, decimals);
  return unitInfo.label ? `${formatted} ${unitInfo.label}` : formatted;
}

// Formats a trend value as +x% / -x%
export function formatTrend(trend) {
  if (trend === null || trend === undefined || Number.isNaN(Number(trend))) return '—';
  const num = Number(trend);
  const sign = num > 0 ? '+' : '';
  return `${sign}${num}%`;
}

// Determines semantic style based on trend direction
export function trendClass(trend) {
  const num = Number(trend);
  if (Number.isNaN(num)) return 'border-muted text-muted-foreground';
  return num >= 0 ? 'border-success text-success' : 'border-error text-error';
}

// Formats a delta (variance) between current value and target with a sign
export function formatDelta(delta, unit, options = {}) {
  if (delta === null || delta === undefined || Number.isNaN(Number(delta))) return '—';
  const num = Number(delta);
  const sign = num > 0 ? '+' : num < 0 ? '-' : '';
  // Display absolute magnitude with unit, prefix explicit sign
  const magnitude = Math.abs(num);
  return `${sign}${formatValue(magnitude, unit, options)} `;
}

// Simple styling for deltas; can be refined per KPI semantics later
export function deltaClass(delta) {
  const num = Number(delta);
  if (Number.isNaN(num)) return 'text-muted-foreground';
  if (num > 0) return 'text-muted-foreground';
  if (num < 0) return 'text-muted-foreground';
  return 'text-muted-foreground';
}