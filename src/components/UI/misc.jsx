//VALIDATION
export const validate = element => {
  let error = [true, ""];

  if (element.validation.email) {
    const valid = /\S+@\S+\.\S+/.test(element.value);
    const message = !valid ? "enter you email" : "";
    error = !valid ? [valid, message] : error;
  }

  if (element.validation.required) {
    const valid = element.value.trim() !== "";
    const message = !valid ? "this field is required" : "";
    error = !valid ? [valid, message] : error;
  }

  return error;
};

//ID MATCH UP VALIDATION
export const idValidation = (list, data) => {
  let valid = true;
  for (let i = 0; i < list.length; i++) {
    if (data.id === list[i].id) {
      valid = false;
    }
  }
  return valid;
};

//HEADERS
export const getHeaders = () => {
  const token = localStorage.getItem("token");
  const email = "unknown@unknown";
  const headers = {
    headers: { "X-USER-TOKEN": token, "X-USER-EMAIL": email }
  };
  return headers;
};

// new ID
export const nextId = data => {
  let idArray = [];
  for (let key in data) {
    idArray.push(data[key].id);
  }
  let min = idArray[0];
  let max = min;
  for (let i = 0; i < idArray.length; ++i) {
    if (idArray[i] > max) max = idArray[i];
    if (idArray[i] < min) min = idArray[i];
  }
  return max + 1;
};

//make new object
export const makeNewObject = (arr, newArr, name) => {
  arr.forEach(key => {
    if(name === "filename") {
      newArr.push({
        name: key[name],
        path: key["path"],
        id: key['resource_id']
      });
    }else {
      newArr.push({
        name: key[name],
        id: key["id"]
      });
    }
      
  });
  return newArr;
};
