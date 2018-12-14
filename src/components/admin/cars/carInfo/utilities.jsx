import {validate, getHeaders} from '../../../UI/misc';
import axios from 'axios'
// field initial update
export const updateFields = (car, formdata) => {
    for (let key in formdata) {
      switch (key) {
        case "link":
          formdata[key].value = car.link;
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
          formdata[key].value = "";
      }
    } 
    return formdata
  };
  
  // field update 
  export const updateField=(element, formdata)=>{
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
  }

  //submitForm

  export const formIsValid=(car, carId, formdata)=>{
    let dataToSubmit = {};
    let dataIsValid = true; 

    for (let key in formdata) {
      dataToSubmit[key] = formdata[key].value;
      dataIsValid = formdata[key].valid && dataIsValid;
    }    
    if (dataIsValid) {
      if (carId) {
        const model = {
          ...car,
          link: `https://srv.rent-auto.biz.tm/${formdata.link.value}`,
          brand: { ...car.brand, name: dataToSubmit.brand },
          engine_volume: dataToSubmit.engine_volume,
          full_name: dataToSubmit.full_name,
          name: dataToSubmit.name,
          model_class: {
            ...car.model_class,
            name: dataToSubmit.model_class
          },
          rental: { ...car.rental, day_cost: dataToSubmit.rental }
        };

        // check if the form has been modified ?
        const postJSON = JSON.stringify(model);
        const getJSON = JSON.stringify(car);
        if (postJSON !== getJSON) {
          axios
            .patch(
              `https://api.rent-auto.biz.tm/info_models/${JSON.parse(
                model.id
              )}`,
              model,
              getHeaders()
            )
            .then(res => {
              console.log("success");
              console.log(res.data);
            });
        } else {
          return;
        }
      } else {
        const newdata = {
          ...dataToSubmit
        };
        console.log(newdata);
      }
    } else {
      console.log("select all the fields");
    }
  }