import React, { ReactNode, Component, ReactNodeArray } from 'react';
import classNames from 'classnames';

export interface BlockSectionProps {
  title: string;
  mode: string;
  children: ReactNode|ReactNodeArray;
}

export default class BlockSection extends Component<BlockSectionProps, any> {

  state = {
    isToggled: false
  }

  toggle = () => {
    this.setState({isToggled: !this.state.isToggled});
  }

  public render() {
    const { title, mode, children } = this.props;
    var sectionClass = classNames({
      sectionBlock: true,
      expand: this.props.mode == "expand",
      collapse: this.props.mode == "collapse",
      toggle: this.state.isToggled
    });

    return (
      <div className={sectionClass}>
        <div className="sectionHeader" onClick={this.toggle}>
          <h2>{title}</h2>
          {(mode == "expand" || mode == "collapse") && <div className="sectionArrow"></div>}
        </div>
        <div className="sectionBody">
          {children}
        </div>
      </div>
    );
  }
}
