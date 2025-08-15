export type ParamValue = string | number | Date | (string | number | Date)[];

export const mapKeyValuePair = (
  key: string,
  value: ParamValue,
): string | string[] => {
  return Array.isArray(value)
    ? value.flatMap((arrayValue) => mapKeyValuePair(key, arrayValue))
    : `${key}=${encodeURIComponent(value instanceof Date ? value.toISOString() : value)}`;
};
