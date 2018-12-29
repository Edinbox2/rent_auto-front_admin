import axios from 'axios'
import {getHeaders} from '../../../../UI/misc'

export const replaceImage = (
    id, 
    name, 
    getTheImages, 
    submitForm, 
    event,
    selectedFile  
    ) => {
    axios
    .delete(
      `https://srv.rent-auto.biz.tm/images/models/${id}/${
        name
      }`,
      getHeaders()
    )
    .then((res) => {
      console.log('удаляем это изображение из базы: ', res)
      let data;
      console.log('изображение удалено из базы! 1. обновляем список')
      getTheImages(id).then(res => {
        console.log('получаем новый список ', res);
        let result;
        if(res.length >= 1){
          data = {
          name: res[0].name,
          selectedFile: `https://srv.rent-auto.biz.tm/images/models/${
            id
          }/${res[0].name}`
        };
        console.log('выбираем первый элемент списка и кладём его имя и сылку в data', data )
        console.log("отправляем ссылку на изображение в индекс", data.selectedFile);
        
        console.log("вызываем функцию соранить форму в индексе");
        selectedFile(data.selectedFile);
        submitForm(event);
        result = { name: data.name, selectedFile: data.selectedFile, isImage: true }
        return result;
        }else{
         // изображение удалено из базы, но ссылка на него всё еще назодится в api
         result = {name: '', selectedFile: '', isImage: false}
        return result
        }
        
      });
    });
}


export const submitUpload = (id, state, sendSelectedFile, getTheImages)=>{
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
            const result = { selectedFile: selectedFile, isLoading: false }
            return result;
          });
      }
}

export const getTheName = (id, listOfImages, img) => {
  console.log("получение имени изображения из списка: ", listOfImages);
  let name;
  listOfImages.map(item => {
    // ASSIGN THE NAME OF DISPLAYED IMAGE
    console.log("ссылка компонента ", img);
    if (
      `https://srv.rent-auto.biz.tm/images/models/${id}/${
        item.name
      }` === img
    ) {
      console.log("получение имени");
      return (name = item.name);
    }
  });
  console.log("имя компонента ", name);
  return name
};