import React, { Component } from "react";
import AdminLayout from "../../../hoc/adminLayout";
import FormField from "../../../UI/formField";
import "./carInfo.css";
import axios from "axios";
import { data } from "./data";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getHeaders, makeNewObject } from "../../../UI/misc";
import ImageUploader from "./imageUploader";
import { updateFields, updateField } from "./utilities";
import Rentals from "./rates/rental";

class CarInfo extends Component {
  state = {
    formType: "",
    file: null,
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
        valid: false,
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
        valid: false,
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
        valid: false,
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
        valid: false,
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
        valid: false,
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
        valid: false,
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
        valid: false,
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
          required: false
        },
        valid: true,
        validationMessage: "",
        showLabel: true
      }
    }
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    axios
      .get(`https://api.rent-auto.biz.tm/info_models`, getHeaders())
      .then(res => {
        let car;
        for (let key in res.data) {
          if (res.data[key].id == id) {
            car = res.data[key];
          }
        }
        this.setState({ car, carId: id, isLoading: false });
        this.updateFormFields(car);
      });

    this.getTheImages(id);

    axios.get(`https://api.rent-auto.biz.tm/brands`, getHeaders()).then(res => {
      const brands = makeNewObject(res.data, [], "name");
      const options = { ...this.state.options };
      options.brand = [...brands];
      this.setState({ options });
    });
  }

  getTheImages = id => {
    let images = [];
    axios
      .get(
        `${
          id
            ? `https://srv.rent-auto.biz.tm/images/models/${id}}`
            : `https://srv.rent-auto.biz.tm/images`
        }`,
        getHeaders()
      )
      .then(res => {
        images = res.data.images;
        const links = makeNewObject(images, [], "filename");
        const options = { ...this.state.options };
        options.link = [...links];
        this.setState({ options });
      });
  };

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


  formIsValid = (carId, formdata) => {
    let dataToSubmit = {};
    let dataIsValid = true;
    for (let key in formdata) {
      dataToSubmit[key] = formdata[key].value;
      dataIsValid = formdata[key].valid && dataIsValid;
    }
    if (dataIsValid) {
      let model;
      
      if (carId) {
        model = {
          id: carId,
          name: dataToSubmit.name,
          link: dataToSubmit.link,
          style: dataToSubmit.style,
          engine_volume: dataToSubmit.engine_volume,
          note: dataToSubmit.note,
          model_class: { id: carId, name: dataToSubmit.model_class },
          brand: { name: dataToSubmit.brand },
          rentals: [{ id: carId, day_cost: dataToSubmit.rental }]
        };
  
        axios
          .patch(
            `https://api.rent-auto.biz.tm/models/${model.id}`,
            model,
            getHeaders()
          )
          .then(res => {});
      } else {
        model = {
          name: dataToSubmit.name,
          link: dataToSubmit.link,
          style: dataToSubmit.style,
          engine_volume: dataToSubmit.engine_volume,
          note: dataToSubmit.note,
          model_class: { name: dataToSubmit.model_class },
          brand: { name: dataToSubmit.brand },
          rentals: [{ day_cost: dataToSubmit.rental }]
        };
        
        axios
          .post(`https://api.rent-auto.biz.tm/models`, model, getHeaders())
          .then(res => {
            
            const newCarId = res.data.id
           
            this.uploadImage(newCarId)
          });
          return true 
      }      
    } else {
      return false;
    }
  };

  submitHander = event => {
    event.preventDefault();
    const formdata = { ...this.state.formdata };
    let carId = this.state.carId;
    let isValid = this.formIsValid(carId, formdata);
    this.setState({ formSubmit: true });
    if (isValid) {
      if (this.state.formType === "Создать") {
        this.setState({ formSuccess: "готово!" });
        setTimeout(() => {
          // this.props.history.push("/dashboard/cars");
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

  
  uploadImage=(id)=>{
    if (id) {
    const fd = new FormData();
    const image = this.state.file.name;
    const data = this.state.file;
    fd.append("file", data, image);
    axios
      .post(
        `https://srv.rent-auto.biz.tm/images/models/${id}`,
        fd,
        getHeaders()
      )
      .then(res => {});
  }
  }
  updateFile=(file)=>{
   
    this.setState({file})
  }

  render() {
    console.log(this.state.carId)
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
              updateFile={(file)=>this.updateFile(file)}
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
            {this.state.formType === "Редактировать" ? (
              <div className="rentals">
                <Rentals id={this.state.carId} />
              </div>
            ) : null}
          </div>
        )}
      </AdminLayout>
    );
  }
}

export default CarInfo;
