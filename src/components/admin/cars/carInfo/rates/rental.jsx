import React, { Component } from "react";
import axios from "axios";
import RentalItem from "./rentalItem";
import { getHeaders } from "../../../../UI/misc";
import "./index.css";

class Rentals extends Component {
  state = {
    id: "",
    newopt: {
      range_rates: [],
      slice_rates: []
    },
    options: {
      range_rates: [],
      slice_rates: []
    }
  };

  componentDidMount() {
    const id = this.props.id;
    this.setState({ id });
    axios
      .get(`https://api.rent-auto.biz.tm/info_models/${id}`, getHeaders())
      .then(res => {
        const options = { ...this.state.options };
        for (let key in options) {
          options[key] = res.data[key];
        }
        this.setState({ options, newopt: options });
      });
  }

  submitForm = e => {
    e.preventDefault();

    const data = {
      id: this.state.id,
      ...{...this.state.newopt}
    };
    console.log(data);
    
    axios
      .patch(
        `https://api.rent-auto.biz.tm/info_models/${this.state.id}`,
        data,
        getHeaders()
      )
      .then(res => {
        console.log(res.data);
      });
  };

  inputHandler = (event, index, arr) => {
    const obj = { ...this.state.newopt };
    const array = [ ...obj[arr] ];
    const item = array[index];
    item['rate'] = event.target.value;
    array[index] = item;
    obj[arr] = array;
    this.setState({ newopt: obj });
  };

  render() {
    console.log(this.state.newopt)
    return (
      <div className="rental">
        <form onSubmit={this.submitForm}>
          <hr />
          <h2>Rental rate</h2>
          {this.state.options.range_rates
            ? this.state.options.range_rates.map((item, i) => (
                <RentalItem
                  key={i}
                  index={i}
                  id={item.id}
                  arr="range_rates"
                  item={item}
                  inputHandler={(event, index, arr) =>
                    this.inputHandler(event, index, arr)
                  }
                />
              ))
            : null}
          <br/><hr />
          <h2>Slice rate</h2>
          {this.state.options.slice_rates
            ? this.state.options.slice_rates.map((item, i) => (
                <RentalItem
                  key={i}
                  index={i}
                  id={item.id}
                  arr="slice_rates"
                  item={item}
                  inputHandler={(event, index, arr) =>
                    this.inputHandler(event, index, arr)
                  }
                />
              ))
            : null}
          <button onSubmit={this.submitForm}>Применить</button>
        </form>
      </div>
    );
  }
}

export default Rentals;
