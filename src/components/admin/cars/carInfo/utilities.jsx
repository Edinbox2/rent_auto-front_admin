import { validate, getHeaders } from "../../../UI/misc";
import axios from "axios";

// FIELD INITIAL UPDATE
export const updateFields = (car, formdata) => {
  for (let key in formdata) {
    switch (key) {
      case "link":
        formdata[key].value = car.link;
        break;
      case "name":
        formdata[key].value = car.name;
        break;
      case "note":
        formdata[key].value = car.note;
        break;
      case "style":
        formdata[key].value = car.style;
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
        formdata[key].value = "";
    }
  }
  return formdata;
};

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
  newElement.validationMessage[1];
  formdata[element.id] = newElement;
  return formdata;
};

//SUBMIT FORM
export const formIsValid = (car, carId, formdata) => {
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
        .then(res => {
          console.log("success");
          console.log(res.data);
        });
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
          console.log(res);
        });
      console.log("sent");
    }
  } else {
    console.log("select all the fields");
  }
};
