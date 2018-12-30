import axios from "axios";
import { getHeaders } from "../../../../UI/misc";
import {getTheName} from './imageLoader'

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
    console.log("replace image start");
    axios
      .delete(
        `https://srv.rent-auto.biz.tm/images/models/${id}/${name}`,
        getHeaders()
      )
      .then(res => {
        console.log("удаляем это изображение из базы: ", res);
        let data;
        console.log("изображение удалено из базы! 1. обновляем список");
        getTheImages(setState, id, img, getTheName, sendFile).then(res => {
          console.log("получаем новый список ", res);
          let result;
          if (res.length > 0) {
            data = {
              name: res[0].name,
              selectedFile: `https://srv.rent-auto.biz.tm/images/models/${id}/${
                res[0].name
              }`
            };
            console.log(
              "выбираем первый элемент списка и кладём его имя и сылку в data",
              data
            );
            console.log(
              "отправляем ссылку на изображение в индекс",
              data.selectedFile
            );

            console.log("вызываем функцию соранить форму в индексе");
            sendFile(data.selectedFile);
            submitForm(event);
            result = { name: data.name, isImage: true };
            resolve(result);
          } else {
            // изображение удалено из базы, но ссылка на него всё еще находится в api
            result = { name: "", isImage: false };
            sendFile("");
            resolve(result);
          }
        });
      });
  });
};
