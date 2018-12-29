import React, { Component } from "react";
import axios from "axios";
import { getHeaders } from "../../../UI/misc";
import CircularProgress from "@material-ui/core/CircularProgress";
import { replaceImage, getTheName, getTheImages } from "./utilities/uploaderMisc";

class Uploader extends Component {
  state = {
    listOfImages: [],
    isImage: true,
    uploadedFile: null,
    isLoading: false,
    name: "",
    componentIsLoaded: false
  };
  

  // 1. первое изображение - из api
  // 2. получаем список изображений
  componentDidMount() {
    console.log("загрузка компонента - старт");
    const id = this.props.id;
    if (id) {
      // 1. получаем список изображений
      // 2. устанавливаем соответствующее ему имя в селекте

      getTheImages(this.stateHandler, id, 
        this.props.img, getTheName, 
          this.props.selectedFile, this.props.selectedFile);
      if (this.state.listOfImages.length < 1) {
        this.setState({ isImage: false });
      }
    }
    console.log("загрузка компонента - конец");
    if (this.state) {
      this.setState({ componentIsLoaded: true });
    }
  }

  stateHandler = (...arg)=>{
    this.setState(...arg)
    console.log('statehandler', this.state)
  }


  upLoadHanlder = event => {
    console.log("выбор нового изображения - начало");    
    this.stateHandler({ uploadedFile: event.target.files[0] });
    if (!this.props.id) {
      console.log("нет id - отправка данных из upload в index");
      console.log(event.target.files[0]);
      this.props.uploadedFile(event.target.files[0]);
    }
  };

  submitUploadHandler = e => {
    console.log("загружаем новое изображение...");
    e.preventDefault();
    if (this.props.id && this.state.uploadedFile) {
      console.log("если есть id");
      const fd = new FormData();
      const name = this.state.uploadedFile.name;
      const data = this.state.uploadedFile;
      this.setState({ isLoading: true });
      fd.append("file", data, name);
      axios
        .post(
          `https://srv.rent-auto.biz.tm/images/models/${this.props.id}`,
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
          this.props.selectedFile(selectedFile);
          this.setState({
            isLoading: false,
            isImage: true,
            uploadedFile: null
          });
          console.log("отправляем выбранное изображение в индекс");
          console.log("обновляем список изображений");
          getTheImages(this.stateHandler, this.props.id, 
            this.props.img, getTheName, 
              this.props.selectedFile, this.props.selectedFile);
        });
    }
  };

  selectHandler = event => {
    const selectedFile = `https://srv.rent-auto.biz.tm/images/models/${
      this.props.id
    }/${event.target.value}`;
    this.props.selectedFile(selectedFile);
    this.setState({ name: event.target.value });
  };

  
  deleteImage = event => {
    console.log("УДАЛЕНИЕ");
    this.setState({
      uploadedFile: null,
      name: ""
    });
    console.log("обнулем state: ", this.state);
    console.log("ЗАПУСКАЕМ REPLACEIMAGE");
    replaceImage(
      this.stateHandler,
      this.props.id,
      this.state.name,
      this.props.img,
      getTheImages,
      this.props.submitForm,
      event,
      this.props.selectedFile
    ).then(res => {
      this.setState({ name: res.name, isImage: res.isImage });
    });
  };

  render() {
    console.log("state: ", this.state);
    return (
      <div>
        {this.state.componentIsLoaded ? (
          <div>
            {/* image */}
            {this.props.img && this.state.listOfImages.length > 0 ? (
              this.state.isLoading ? (
                <CircularProgress />
              ) : (
                <img
                  style={{ width: "300px" }}
                  src={this.props.img}
                  alt="file name"
                />
              )
            ) : (
              <h4>выберите файл из списка</h4>
            )}

            {/* form with input and button */}
            <form onSubmit={e => this.submitUploadHandler(e)}>
              <input type="file" onChange={this.upLoadHanlder} />

              {this.props.id && this.state.uploadedFile ? (
                <button onClick={e => this.submitUploadHandler(e)}>
                  Загрузить
                </button>
              ) : null}
              {this.props.id && this.state.listOfImages.length > 0 ? (
                <div>
                  <button onClick={event => this.deleteImage(event)}>
                    удалить файл
                  </button>
                  <select
                    value={this.state.name}
                    onChange={event => this.selectHandler(event)}
                  >
                    {/* <option value={this.state.name}>{this.state.name}</option> */}
                    {this.state.listOfImages
                      ? this.state.listOfImages.map((item, index) => (
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        ))
                      : null}
                  </select>
                </div>
              ) : null}
            </form>
          </div>
        ) : (
          <CircularProgress />
        )}
      </div>
    );
  }
}

export default Uploader;
