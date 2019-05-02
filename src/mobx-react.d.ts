export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
declare module "mobx-react" {
  export function inject<D>(
    mapStoreToProps: (store: any) => D
  ): <A extends D>(
    component: React.ComponentType<A>
  ) => React.SFC<Omit<A, keyof D> & Partial<D>>;
}