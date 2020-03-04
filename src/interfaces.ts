export interface Dict<T> {
  [key: string]: T;
}
export interface Feature {
  name: string;
  affectedFiles?: string[];
  dependOn?: string[];
  checked?: boolean;
  packages?: string[];
  devPackages?: string[];
}
