import React, { Component, createRef, RefObject } from 'react';

export interface AccordionCardProps {
  title: string;
}

export default class AccordionCard extends Component<AccordionCardProps, any> {

  private panel: RefObject<HTMLDivElement> = createRef();

  state = {
    maxHeight: '0'
  }

  toggleOpen = () => {
    if (!this.panel.current){
      throw new Error('Can not toggle accordion. Panel does not exists');
    }
    if (this.state.maxHeight === '0') {
      this.setState({ maxHeight: `${this.panel.current.scrollHeight}px` })
    } else {
      this.setState({ maxHeight: '0' });
    }
  }

  resize = () => {
    if (!this.panel.current){
      throw new Error('Can not toggle accordion. Panel does not exists');
    }
    console.log('resize');
    console.log(this.panel.current.scrollHeight)
    if (this.state.maxHeight !== '0') {
      this.setState({ maxHeight: `${this.panel.current.scrollHeight}px` });
    }
  }

  componentDidMount() {
    // TODO: refacotr out current handling DRY
    if (!this.panel.current){
      throw new Error('Can not toggle accordion. Panel does not exists');
    }
    this.panel.current.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    if (!this.panel.current){
      throw new Error('Can not toggle accordion. Panel does not exists');
    }
    this.panel.current.removeEventListener('resize', this.resize);
  }

  public render() {
    const { title, children } = this.props;
    const { maxHeight } = this.state;
    const accordionStyle: any = {
      maxHeight,
      overflow: 'hidden',
      transition: 'max-height 0.2s ease-in-out, padding 0.2s ease-in-out',
    }

    let arrowClass = 't-accordion-arrow-d';

    if (maxHeight !== '0') {
      accordionStyle.padding = '1rem';
      arrowClass = 't-accordion-arrow-u';
    } else {
      accordionStyle.paddingLeft = '1rem';
      accordionStyle.paddingRight = '1rem';
    }

    return (
      <div className="t-card-cont t-expand">
        <h2>
          {title}
          <div className={arrowClass} onClick={this.toggleOpen} />
        </h2>
        <div className="t-accordion" ref={this.panel} style={accordionStyle} >
          {children}
        </div>
      </div>
    );
  }
}
