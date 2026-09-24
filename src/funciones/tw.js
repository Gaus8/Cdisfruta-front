import { tailwindClassMap } from './tailwindClassMap.js';

export function tw(...values) {
  const names = [];
  const collect = (item) => {
    if (!item) return;
    if (typeof item === 'string') names.push(...item.split(/\s+/).filter(Boolean));
    else if (Array.isArray(item)) item.forEach(collect);
    else if (typeof item === 'object') Object.entries(item).forEach(([name, enabled]) => enabled && names.push(name));
  };
  values.forEach(collect);
  return [...new Set([...names, ...names.flatMap((name) => tailwindClassMap[name] || [])])].join(' ');
}
