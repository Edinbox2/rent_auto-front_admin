import React, { Component } from "react";
import AdminLayout from "../../../hoc/adminLayout";
import FormField from "../../../UI/formField";
import "./carInfo.css";
import axios from "axios";
import { data } from "./data";
import { connect } from "react-redux";
import { getHeaders, makeNewObject } from "../../../UI/misc";
import * as action from "../../../../store/actions/edit";
import ImageUploader from "./imageUploader";
import {updateFields, updateField, formIsValid} from './utilities'; 
 
class CarInfo extends Component {
  state = {
    formType: "",
    carId: "",
    car: [],
    options: {
      link: [],
      brand: []
    },
    formSubmit: false,
    formError: false,
    formSuccess: "",
    formdata: {
      link: {
        value: "",
        element: "select",
        config: {
          name: "link",
          label: "Модели"
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
      style: {
        value: "",
        element: "input",
        config: {
          name: "style",
          type: "text",
          label: "Стиль"
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
        element: "select",
        config: {
          name: "brand",
          label: "Бренд"
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
          type: "number",
          label: "Объём двигателя модели"
        },
        validation: {
          required: true
        },
        valid: true,
        validationMessage: "",
        showLabel: true
      },
      note: {
        value: "",
        element: "input",
        config: {
          name: "note",
          type: "text",
          label: "Описание"
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
    axios
      .get(`https://api.rent-auto.biz.tm/info_models`, getHeaders())
      .then(res => {
        const id = this.props.match.params.id;
        let car;
        for (let key in res.data) {
          if (res.data[key].id == id) {
            car = res.data[key];
          }
        }
        this.setState({ car, carId: id });
        this.updateFormFields(car);
      });

    axios.get(`https://srv.rent-auto.biz.tm/images`, getHeaders()).then(res => {
      const id = this.props.match.params.id;
      let images =[];
      if(id){
        images = res.data.images.filter(key => {
        if (key.resource_id == id) {
          return true;
        } else {
          return false;
        }
      });
      }else{
        images = res.data.images
      } 
      console.log(images)
      const links = makeNewObject(images, [], "path");
      const options = { ...this.state.options };
      options.link = [...links];
      this.setState({ options });
    });

    axios.get(`https://api.rent-auto.biz.tm/brands`, getHeaders()).then(res => {
      const brands = makeNewObject(res.data, [], "name");
      const options = { ...this.state.options };
      options.brand = [...brands];
      this.setState({ options });
    });
  }

  updateFormFields = (car) => {
    const formdata = {...this.state.formdata}
    if (car) {
      const form = updateFields(car, formdata)
      this.setState({ formdata: form, formType: "edit" });
    } else {      
      this.setState({ formType: "add" });
    }
  };

  updateHandler = element => {
    const formdata = { ...this.state.formdata };
    const form = updateField(element, formdata )
    this.setState({
      formdata: form
    });
  };

  submitHander = event => {
    event.preventDefault();
    const formdata = {...this.state.formdata}
    const car = this.state.car
    const carId = this.state.carId
    formIsValid(car, carId, formdata)
    this.setState({ formSubmit: true });
  };

  render() {
    return (
      <AdminLayout>
        <div className="car_edit_container">
          <h2>{this.state.formType}</h2>
          <ImageUploader
            id={this.state.carId}
            img={this.state.formdata.link.value}
          />        
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
                change={element => this.updateHandler(element)}
                submit={this.state.formSubmit}
                options={this.state.options[item.id]}
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
