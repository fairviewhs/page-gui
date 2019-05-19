import React, { ReactNode, Component, ReactNodeArray } from 'react';
import classNames from 'classnames';
import StringRender from '../BaseComponents/StringRender';

export interface BlockSectionProps {
  title: string;
  mode: StringRender;
  children: ReactNode|ReactNodeArray;
}

/* possible states:
 * banner (banner at top)
 * section (card style header)
 *  accordian (section with dropdown)
 * subsection (small banner style header)
 */

export default class BlockSection extends Component<BlockSectionProps, any> {

  state = {
    isToggled: false
  }

  toggle = () => {
    this.setState({isToggled: !this.state.isToggled});
  }

  public render() {
    const { title, children } = this.props;
    const mode = this.props.mode.props.children;
    /*var sectionClass = classNames({
      sectionBlock: true,
      expand: this.props.mode == "expand",
      collapse: this.props.mode == "collapse",
      toggle: this.state.isToggled
    });*/

    /*return (
      <div className={sectionClass}>
        <div className="sectionHeader" onClick={this.toggle}>
          <h2>{title}</h2>
          {(mode == "expand" || mode == "collapse") && <div className="sectionArrow"></div>}
        </div>
        <div className="sectionBody">
          {children}
        </div>
      </div>
    );*/
    if(mode == "banner"){
      return (
        <div>
          <div className="t-ribbon-1 t-ribbon-1-wrap">
            <div className="t-ribbon-1-tl"></div>
            <div className="t-ribbon-1-tr"></div>
            <h1>
              {title}
            </h1>
          </div>
          {children}
        </div>
      );
    } else if (mode == "section"){
      // TODO: accordian
      return (
        <div className="sectionBlock">
          <div className="sectionHeader">
            <h2>{title}</h2>
          </div>
          <div className="sectionBody">
            {children}
          </div>
        </div>
      );
    } else if (mode == "subsection"){
      return (
        <div>
          <div className="t-ribbon-4">
            {title}
          </div>
          {children}
        </div>
      );
    }

    return (
      <div></div>
    );
  }
}
