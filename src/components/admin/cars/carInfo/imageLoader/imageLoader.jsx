import axios from "axios";
import { getHeaders, makeNewObject } from "../../../../UI/misc";

export const getTheImages = (setState, id, img, getTheName, sendFile) => {
  return new Promise((resolve, reject) => {
    let images = [];
    axios
      .get(`https://srv.rent-auto.biz.tm/images/models/${id}`, getHeaders())
      .then(res => {
        images = res.data.images;
        const listOfImages = makeNewObject(images, [], "filename");
        setState({ listOfImages });
        getTheName(id, listOfImages, img, setState);
        if (img === null) {
          const selectedFile = `https://srv.rent-auto.biz.tm/images/models/${id}/${
            listOfImages[0].name
          }`;
          sendFile(selectedFile);
          getTheName(id, listOfImages, img, setState);
        }

        resolve(listOfImages);
      });
  });
};

export const getTheName = (id, listOfImages, img, setState) => {
  let name;
  listOfImages.map(item => {
    if (
      `https://srv.rent-auto.biz.tm/images/models/${id}/${item.name}` === img
    ) {
      return (name = item.name);
    }
    return name;
  });

  setState({ name });
};
