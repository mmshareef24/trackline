import kpiConfig from '../config/kpis';

export function getModuleKpis(moduleKey, defaultKpis) {
  try {
    const runtime = window?.__KPI_CONFIG__;
    if (runtime && Array.isArray(runtime[moduleKey])) {
      return runtime[moduleKey];
    }
  } catch (e) {
    // window may be undefined in some environments; ignore
  }
  if (Array.isArray(kpiConfig?.[moduleKey])) {
    return kpiConfig[moduleKey];
  }
  return defaultKpis;
}