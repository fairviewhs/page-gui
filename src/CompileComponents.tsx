import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { GeneratedComponent } from './GeneratedComponent';
import { Structure, Placeholder } from './types';
import { ConnectDragSource, ConnectDropTarget, DropTarget, DropTargetMonitor, DragSource, XYCoord } from 'react-dnd';
import ItemTypes from './ItemTypes'
import { findDOMNode } from 'react-dom';

export interface CompileComponentsProps {
  moveComponent: (id: string, toId: string, direction: 'above' | 'below') => void;
  onClick: (componentId: string) => any;
  componentList: GeneratedComponent[];
  componentTypes: Structure[];
}

// TODO: remove temporary style
const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}


type GuiItemProps = {
  componentId: string;
  component: GeneratedComponent;

  moveComponent: (id: string, overId: string, direction: 'above' | 'below') => void;

  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;

  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  isDragging: boolean;

  isOver: boolean;

  children: React.ReactNode | React.ReactNodeArray;
}

// Please note that Item must be a class. If not then the react refs will not work and the component parameter in the hover function will always be null. See more here https://github.com/react-dnd/react-dnd/issues/530 
class Item extends Component<GuiItemProps> {
  render() {
    const opacity = this.props.isDragging ? 0 : 1;
    const backgroundColor = this.props.isOver ? 'yellow': 'inherit';

    return this.props.connectDragSource(
      this.props.connectDropTarget(
        <div
          style={{ ...style, opacity, backgroundColor }}
        >
          ID: {this.props.componentId}
          {this.props.children}
        </div>
      )
    )
  }
}

const GuiItem = DropTarget(
  ItemTypes.GUI_COMPONENT,
  {
    // canDrop: (props: GuiItemProps, monitor: DropTargetMonitor) => {
    //   const { componentId: droppedId } = monitor.getItem();
    //   const { componentId: overId } = props;
    //   return droppedId !== overId;
    // },
    hover(props: GuiItemProps, monitor: DropTargetMonitor, component) {
      if (!component) {
        return null;
      }
      const { componentId: draggedId } = monitor.getItem()
      const { componentId: overId } = props;

      // Don't replace items with themselves
      if (draggedId === overId) {
        return;
      }

      // find the middle of things
      const element = (findDOMNode(component) as Element);
      const hoverBoundingRect = element.getBoundingClientRect();
      const size = element.clientHeight;
      console.log('height', size);
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // if (hoverClientY > hoverMiddleY - size * .25 && hoverClientY < hoverMiddleY + size * .25) {
      //   console.log('middle 50%')
      //   return;
      // }

      // TODO: code to determine if the over item is a parent (if so render placholder for over property) and don't move in the list!!

      // props.movePlaceholder({ id: overId, direction: hoverClientY < hoverMiddleY ? 'above' : 'below' })

      if (draggedId !== overId) {
        console.log({ dir: hoverClientY < hoverMiddleY ? 'above' : 'below' })
        props.moveComponent(draggedId, overId, hoverClientY < hoverMiddleY ? 'above' : 'below');
        // const { index: overIndex } = props.findCard(overId)
        // props.moveCard(draggedId, overIndex)
      }
    },
    drop(props: GuiItemProps, monitor: DropTargetMonitor) {
      const { componentId: droppedId } = monitor.getItem();
      const { componentId: overId } = props;
      const hasDroppedOnChild = monitor.didDrop();
      if (!hasDroppedOnChild && droppedId !== overId) { //!didDrop
        // props.moveComponent(droppedId, overId)
      }
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }),
)(
  DragSource(
    ItemTypes.GUI_COMPONENT,
    {
      beginDrag: (props: GuiItemProps) => {
        // props.movePlaceholder(props.componentId)
        console.log('beginDrag')
        return {
          componentId: props.componentId
        }
      },
      endDrag: (props: GuiItemProps) => {
      }
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  )(Item),
);

type GuiPlaceholderProps = {
  parentId: string;
  componentListProp: string;

  connectDropTarget: ConnectDropTarget;
  isOver: boolean;

  moveComponentInto: (id: string, toId: string, componentListProp: string) => any;
}

@observer
export default class CompileComponents extends Component<CompileComponentsProps> {

  handleClick = (id: string) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    this.props.onClick(id);
  };

  public render() {
    const compiledComponents = this.props.componentList.map(info => {
      const componentListPropValues = Object.entries(info.componentListProps).reduce((prevOptions, [property, value]) => {
        let subComponent = (
          <CompileComponents
            key={property}
            onClick={this.props.onClick}
            componentList={value}
            componentTypes={info.flattenComponentListStructures[property]}
            moveComponent={this.props.moveComponent}
          />
        );

        return {
          ...prevOptions,
          [property]: subComponent
        }
      }, {});

      const item = (
        <GuiItem
          key={info.id}
          componentId={info.id}
          component={info}
          onClick={this.handleClick(info.id)}
          moveComponent={this.props.moveComponent}
        >
          <info.structure.component key={info.id} {...info.basicInputProps} {...componentListPropValues} />
        </GuiItem>
      );
      return item;
    });

    return compiledComponents;
  }
}
