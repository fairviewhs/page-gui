import { BaseComponent } from "../types";
import { observable } from 'mobx';
import config from "../config";

export class BaseComponentStore {
  @observable baseComponents: BaseComponent<any>[];

  constructor(baseComponents: BaseComponent<any>[] = []) {
    this.baseComponents = baseComponents;
  }
}

export default new BaseComponentStore(config.baseInputs);
