import axios from "axios";
import { getHeaders, makeNewObject } from "../../../../UI/misc";

// REQUEST THE LIST OF IMAGES
export const getTheImages = (setState, id, img, getTheName, sendFile) => {
  return new Promise((resolve, reject) => {
    console.log("получение изображений - старт");
    let images = [];
    axios
      .get(`https://srv.rent-auto.biz.tm/images/models/${id}`, getHeaders())
      .then(res => {
        images = res.data.images;
        const listOfImages = makeNewObject(images, [], "filename");
        setState({ listOfImages });
        console.log("изображения получены: ");
        console.log(listOfImages);
        console.log("получение имени изображения - начало");
        getTheName(id, listOfImages, img, setState);
        // TЕСЛИ ИМЯ ОТСУТСТВУЕТ, ПОЛУЧАЕ ИМЯ ТЕКУЩЕГО ИЗОБРАЖЕНИЯ
        if (img == null) {
          console.log(
            "у нас пустая ячейка для изображения - загружаем в нее первое из массива"
          );
          console.log("select the first image");
          console.log("пустое ли у нас имя? ");
          const selectedFile = `https://srv.rent-auto.biz.tm/images/models/${id}/${
            listOfImages[0].name
          }`;
          sendFile(selectedFile);
          getTheName(id, listOfImages, img, setState);
        }

        console.log(
          "возвращаем получаем список изображений в промисе ",
          listOfImages
        );
        resolve(listOfImages);
      });
  });
};

export const getTheName = (id, listOfImages, img, setState) => {
  console.log("получение имени изображения из списка: ", listOfImages);
  let name;
  listOfImages.map(item => {
    // ASSIGN THE NAME OF DISPLAYED IMAGE
    console.log("ссылка компонента ", img);
    if (
      `https://srv.rent-auto.biz.tm/images/models/${id}/${item.name}` === img
    ) {
      console.log("получение имени");
      return (name = item.name);
    }
  });
  console.log("имя компонента ", name);
  setState({ name });
};

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

export const submitUpload = (id, state, sendSelectedFile, getTheImages) => {
  if (id) {
    console.log("если есть id");
    const fd = new FormData();
    const name = state.uploadedFile.name;
    const data = state.uploadedFile;

    fd.append("file", data, name);
    axios
      .post(
        `https://srv.rent-auto.biz.tm/images/models/${id}`,
        fd,
        getHeaders()
      )
      .then(res => {
        console.log(
          "отправляем выбранное изображение на сервер и получаем: ",
          res
        );
        const newName = name.slice(0, -3);
        const selectedFile = res.config.url + "/" + newName + "jpeg";
        console.log(
          "создаём ссылку на новое изображение и присваиваем в state ",
          selectedFile
        );

        console.log("отправляем выбранное изображение в индекс");
        sendSelectedFile(state.selectedFile);
        console.log("обновляем список изображений");
        getTheImages(id);
        const result = { selectedFile: selectedFile, isLoading: false };
        return result;
      });
  }
};
