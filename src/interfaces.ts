export interface Dict<T> {
  [key: string]: T;
}
export type BooleanDict = Dict<boolean>;
export interface Feature {
  name: string;
  affectedFiles?: string[];
  dependOn?: string[];
  checked?: boolean;
  packages?: string[];
  devPackages?: string[];
}
