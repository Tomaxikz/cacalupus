import { dirname } from 'pathe';

export interface PathSegment {
  name: string;
  path: string;
}

export function pathSegments(path: string): PathSegment[] {
  const parts = path.split('/').filter(Boolean);
  return parts.map((name, index) => ({ name, path: parts.slice(0, index + 1).join('/') }));
}

export function parentPath(path: string): string {
  const parent = dirname(path);
  return parent === '.' || parent === '/' ? '' : parent;
}

export function relativeName(fullPath: string, directory: string): string {
  const prefix = `${directory}/`;
  return directory && fullPath.startsWith(prefix) ? fullPath.slice(prefix.length) : fullPath;
}
