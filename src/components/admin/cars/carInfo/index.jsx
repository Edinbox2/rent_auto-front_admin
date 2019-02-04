import React, { Component } from "react";
import AdminLayout from "../../../hoc/adminLayout";
import FormField from "../../../UI/formField";
import "./carInfo.css";
import { data, formdata } from "./data";
import CircularProgress from "@material-ui/core/CircularProgress";
import ImageUploader from "./imageLoader/uploader";
import { updateFields, updateField, 
  formIsValid, autoUploadImage, 
  getCarData, getBrands, submitFrom } from "./utilities";
import Rentals from "./rates/";
import {FormattedMessage} from 'react-intl'; 

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
    formdata: null
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    getCarData(this.stateHandler, id, this.updateFormFields )
    getBrands(this.stateHandler, this.state.options) 
    this.setState({
      formdata
    })  
  }

  stateHandler=(...args)=>{
    this.setState(...args)
  }

  // INITIAL TEXT FIELD UPDATE
  updateFormFields = car => {
    const formdata = { ...this.state.formdata };
    if (car) {
      const form = updateFields(car, formdata);
      this.setState({ formdata: form, formType: "Edit" });
    } else {
      this.setState({ formType: "Add" });
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
      this.stateHandler,
      carId,
      formdata,
      autoUploadImage,
      this.state.selectedFile, this.state.uploadedFile, 
      this.props.history
    );
    submitFrom(this.stateHandler, isValid, this.state.formType)
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
                <FormattedMessage
                id="error"
                defaultMessage="something went wrong, try again"
                />                  
                </div>
              ) : null}
              <button onClick={event => this.submitHander(event)}>
              <FormattedMessage
                id="apply.btn"
                defaultMessage="Apply"
                />     
              </button>
            </form>
            {this.state.formType === "Edit" ? (
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
