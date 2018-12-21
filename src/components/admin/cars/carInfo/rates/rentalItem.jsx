import React, { Component } from "react";

import "../carInfo.css";

class RentalItem extends Component {
  
  
  render() {
    return (
      <div>
        <h3>Тариф range rate {this.props.item.id}</h3>
        <input type="text"
        value={this.props.item.name}
        onChange={event => this.props.inputHandler(event, 'name', this.props.index, this.props.arr)}
        className="edit_car_formField"
        />
        <input type="number"
        value={this.props.item.rate}
        onChange={event => this.props.inputHandler(event, 'rate', this.props.index, this.props.arr)}
        className="edit_car_formField"
        />

        
      </div>
    );
  }
}

export default RentalItem;
