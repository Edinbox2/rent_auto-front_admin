import React, { Component } from "react";
import FormField from "../../../../UI/formField";
import "./index.css";
import { updateField, populateFormRates, formIsValidRates } from "../utilities";
import { range, slice } from "./data";
import axios from "axios";
import { getHeaders } from "../../../../UI/misc";

class RentalRates extends Component {
  state = {
    formSubmit: false,
    formSuccess: false,
    formError: false,
    options: {
      range_rates: [],
      slice_rates: []
    },
    formdata: {
      range_rates: [
        {
          value: "",
          element: "input",
          config: {
            type: "number",
            name: "range_one",
            placeholder: "введите число",
            label: "от 1 до 6 дней"
          },
          validation: {
            required: true
          },
          showLabel: true,
          valid: false,
          validationMessge: ""
        },
        {
          value: "",
          element: "input",
          config: {
            type: "number",
            name: "range_two",
            placeholder: "введите число",
            label: "от 7 до 20 дней"
          },
          validation: {
            required: true
          },
          showLabel: true,
          valid: false,
          validationMessge: ""
        },
        {
          value: "",
          element: "input",
          config: {
            type: "number",
            name: "range_three",
            placeholder: "введите число",
            label: "от 21 дня"
          },
          validation: {
            required: true
          },
          showLabel: true,
          valid: false,
          validationMessge: ""
        }
      ],
      slice_rates: [
        {
          value: "",
          element: "input",
          config: {
            type: "number",
            name: "slice_one",
            placeholder: "введите число",
            label: "выходные дни"
          },
          validation: {
            required: true
          },
          showLabel: true,
          valid: false,
          validationMessge: ""
        },
        {
          value: "",
          element: "input",
          config: {
            type: "number",
            placeholder: "введите число",
            label: "рабочие дни",
            name: "slice_two"
          },
          validation: {
            required: true
          },
          showLabel: true,
          valid: false,
          validationMessge: ""
        }
      ]
    }
  };

  componentDidMount() {
    const id = this.props.id;

    axios
      .get(`https://api.rent-auto.biz.tm/info_models/${id}`, getHeaders())
      .then(res => {
        const options = { ...this.state.options };
        const formdata = { ...this.state.formdata };

        const form = populateFormRates(res.data, formdata);
        this.setState({ formdata: form });

        for (let key in options) {
          options[key] = res.data[key];
        }

        this.setState({ options, formdata });
      });
  }

  onChangeHandlerRates = element => {
    const formdata = { ...this.state.formdata };
    const range_rates = { ...formdata["range_rates"] };
    const form = updateField(element, range_rates, this.props.id);
    formdata["range_rates"] = form;
    this.setState({ formdata });
  };

  onChangeHandlerSlice = element => {
    const formdata = { ...this.state.formdata };
    const slice_rates = { ...formdata["slice_rates"] };
    const form = updateField(element, slice_rates, this.props.id);
    formdata["slice_rates"] = form;
    this.setState({ formdata });
  };

  onSubmitForm = e => {
    e.preventDefault();
    const formdata = { ...this.state.formdata };
    const options = { ...this.state.options };

    let isValid = formIsValidRates(this.props.id, formdata, options);

    this.setState({ formSubmit: true });
    if (isValid) {
      this.setState({ formError: false, formSuccess: true });
      setTimeout(() => {
        this.setState({ formSuccess: false });
      }, 1000);
    } else {
      this.setState({ formError: true, formSuccess: false });
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={event => this.onSubmitForm(event)} className="rental">
          <h2>range rates</h2>
          {range.map((item, index) => (
            <FormField
              key={index}
              className="edit_car_formField"
              id={index}
              formdata={this.state.formdata.range_rates[index]}
              change={element => this.onChangeHandlerRates(element)}
              submit={this.state.formSubmit}
            />
          ))}
          <br />
          <hr />
          <h2>slice rates</h2>
          {slice.map((item, index) => (
            <FormField
              key={index}
              className="edit_car_formField"
              id={index}
              formdata={this.state.formdata.slice_rates[index]}
              change={element => this.onChangeHandlerSlice(element)}
              submit={this.state.formSubmit}
            />
          ))}
          {this.state.formSuccess ? (
            <div className="success"> Готово!</div>
          ) : null}
          {this.state.formError ? (
            <div className="danger">
              Проверьте правильность заполнения полей
            </div>
          ) : null}
          <button onClick={event => this.onSubmitForm(event)}>
            Подтвердить
          </button>
        </form>
      </div>
    );
  }
}

export default RentalRates;
