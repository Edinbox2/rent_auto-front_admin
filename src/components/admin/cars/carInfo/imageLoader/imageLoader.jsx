import axios from "axios";
import { getHeaders, makeNewObject } from "../../../../UI/misc";

export const getTheImages = (setState, id, img, getTheName, sendFile) => {
  return new Promise((resolve, reject) => {
    console.log("получение изображений - старт");
    console.log("GET THE IMAGES id: ", id, " image: ", img);
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
        if (img === null) {
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
  console.log("GET THE NAME id: ", id, " image: ", img);
  let name;
  listOfImages.map(item => {
    if (
      `https://srv.rent-auto.biz.tm/images/models/${id}/${item.name}` === img
    ) {
      console.log("получение имени", item.name);
      return (name = item.name);
    }
    return name
  });
  console.log("имя компонента ", name);
  setState({ name });
};
