import axios from "axios";
import { getHeaders } from "../../../../UI/misc";
import { getTheName, getTheImages } from "./imageLoader";

export const submitUpload = (setState, id, img, uploadedFile, sendSelectedFile) => {
  if (id && uploadedFile) {
   
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
       
        const newName = name.slice(0, -3);
        const selectedFile = res.config.url + "/" + newName + "jpeg";
       
        sendSelectedFile(selectedFile);
        setState({
          isLoading: false,
          isImage: true,
          uploadedFile: null
        });
     
        getTheImages(setState, id, selectedFile, getTheName, sendSelectedFile);
      });
  }
};
