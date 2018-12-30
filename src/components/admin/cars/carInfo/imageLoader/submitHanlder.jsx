import axios from 'axios'
import { getHeaders } from "../../../../UI/misc";
import {getTheName, getTheImages} from './imageLoader';

export const submitUpload = (setState, id, img, uploadedFile, sendSelectedFile) => {
  if (id && uploadedFile) {
    console.log("есть id, ", id, 'image:', img);
    const fd = new FormData();
    const name = uploadedFile.name;
    const data = uploadedFile;
    setState({ isLoading: true });
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
        sendSelectedFile(selectedFile);
        setState({
          isLoading: false,
          isImage: true,
          uploadedFile: null
        });
        console.log("отправляем выбранное изображение в индекс");
        console.log("обновляем список изображений");
        getTheImages(setState, id, selectedFile, getTheName, sendSelectedFile);
      });
  }
  };