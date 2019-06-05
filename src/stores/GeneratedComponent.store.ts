import { observable, action, reaction } from "mobx";
import { GeneratedComponent } from "../GeneratedComponent";

export class GeneratedComponentStore {
  @observable components: GeneratedComponent[];
  
  constructor(components: GeneratedComponent[] = []) {
    this.components = components;

    reaction(() => this.components,
      (data) => {
        localStorage.setItem('page', JSON.stringify(data))
      }, { delay: 1000 }
    )
  }

  find = (findFn: (component: GeneratedComponent) => boolean, list: GeneratedComponent[] = this.components): GeneratedComponent | null => 
    list.reduce((prevFound: null | GeneratedComponent, component: GeneratedComponent) => {
      if (!!prevFound) return prevFound;
      if (findFn(component)) return component;

      return Object.values(component.componentListProps)
        .reduce((prevSubFind: null | GeneratedComponent, componentList: GeneratedComponent[]) => !!prevSubFind ? prevSubFind : this.find(findFn, componentList), null);
    }, null);

  findParent = (findChild: (component: GeneratedComponent) => boolean): { parent: GeneratedComponent, propertyName: string, index: number } | null  => {
    let propertyName: string = '';
    let index = -1;

    const parentComp = this.find(parent => {
      const property = Object.entries(parent.componentListProps)
        .find(([propertyName, list]) => {
          const foundIndex = list.findIndex(findChild);
          if (foundIndex !== -1) {
            index = foundIndex;
            return true;
          }
          return false;
        });
      if (property === undefined) {
        return false;
      }
      console.log(property);
      propertyName = property[0];
      return true;
    })

    if (!parentComp) return null;

    return { parent: parentComp, propertyName, index };
  }

  filter = (filterFn: (component: GeneratedComponent) => boolean, list: GeneratedComponent[] = this.components): GeneratedComponent[] => {
    return list.filter(filterFn).map(component => {
      const componentListProps = Object.entries(component.componentListProps).reduce((prev, [propertyName, value]) => ({
        ...prev,
        [propertyName]: this.filter(filterFn, value)
      }), {});

      const values = {
        ...component.values,
        ...componentListProps
      }

      return new GeneratedComponent({
        ...component,
        values
      });
    });
  }

  map = (mapFn: (component: GeneratedComponent) => GeneratedComponent, list: GeneratedComponent[] = this.components): GeneratedComponent[] => {
    return list.map((component: GeneratedComponent) => {
      const mappedComponent = mapFn(component);
      const componentListProps = Object.entries(mappedComponent.componentListProps).reduce((prev, [propertyName, value]) => ({
        ...prev,
        [propertyName]: this.map(mapFn, value)
      }), {});
      const values = {
        ...mappedComponent.values,
        ...componentListProps
      }
      return new GeneratedComponent({
        ...mappedComponent,
        values
      });
    })
  }

  // TODO: add at position
  @action add = (componentToAdd: GeneratedComponent, parent?: { id: string, propertyName: string }) => {
    if (parent === undefined) {
      this.components = [
        ...this.components,
        componentToAdd
      ]
    } else {
      this.components = this.map(component => {
        if (component.id === parent.id) { // Append the `component` to the parent[propertyValue] TestComponent[]
          return new GeneratedComponent({
            ...component,
            values: {
              ...component.values,
              [parent.propertyName]: [
                ...component.values[parent.propertyName],
                componentToAdd
              ]
            }
          });
        }
        return component;
      });
    }
  }

  // TODO: finish
  @action moveVertical = (componentToMove: (component: GeneratedComponent) => boolean, direction: 'up' | 'down', times = 1): void => {
    if (times <= 0) {
      throw new TypeError(`Times can not be a negitive or zero value. Times: "${times}"`)
    }
    
    const component = this.find(componentToMove);

    if (component === null) {
      // TODO:
      console.log('No component');
      return;
    }

    if (direction === 'up') {
      let parent = this.findParent(componentToMove);

      if (parent === null) {
        console.warn('Can not move component up as it is already at the top');
        return;
      }

      while (times > 0 && parent !== null) { // Go up further if times is more than one
        parent = this.findParent(comp => comp.id === parent!.parent.id)

        times--;
        
        if (parent === null && times > 0) {
          console.warn(`Times amount is larger than the amount of parents.`);
        }
      }

      if (parent === null) {
        this.add(component);
      } else {

        const propertyName = Object.entries(parent.parent.componentListProps)
          // .filter(([propertyName, list]) => propertyName !== parentOfParent.propertyName)
          .reduceRight((prevName: string | null, [propertyName, list]) => {
            console.log({
              propertyName,
              list,
              isValid: parent!.parent.isValidValue(propertyName, list)
            })
            if (typeof prevName === 'string') return prevName;
            return parent!.parent.isValidValue(propertyName, list) ? propertyName : null;
          }, null);

        if (propertyName === null) {
          console.log('No property');
          // TODO:
          return;
        }
        this.add(component, { id: parent.parent.id, propertyName });
      }
    } else {
      const parent = this.findParent(componentToMove);

      // TODO: handle times

      if (parent === null) {
        // TODO:
        console.log('No parent');
        return;
      }

      const list = parent.parent.componentListProps[parent.propertyName];
      // TODO handle moving into other property name lists
      const info = list
        .filter(comp => comp.id !== component.id)
        .reduceRight((compToMoveIn: { propertyName: string, component: GeneratedComponent } | null, comp) => {
          if (compToMoveIn !== null) {
            return compToMoveIn;
          }
          const propertyName = Object.keys(comp.componentListProps)
            .find(propertyName => comp.isValidValue(propertyName, [...comp.componentListProps[propertyName], component]));
          return propertyName !== undefined ? { propertyName, component: comp } : null; 
            // if (comp.isValidValue())
        }, null);
      if (info === null) {
        // TODO:
        return;
      }

      // this.props.generatedComponentStore.components = this.props.generatedComponentStore.filter(comp => comp.id !== componentId);
      // this.props.generatedComponentStore.add(component, { id: info.component.id, propertyName: info.propertyName });
    }

    // Remove the component
    this.components = this.filter(componentToMove);
  }

  @action move = (id: string, toId: string) => {
    console.log({id, toId})
    const foundComponent = this.find(comp => comp.id === id);

    if (foundComponent === null) {
      // TODO:
      console.log('No component');
      return;
    }

    const filtered = this.filter(comp => comp.id !== id);

    const parent = this.findParent(comp => comp.id === toId);

    console.log({ parent, foundComponent })

    if (!parent) { // The child is a root component
      const wantedIndex = filtered.findIndex(comp => comp.id === toId);
      this.components = [
        ...filtered.slice(0, wantedIndex),
        foundComponent,
        ...filtered.slice(wantedIndex)
      ];
    } else {
      this.components = this.map(component => {
        if (component.id === parent.parent.id) {
          const componentList = (component.values[parent.propertyName] as GeneratedComponent[])//.filter(child => child.id !== componentId);
          // const wantedIndex = componentList.findIndex(comp => comp.id === toId);
          console.log(new GeneratedComponent({
            ...component,
            values: {
              ...component.values,
              [parent.propertyName]: [
                ...componentList.slice(0, parent.index),
                foundComponent,
                ...componentList.slice(parent.index)
              ] as GeneratedComponent[]
            }
          }))
          return new GeneratedComponent({
            ...component,
            values: {
              ...component.values,
              [parent.propertyName]: [
                ...componentList.slice(0, parent.index),
                foundComponent,
                ...componentList.slice(parent.index)
              ] as GeneratedComponent[]
            }
          });
        }

        return component;
      }, filtered)
    }
  }
}

export default new GeneratedComponentStore();