import React, { Component } from "react";
import axios from "axios";
import RentalItem from "./rentalItem";
import { getHeaders } from "../../../../UI/misc";
import "./index.css";

class Rentals extends Component {
  state = {
    id: "",
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
        this.setState({ options });
      });
  }


  submitData = (data) => {
    console.log(data)
    const options = {...this.state.options}
    const range_rates = {...options['range_rates']}
    for(let key in range_rates){
      if(range_rates[key].id === data.id){
      console.log(data.id)
    }
    }
    
    this.setState({formSubmit: false})
   
  };

  submitForm = e => {
    e.preventDefault();
    this.setState({ formSubmit: true });
  };

  render() {
    
    return (
      <div className="rental">
        <hr />
        <h2>Rental rate</h2>
        <form onSubmit={this.submitForm}>
          {this.state.options.range_rates.map((item, i) => (
            <RentalItem
              key={i}
              id={item.id}
              item={item}
              submit={this.state.formSubmit}
              submitData={this.submitData}
            />
          ))}
          <button onSubmit={this.submitForm}>sent</button>
        </form>
      </div>
    );
  }
}

export default Rentals;
