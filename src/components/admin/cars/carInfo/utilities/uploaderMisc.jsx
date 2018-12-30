import axios from "axios";
import { getHeaders, makeNewObject } from "../../../../UI/misc";



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
