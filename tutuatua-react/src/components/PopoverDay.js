import React from 'react';
import { Popover, Button, Input } from 'antd';
import './PopoverDay.css'

export class PopoverDay extends React.Component {
  state = {
    visible: false,
    
    fromtime: '',
    totime: '',
    price: undefined,
  };

  hide = () => {
    this.setState({
      visible: false,
    });
  };
  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  handleAddThenHide = () => {
    this.props.handleAddSchedule(this.state.fromtime,this.state.totime,this.state.price)
    this.hide()
    this.setState({ fromtime:'', totime:'', price:undefined })
  }

  render() {    
    return (
      <Popover
        placement='right'
        content=
          {<div>
            <Input className='popover-input' placeholder='time from ...' 
                style={{marginRight:'5px'}}
                onChange={e => this.setState({fromtime: e.target.value})}
                value={this.state.fromtime}
            /><span>-</span>
            <Input className='popover-input' placeholder='to ...' 
                onChange={e => this.setState({totime: e.target.value})}
                value={this.state.totime}
            />
            <br />
            <Input className='popover-input' placeholder='price ...' 
                style={{width:'150px'}}
                onChange={e => this.setState({price: e.target.value})}
                value={this.state.price}
            /><span>baht</span>                
            <div className='endPopover'>
                <div
                  onClick = {this.handleAddThenHide} 
                  style={{color:'#0066ff'}}>
                    Submit
            </div>
                <div onClick={this.hide} style={{color:'red'}}>Close</div>
            </div>                
          </div>}
        title="Insert Schedule"
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <Button className='add-button'>...</Button>
      </Popover>
    );
  }
}

