import { validate, getHeaders, makeNewObject } from "../../../UI/misc";

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

export const populateFormRates = (array, formdata) => {
  for (let key in formdata) {
    for (let i in formdata[key]) {
      formdata[key][i].value = array[key][i].rate;
      formdata[key][i].valid = true;
    }
  }
  return formdata;
};

// UPDATE RENTAL
export const updateRental = (item, formdata) => {
  for (let key in formdata) {
    formdata[key].value = item[key];
    formdata[key].valid = true;
  }
  return formdata;
};

// FIELD UPDATE
export const updateField = (element, formdata, id, images) => {
  const newElement = { ...formdata[element.id] };
  newElement.value = element.event.target.value;
  const validData = validate(newElement);
  newElement.valid = validData[0];
  newElement.validationMessage = validData[1];
  formdata[element.id] = newElement;
  return formdata;
};

// SUBMIT RATES FROM
export const formIsValidRates = (id, formdata, options) => {
  let dataIsValid = true;

  for (let key in formdata) {
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
      .then(res => {});

    return true;
  } else {
    return false;
  }
};

// SUBMIT CAR FORM
export const formIsValid = (
  setState,
  id,
  formdata,
  autoUploadImage,
  selectedFile,
  uploadedFile,
  history
) => {
  let dataToSubmit = {};
  let dataIsValid = true;
  for (let key in formdata) {
    dataToSubmit[key] = formdata[key].value;
    dataIsValid = formdata[key].valid && dataIsValid;
  }

  if (dataIsValid) {
    let model;

    if (id) {
      model = {
        id: id,
        name: dataToSubmit.name,
        link: selectedFile,
        style: dataToSubmit.style,
        engine_volume: dataToSubmit.engine_volume,
        note: dataToSubmit.note,
        model_class: { id: id, name: dataToSubmit.model_class },
        brand: { name: dataToSubmit.brand },
        rentals: [{ id: id, day_cost: dataToSubmit.rental }]
      };

      axios
        .patch(`https://api.rent-auto.biz.tm/models/${id}`, model, getHeaders())
        .then(res => {});
      return true;
    } else {
      model = {
        name: dataToSubmit.name,
        link: selectedFile,
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
          autoUploadImage(setState, newCarId, model, uploadedFile, history);
        });
      return true;
    }
  } else {
    return false;
  }
};

// CARUPLOADIMAGE
export const autoUploadImage = (setState, id, model, uploadedFile, history) => {
  if (uploadedFile) {
    const fd = new FormData();
    const image = uploadedFile.name;
    const data = uploadedFile;
    fd.append("file", data, image);
    setState({ isLoading: true });
    axios
      .post(
        `https://srv.rent-auto.biz.tm/images/models/${id}`,
        fd,
        getHeaders()
      )
      .then(res => {
        const newName = uploadedFile.name.slice(0, -3);
        const selectedFile = res.config.url + "/" + newName + "jpeg";
        setState({ selectedFile });
        const obj = { ...model };
        obj["link"] = selectedFile;
        axios
          .patch(`https://api.rent-auto.biz.tm/models/${id}`, obj, getHeaders())
          .then(() => {
            history.push("/dashboard/cars");
            setState({ isLoading: false });
          });
      });
  }
};

// CAR DATA
export const getCarData = (setState, id, updateFormFields) => {
  if (id) {
    axios
      .get(`https://api.rent-auto.biz.tm/info_models`, getHeaders())
      .then(res => {
        let car;
        for (let key in res.data) {
          if (res.data[key].id === Number(id)) {
            car = res.data[key];
          }
        }
        if (car) {
          setState({ selectedFile: car.link });
        } else {
          setState({ selectedFile: "" });
        }
        setState({ car, carId: id, isLoading: false });

        //INITIAL TEXT FIELD UPDATE
        updateFormFields(car);
      });

    // SELECT ITEM - LIST OF IMAGES
  } else {
    updateFormFields();
    setState({ isLoading: false });
  }
};

// GET THE BRANDS
export const getBrands = (setState, stateOptions) => {
  axios.get(`https://api.rent-auto.biz.tm/brands`, getHeaders()).then(res => {
    const brands = makeNewObject(res.data, [], "name");
    const options = { ...stateOptions };
    options.brand = [...brands];
    setState({ options });
  });
};


export const submitFrom=(setState, isValid, formType)=>{
  setState({ formSubmit: true });
  if (isValid) {
    if (formType === "Создать") {
      setState({ formSuccess: "готово!" });
      
    } else {
      setState({
        formSuccess: "изменения сохранены!",
        formError: false
      });
      setTimeout(() => {
        setState({ formSuccess: "" });
      }, 1000);
    }
  } else {
    setState({ formError: true });
  }
}