import { tailwindClassMap } from './tailwindClassMap.js';

const classCache = new Map();

export function tw(...values) {
  const key = JSON.stringify(values);
  const cached = classCache.get(key);
  if (cached) return cached;

  const names = [];
  const collect = (item) => {
    if (!item) return;
    if (typeof item === 'string') names.push(...item.split(/\s+/).filter(Boolean));
    else if (Array.isArray(item)) item.forEach(collect);
    else if (typeof item === 'object') Object.entries(item).forEach(([name, enabled]) => enabled && names.push(name));
  };
  values.forEach(collect);
  const classes = [...new Set([...names, ...names.flatMap((name) => tailwindClassMap[name] || [])])].join(' ');
  classCache.set(key, classes);
  return classes;
}
