import React, { Component } from "react";
import axios from "axios";
import { getHeaders, makeNewObject } from "../../../UI/misc";
import CircularProgress from "@material-ui/core/CircularProgress";

class Uploader extends Component {
  state = {
    listOfImages: [],
    selectedFile: "",
    uploadedFile: null,
    isLoading: false,
    name: ""
  };

  // 1. первое изображение - из api
  // 2. получаем список изображений
  componentDidMount() {
    console.log("загрузка компонента - старт");
    const id = this.props.id;
    if (this.props.img) {
      console.log("изображение полученное ищ апи" + this.props.img);
      this.setState({ selectedFile: this.props.img });
    }
    if (id) {
      // 1. получаем список изображений
      // 2. устанавливаем соответствующее ему имя в селекте

      this.getTheImages(id);
    }
    console.log("загрузка компонента - конец");
  }

  // REQUEST THE LIST OF IMAGES
  getTheImages = id => {
    return new Promise((resolve, reject) => {
      console.log("получение изображений - старт");
      let images = [];
      axios
        .get(`https://srv.rent-auto.biz.tm/images/models/${id}`, getHeaders())
        .then(res => {
          images = res.data.images;
          const listOfImages = makeNewObject(images, [], "filename");
          this.setState({ listOfImages });
          console.log("изображения получены: ");
          console.log(listOfImages);
          console.log("получение имени изображения - начало");
          this.getTheName(this.state.listOfImages);
          // TЕСЛИ ИМЯ ОТСУТСТВУЕТ, ПОЛУЧАЕ ИМЯ ТЕКУЩЕГО ИЗОБРАЖЕНИЯ
          if (this.state.selectedFile == null) {
            console.log(
              "у нас пустая ячейка для изображения - загружаем в нее первое из массива"
            );
            console.log("select the first image");
            console.log("пустое ли у нас имя? ");
            console.log(this.state.name);
            const selectedFile = `https://srv.rent-auto.biz.tm/images/models/${id}/${
              listOfImages[0].name
            }`;
            this.setState({
              selectedFile
            });
            this.getTheName(this.state.listOfImages);
          }

          console.log(
            "возвращаем получаем список изображений в промисе ",
            listOfImages
          );
          resolve(listOfImages);
        });
    });
  };

  getTheName = listOfImages => {
    console.log("получение имени изображения из списка: ", listOfImages);
    let name;
    listOfImages.map(item => {
      // ASSIGN THE NAME OF DISPLAYED IMAGE
      console.log('ссылка компонента ', this.props.img)
      if (
        `https://srv.rent-auto.biz.tm/images/models/${this.props.id}/${
          item.name
        }` === this.props.img
      ) {
        console.log("получение имени");
        return name = item.name;
      }
    });
    console.log("имя компонента ", name);
    this.setState({ name });
    // this.setState({ name: data[0], selectedFile: data[1] });
  };

  getTheFirstImage = listOfImages => {
    // IF AFTER DELETING THERE WAS NO IMAGE UPLOADED - SELECT A DEFAULT FIRST IMAGE FROM THE ARRAY OF IMAGES
    const list = listOfImages;
    const selectedFile = `https://srv.rent-auto.biz.tm/images/models/${
      this.props.id
    }/${list[0].name}`;
    return [list[0].name, selectedFile];
  };

  upLoadFileHanlder = event => {
    console.log("выбор нового изображения - начало");
    this.setState({ uploadedFile: event.target.files[0] });
    if (!this.props.id) {
      console.log("нет id - отправка данных из upload в index");
      console.log(event.target.files[0]);
      this.props.uploadedFile(event.target.files[0]);
    }
  };

  submitUploadHandler = e => {
    console.log("загружаем новое изображение...");
    e.preventDefault();
    if (this.props.id) {
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
          this.setState({ selectedFile, isLoading: false });
          console.log("отправляем выбранное изображение в индекс");
          this.props.selectedFile(selectedFile);
          console.log("обновляем список изображений");
          this.getTheImages(this.props.id);
        });
    }
  };

  selectHandler = event => {
    const selectedFile = `https://srv.rent-auto.biz.tm/images/models/${
      this.props.id
    }/${event.target.value}`;
    this.setState({ selectedFile, name: event.target.value });
    this.props.selectedFile(selectedFile);
  };

  // DELETE THE IMAGE FROM THE STATE AND SERVER
  deleteImage = event => {
    
    this.setState({
      uploadedFile: null,
      selectedFile: null
    });
    console.log('обнулем state: ', this.state)
    console.log('обнуляем ссылку в индексе')
    this.props.selectedFile(this.state.selectedFile)
    // REMOVE THE IMAGE FROM THE SERVER
    axios
      .delete(
        `https://srv.rent-auto.biz.tm/images/models/${this.props.id}/${
          this.state.name
        }`,
        getHeaders()
      )
      .then((res) => {
        console.log('удаляем это изображение из базы: ', res)
        let data;
        console.log('изображение удалено из базы! 1. обновляем список')
        this.getTheImages(this.props.id).then(res => {
          console.log('получаем новый список ', res);
          data = {
            name: res[0].name,
            selectedFile: `https://srv.rent-auto.biz.tm/images/models/${
              this.props.id
            }/${res[0].name}`
          };
          console.log('выбираем первый элемент списка и кладём его имя и сылку в data', data )
          
          this.setState({ name: data.name, selectedFile: data.selectedFile });
          console.log("устанавливаем имя и ссылку в state: ", this.state);
          console.log("отправляем ссылку на изображение в индекс", data.selectedFile);
          this.props.selectedFile(data.selectedFile);
          console.log("вызываем функцию соранить форму в индексе");
          this.props.submitForm(event);
        });
      });
  };

  render() {
    // console.log("state: ", this.state);
    return (
      <div>
        {/* image */}
        {this.props.img ? (
          this.state.isLoading ? (
            <CircularProgress />
          ) : (
            <img
              style={{ width: "300px" }}
              src={this.state.selectedFile}
              alt="file name"
            />
          )
        ) : (
          <h4>выберите файл из списка</h4>
        )}

        {/* form with input and button */}
        <form onSubmit={e => this.submitUploadHandler(e)}>
          <input type="file" onChange={this.upLoadFileHanlder} />

          {this.props.id && this.state.uploadedFile ? (
            <button onClick={e => this.submitUploadHandler(e)}>
              Загрузить
            </button>
          ) : null}
        </form>
        <button onClick={event => this.deleteImage(event)}>удалить файл</button>

        {/* select with the list of images */}
        {this.props.id && this.state.listOfImages ? (
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
        ) : null}
      </div>
    );
  }
}

export default Uploader;
