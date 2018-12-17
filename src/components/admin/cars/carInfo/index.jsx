import React, { Component } from "react";
import AdminLayout from "../../../hoc/adminLayout";
import FormField from "../../../UI/formField";
import "./carInfo.css";
import axios from "axios";
import { data } from "./data";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getHeaders, makeNewObject } from "../../../UI/misc";
import ImageUploader from "./imageUploader";
import { updateFields, updateField, formIsValid } from "./utilities";

class CarInfo extends Component {
  state = {
    formType: "",
    isLoading: true,
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
          type: "number",
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
        element: "textarea",
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
        this.setState({ car, carId: id, isLoading: false });
        this.updateFormFields(car);
      });

    axios.get(`https://srv.rent-auto.biz.tm/images`, getHeaders()).then(res => {
      const id = this.props.match.params.id;
      let images = [];
      if (id) {
        images = res.data.images.filter(key => {
          if (key.resource_id == id) {
            return true;
          } else {
            return false;
          }
        });
      } else {
        images = res.data.images;
      }
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

  updateFormFields = car => {
    const formdata = { ...this.state.formdata };
    if (car) {
      const form = updateFields(car, formdata);
      this.setState({ formdata: form, formType: "Редактировать" });
    } else {
      this.setState({ formType: "Создать" });
    }
  };

  updateHandler = element => {
    const formdata = { ...this.state.formdata };
    const form = updateField(element, formdata);
    this.setState({
      formdata: form
    });
  };

  submitHander = event => {
    event.preventDefault();
    const formdata = { ...this.state.formdata };
    const carId = this.state.carId;
    let isValid = formIsValid(carId, formdata);
    this.setState({ formSubmit: true });
    if (isValid) {
      if (this.state.formType === "Создать") {
        this.setState({ formSuccess: "готово!" });
        setTimeout(() => {
          this.props.history.push("/dashboard/cars");
        }, 1000);
      } else {
        this.setState({
          formSuccess: "изменения сохранены!",
          formError: false
        });
        setTimeout(() => {
          this.setState({ formSuccess: "" });
        }, 1000);
      }
    } else {
      this.setState({ formError: true });
    }
  };

  render() {
    return (
      <AdminLayout>
        {this.state.isLoading ? (
          <div className="progress_cars">
            <CircularProgress thikness={5} style={{ color: "lightblue" }} />
          </div>
        ) : (
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
              ) : null}
              <button onClick={event => this.submitHander(event)}>
                {this.state.formType}
              </button>
            </form>
          </div>
        )}
      </AdminLayout>
    );
  }
}


export default CarInfo;
