export const OUTBOUND_COLOR = 'var(--chart-series-1)';
export const INBOUND_COLOR = 'var(--chart-series-2)';

export function tunnelAddresses(name: string, alias: string, address: string | null): string[] {
  return [`${name}.tunnel`, `${alias}.tunnel`, ...(address ? [address] : [])];
}
