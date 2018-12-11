import React, { Component } from "react";
import AdminLayout from "../../../hoc/adminLayout";
import FormField from "../../../UI/formField";
import { validate } from "../../../UI/misc";
import "./carInfo.css";
import axios from "axios";
import { data } from "./data";
import { connect } from "react-redux";
import { getToken } from "../../../UI/misc";
import * as action from "../../../../store/actions/edit";

class CarInfo extends Component {
  state = {
    formType: "",
    carId: "",
    car: [],
    formSubmit: false,
    formError: false,
    formSuccess: "",
    formdata: {
      full_name: {
        value: "",
        element: "input",
        config: {
          name: "car_name",
          type: "text",
          label: "Название модели"
        },
        validation: {
          required: true
        },
        valid: true,
        validationMessage: "",
        showLabel: true
      },
      name: {
        value: "",
        element: "input",
        config: {
          name: "car_name",
          type: "text",
          label: "Имя модели"
        },
        validation: {
          required: true
        },
        valid: true,
        validationMessage: "",
        showLabel: true
      },
      brand: {
        value: "",
        element: "input",
        config: {
          name: "car_name",
          type: "text",
          label: "Бренд модели"
        },
        validation: {
          required: true
        },
        valid: true,
        validationMessage: "",
        showLabel: true
      },
      model_class: {
        value: "",
        element: "input",
        config: {
          name: "car_name",
          type: "text",
          label: "Класс модели"
        },
        validation: {
          required: true
        },
        valid: true,
        validationMessage: "",
        showLabel: true
      },
      rental: {
        value: "",
        element: "input",
        config: {
          name: "car_name",
          type: "text",
          label: "Базовая цена"
        },
        validation: {
          required: true
        },
        valid: true,
        validationMessage: "",
        showLabel: true
      },
      engine_volume: {
        value: "",
        element: "input",
        config: {
          name: "car_name",
          type: "text",
          label: "Объём двигателя модели"
        },
        validation: {
          required: true
        },
        valid: true,
        validationMessage: "",
        showLabel: true
      }
    }
  };

  componentDidMount() {
    axios.get(`https://api.rent-auto.biz.tm/info_models`, getToken()).then(res => {
      const id = this.props.match.params.id;
      let car;
      for (let key in res.data) {
        if (res.data[key].id == id) {
          car = res.data[key];
        }
      }
      this.setState({ car, carId: id });
      this.updateFields(car);
    });
  }

  updateFields = car => {
    if (car) {
      const formdata = { ...this.state.formdata };
      for (let key in formdata) {
        switch (key) {
          case "full_name":
            formdata[key].value = car.full_name;
            break;
          case "name":
            formdata[key].value = car.name;
            break;
          case "brand":
            formdata[key].value = car.brand.name;
            break;
          case "rental":
            formdata[key].value = car.rental.day_cost;
            break;
          case "model_class":
            formdata[key].value = car.model_class.name;
            break;
          case "engine_volume":
            formdata[key].value = car.engine_volume;
            break;
          default:
            formdata[key].value = car.full_name;
        }
      }
      this.setState({ formdata: formdata, formType: "edit" });
    } else {
      this.setState({ formType: "add" });
    }
  };

  formUpdate = element => {
    const formdata = { ...this.state.formdata };
    const newElement = { ...formdata[element.id] };
    newElement.value = element.event.target.value;
    const validData = validate(newElement);
    newElement.valid = validData[0];
    newElement.validationMessage[1];
    formdata[element.id] = newElement;
    this.setState({
      formdata: formdata
    });
  };

  submitHander = event => {
    event.preventDefault();

    let dataToSubmit = {};
    let dataIsValid = true;

    for (let key in this.state.formdata) {
      dataToSubmit[key] = this.state.formdata[key].value;
      dataIsValid = this.state.formdata[key].valid && dataIsValid;
    }
    this.setState({ formSubmit: true });
    if (dataIsValid) {

      if (this.state.carId) {
        const model = {
          ...this.state.car,
          brand: { ...this.state.car.brand, name: dataToSubmit.brand },
          engine_volume: dataToSubmit.engine_volume,
          full_name: dataToSubmit.full_name,
          name: dataToSubmit.name,
          model_class: {
            ...this.state.car.model_class,
            name: dataToSubmit.model_class
          },
          rental: { ...this.state.car.rental, day_cost: dataToSubmit.rental }
        };

        // equality check: if no change the form wont be sent
        const postJSON = JSON.stringify(model);
        const getJSON = JSON.stringify(this.state.car);
        if (postJSON !== getJSON) {
          axios
            .patch(
              `https://api.rent-auto.biz.tm/info_models/${JSON.parse(
                model.id
              )}`,
              model,
              getToken()
            )
            .then(res => {
              console.log("success");
              console.log(res.data);
            });
        } else {
          return;
        }
      } 
      
      else {
        const newdata = {
          ...dataToSubmit
        };
        console.log(newdata);
      }
    } 
    
    else {
      console.log("select all the fields");
    }
  };

  render() {
    return (
      <AdminLayout>
        <div className="car_edit_container">
          <h2>{this.state.formType}</h2>
          <form
            onSubmit={event => this.submitHander(event)}
            className="car_edit_form"
          >
            {data.map((item, i) => (
              <FormField
                key={i}
                className="edit_car_formField"
                id={item.id}
                formdata={this.state.formdata[item.id]}
                change={element => this.formUpdate(element)}
                submit={this.state.formSubmit}
              />
            ))}

            <div className="label_success">{this.state.formSuccess}</div>
            {this.state.formError ? (
              <div className="label_error">
                что то пошло не так, повторите попытку
              </div>
            ) : (
              ""
            )}
            <button onClick={event => this.submitHander(event)}>
              {this.state.formType}
            </button>
          </form>
        </div>
      </AdminLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    email: state.email,
    token: state.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSubmitForm: data => dispatch(action.submit(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CarInfo);
