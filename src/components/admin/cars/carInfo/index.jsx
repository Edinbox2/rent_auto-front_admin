import React, { Component } from "react";
import AdminLayout from "../../../hoc/adminLayout";
import FormField from "../../../UI/formField";
import "./carInfo.css";
import axios from "axios";
import { data } from "./data";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getHeaders, makeNewObject } from "../../../UI/misc";
import ImageUploader from "./uploader";
import { updateFields, updateField, formIsValid } from "./utilities";
import Rentals from "./rates/";

class CarInfo extends Component {
  state = {
    formType: "",
    file: null,
    isLoading: true,
    carId: null,
    car: [],
    uploadedFile: "",
    selectedFile: "",
    options: {
      brand: []
    },
    formSubmit: false,
    formError: false,
    formSuccess: "",
    formdata: {
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

    // CAR DATA
    if (id) {
      axios
        .get(`https://api.rent-auto.biz.tm/info_models`, getHeaders())
        .then(res => {
          let car;
          for (let key in res.data) {
            if (res.data[key].id == id) {
              car = res.data[key];
            }
          }
          if (car) {
            this.setState({ selectedFile: car.link });
          } else {
            this.setState({ selectedFile: "" });
          }
          this.setState({ car, carId: id, isLoading: false });

          //INITIAL TEXT FIELD UPDATE
          this.updateFormFields(car);
        });

      // SELECT ITEM - LIST OF IMAGES
    } else {
      this.updateFormFields();
      this.setState({ isLoading: false });
    }

    //BRANDS
    axios.get(`https://api.rent-auto.biz.tm/brands`, getHeaders()).then(res => {
      const brands = makeNewObject(res.data, [], "name");
      const options = { ...this.state.options };
      options.brand = [...brands];
      this.setState({ options });
    });
  }

  // INITIAL TEXT FIELD UPDATE
  updateFormFields = car => {
    const formdata = { ...this.state.formdata };
    if (car) {
      const form = updateFields(car, formdata);
      this.setState({ formdata: form, formType: "Редактировать" });
    } else {
      this.setState({ formType: "Создать" });
    }
  };

  // UPDATE THE TEXT FIELDS
  updateHandler = element => {
    const formdata = { ...this.state.formdata };
    const form = updateField(element, formdata, this.state.carId);
    this.setState({
      formdata: form
    });
  };

  // SUBMIT THE CAR INFO FORM
  submitHander = event => {
    event.preventDefault();
    const formdata = { ...this.state.formdata };
    let carId = this.state.carId;
    let isValid = formIsValid(
      carId,
      formdata,
      this.uploadImage,
      this.state.selectedFile
    );
    this.setState({ formSubmit: true });
    if (isValid) {
      if (this.state.formType === "Создать") {
        this.setState({ formSuccess: "готово!" });
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

  // UPLOAD AN IMAGE AT THE CREATE CAR OPTION
  uploadImage = (id, model) => {
    if (id) {
      if (this.state.uploadedFile) {
        const fd = new FormData();
        const image = this.state.uploadedFile.name;
        const data = this.state.uploadedFile;
        fd.append("file", data, image);
        axios
          .post(
            `https://srv.rent-auto.biz.tm/images/models/${id}`,
            fd,
            getHeaders()
          )
          .then(res => {
            const newName = this.state.uploadedFile.name.slice(0, -3);
            const selectedFile = res.config.url + "/" + newName + "jpeg";
            this.setState({ selectedFile });
            const obj = { ...model };
            obj["link"] = selectedFile;
            axios
              .patch(`https://api.rent-auto.biz.tm/models/${id}`, obj, getHeaders())
              .then(res => {
                this.props.history.push("/dashboard/cars");
              });
          });
      }
    }
  };

  // SELECT A PICTURE TO UPLOAD
  uploadedFile = file => {
    this.setState({ uploadedFile: file });
  };

  selectedFile = file => {
    this.setState({ selectedFile: file });

  };

  resetImage=()=>{
    this.setState({uploadImage: '', selectedFile: ''})
  }

  render() {
  console.log("ссылка на изображение в индексе" + this.state.selectedFile)
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
              img={this.state.selectedFile}
              selectedFile={file => this.selectedFile(file)}
              uploadedFile={this.uploadedFile}
              resetImage={()=>this.resetImage()}
              submitForm={(event)=>this.submitHander(event)}
              
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
                Применить
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
