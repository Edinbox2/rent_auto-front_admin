import { validate, getHeaders } from "../../../UI/misc";
import axios from "axios";

// FIELD INITIAL UPDATE
export const updateFields = (car, formdata) => {
  for (let key in formdata) {
    formdata[key].value = car[key];
    if (key === "brand" || key === "model_class") {
      formdata[key].value = car[key].name;
    }
    if (key === "rental") {
      formdata[key].value = car[key].day_cost;
    }
    formdata[key].valid = true;
  }
  return formdata;
};

export const updateRental = (item, formdata)=>{
  for(let key in formdata){
    formdata[key].value = item[key]
    formdata[key].valid = true
  }
  return formdata; 
}

// FIELD UPDATE
export const updateField = (element, formdata) => {
  const newElement = { ...formdata[element.id] };
  if (element.id === "link") {
    newElement.value = `https://srv.rent-auto.biz.tm/${
      element.event.target.value
    }`;
  } else {
    newElement.value = element.event.target.value;
  }
  const validData = validate(newElement);
  newElement.valid = validData[0];
  newElement.validationMessage = validData[1];
  formdata[element.id] = newElement;
  return formdata;
};

//SUBMIT FORM
export const formIsValid = (carId, formdata) => {
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
        .then(res => {});
    }
    return true;
  } else {
    return false;
  }
};
