import axios from "axios";
import { getHeaders } from "../../../../UI/misc";
import { getTheName } from "./imageLoader";

export const replaceImage = (
  setState,
  id,
  name,
  img,
  getTheImages,
  submitForm,
  event,
  sendFile
) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(
        `https://srv.rent-auto.biz.tm/images/models/${id}/${name}`,
        getHeaders()
      )
      .then(res => {
        let data;

        getTheImages(setState, id, img, getTheName, sendFile).then(res => {
          let result;
          if (res.length > 0) {
            data = {
              name: res[0].name,
              selectedFile: `https://srv.rent-auto.biz.tm/images/models/${id}/${
                res[0].name
              }`
            };

            sendFile(data.selectedFile);
            submitForm(event);
            result = { name: data.name, isImage: true };
            resolve(result);
          } else {
            result = { name: "", isImage: false };
            sendFile("");
            resolve(result);
          }
        });
      });
  });
};
