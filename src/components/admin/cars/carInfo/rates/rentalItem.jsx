import React, { Component } from "react";

import "../carInfo.css";

class RentalItem extends Component {
  
  
  render() {
    return (
      <div>
        <h3>{this.props.item.name}</h3>
        <input type="number"
        value={this.props.item.rate}
        onChange={event => this.props.inputHandler(event, this.props.index, this.props.arr)}
        className="edit_car_formField"
        />

        
      </div>
    );
  }
}

export default RentalItem;
