import React, { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { submitUpload } from "./submitHanlder";
import { getTheImages, getTheName } from "./imageLoader";
import { replaceImage } from "./deleteHandler";
import { Button, Select } from "./UI";

class Uploader extends Component {
  state = {
    listOfImages: [],
    isImage: true,
    uploadedFile: null,
    isLoading: false,
    name: "",
    componentIsLoaded: false
  };

  componentDidMount() {
    console.log("загрузка компонента - старт");
    const id = this.props.id;
    if (id) {
      getTheImages(
        this.stateHandler,
        id,
        this.props.img,
        getTheName,
        this.props.selectedFile,
        this.props.selectedFile
      );
      if (this.state.listOfImages.length < 1) {
        this.setState({ isImage: false });
      }
    }
    console.log("загрузка компонента - конец");
    if (this.state) {
      this.setState({ componentIsLoaded: true });
    }
  }

  stateHandler = (...arg) => {
    this.setState(...arg);
  };

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
    submitUpload(
      this.stateHandler,
      this.props.id,
      this.props.img,
      this.state.uploadedFile,
      this.props.selectedFile
    );
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
                <Button clicked={e => this.submitUploadHandler(e)}>
                  Загрузить
                </Button>
              ) : null}
              {this.props.id && this.state.listOfImages.length > 0 ? (
                <div>
                  <Button clicked={event => this.deleteImage(event)}>
                    удалить файл
                  </Button>
                  <Select
                    name={this.state.name}
                    listOfImages={this.state.listOfImages}
                    changed={event => this.selectHandler(event)}
                  />
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
