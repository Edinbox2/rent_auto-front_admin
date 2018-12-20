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
    formSubmit: false,
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
    this.setState({ formSubmit: true });
    axios.patch(`https://api.rent-auto.biz.tm/info_models/${this.state.id}`, getHeaders()).then(res=>{
        console.log(res.data)
    })
  };

  inputHandler=(event, name, index)=>{
    const obj = {...this.state.newopt}
    const range_rates = {...obj['range_rates']}
    const item = range_rates[index]
    item[name] = event.target.value
    range_rates[index] = item
    obj['range_rates'] = range_rates
    this.setState({newopt: obj})
  }

  render() {
    return (
      <div className="rental">
        <hr />
        <h2>Rental rate</h2>
        <form onSubmit={this.submitForm}>
          {
            this.state.options.range_rates? 
            this.state.options.range_rates.map((item, i) => (
            <RentalItem
              key={i}
              index={i}
              id={item.id}
              item={item}
              submit={this.state.formSubmit}
              inputHandler={(event, name, index) =>this.inputHandler(event, name, index)}
            />
          )): null}
          <button onSubmit={this.submitForm}>sent</button>
        </form>
      </div>
    );
  }
}

export default Rentals;
