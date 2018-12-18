import React, { Component } from "react";
import FormField from "../../../../UI/formField";
import { updateField, updateRental } from "../utilities";
import "../carInfo.css";

class RentalItem extends Component {
  state = {
    formdata: {
      name: {
        element: "input",
        value: "",
        config: {
          label: "название тарифа",
          type: "text",
          name: "name"
        },
        validation: {
          required: true
        },
        valid: false,
        showLabel: true,
        validationMessage: ""
      },
      rate: {
        element: "input",
        value: "",
        config: {
          label: "коэфициент",
          type: "text",
          name: "rate"
        },
        validation: {
          required: true
        },
        valid: false,
        showLabel: true,
        validationMessage: ""
      }
    }
  };

  componentDidMount() {
    const item = { ...this.props.item };
    const formdata = { ...this.state.formdata };
    const form = updateRental(item, formdata);
    this.setState({ formdata: form });
  }

  fieldUpdate = element => {
    const formdata = { ...this.state.formdata };
    const form = updateField(element, formdata);
    this.setState({ formdata: form });
  };

  componentWillReceiveProps(nextProps) {
      console.log('componentWillReceiveProps')
      if( nextProps.submit === true){
        const dataToSubmit = { ...this.props.item };
            dataToSubmit["name"] = this.state.formdata.name.value;
            dataToSubmit["rate"] = this.state.formdata.rate.value;
        this.props.submitData(dataToSubmit)
          console.log(this.props.submit)
      }


    //   const dataToSubmit = { ...this.props.item };
    //     dataToSubmit["name"] = this.state.formdata.name.value;
    //     dataToSubmit["rate"] = this.state.formdata.rate.value;
    //   if(this.props.submit){
    //       this.props.submitData(dataToSubmit)
    //   }
    
  }

  render() {
    return (
      <div>
        <h3>Тариф range rate {this.props.item.id}</h3>
        <FormField
          className="edit_car_formField"
          id={"name"}
          formdata={this.state.formdata.name}
          change={element => this.fieldUpdate(element)}
        />
        <FormField
          className="edit_car_formField"
          id={"rate"}
          formdata={this.state.formdata.rate}
          change={element => this.fieldUpdate(element)}
        />
      </div>
    );
  }
}

export default RentalItem;
