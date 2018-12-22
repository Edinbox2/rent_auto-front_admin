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

export const populateFormRates=(array, formdata)=>{
  for(let key in formdata){
    for (let i in formdata[key]) {
      formdata[key][i].value = array[key][i].rate;
      formdata[key][i].valid = true;
    }  
  }    
  return formdata;
}

// UPDATE RENTAL
export const updateRental = (item, formdata) => {
  for (let key in formdata) {
    formdata[key].value = item[key];
    formdata[key].valid = true;
  }
  return formdata;
};

// FIELD UPDATE
export const updateField = (element, formdata, id) => {
  const newElement = { ...formdata[element.id] };
  if (element.id === "link") {
    newElement.value = `https://srv.rent-auto.biz.tm/images/models/${id}/${
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

//SUBMIT RATES FROM

export const formIsValidRates = (id, formdata, options) => {
  let dataIsValid = true;

  for(let key in formdata){
    for (let i in formdata[key]) {
      options[key][i].rate = formdata[key][i].value;
      dataIsValid = formdata[key][i].valid && dataIsValid;
    } 
  }
  
  if (dataIsValid) {
    const data = {
      id: id,
      ...{ ...options }
    };  
    axios
      .patch(
        `https://api.rent-auto.biz.tm/info_models/${id}`,
        data,
        getHeaders()
      )
      .then(res => {
        console.log(res.data);
      });
    console.log('form is valid')
    return true;
  } else {
    
    return false;
  }
};


//SUBMIT CAR FORM
export const formIsValid = (carId, formdata, uploadImage) => {
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
          const newCarId = res.data.id;

          uploadImage(newCarId);
        });
      return true;
    }
  } else {
    return false;
  }
};
