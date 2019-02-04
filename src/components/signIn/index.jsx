  import React, { Component } from "react";
import FormField from "../UI/formField";
import "./signin.css";
import { validate } from "../UI/misc";
import * as actions from '../../store/actions/login';
import {connect} from 'react-redux'; 
import {FormattedMessage} from 'react-intl';

class SignIn extends Component {
  state = {
    formError: false,
    formSuccess: "",
    formSubmit: false,
    formdata: {
      email: {
        element: "input",
        value: "",
        config: {
          placeholder: "Enter your email",
          type: "email",
          name: "email_input"
        },
        validation: {
          required: true,
          email: false
        },
        valid: false,
        validationMessage: ""
      },
      password: {
        element: "input",
        value: "",
        config: {
          placeholder: "Enter your password",
          type: "password",
          name: "password_input"
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ""
      }
    }
  };
  

  updateForm = element => {
    const formdata = { ...this.state.formdata };
    const formElement = { ...formdata[element.id] };
    formElement.value = element.event.target.value;
   
    let validData = validate(formElement); 
    formElement.valid = validData[0]; 
    formElement.validationMessage = validData[1]; 
    formdata[element.id] = formElement;
    this.setState({ formdata: formdata, formError: false });
  };

  submitForm = event => {
    event.preventDefault();

    this.props.onAuth(this.state.formdata.email.value, this.state.formdata.password.value)

  };

  render() {
    return (
      <div className="container">
        <div className="signin_wrapper">
          <form
            onSubmit={event => this.submitForm(event)}
            className="registration_form"
          >
            <h2>
              <FormattedMessage
              id="singIn.singIn"
              defaultMessage="Sign in"
              />
              </h2>
            <div>
              <FormField
                id={"email"}
                className="registration_field"
                formdata={this.state.formdata.email}
                change={element => this.updateForm(element)}   
                submit={this.state.formSubmit}
              />
              <FormField
                id={"password"}
                className="registration_field"
                formdata={this.state.formdata.password}
                change={element => this.updateForm(element)}
                submit={this.state.formSubmit}
              />
              {this.state.formError ? (
                <div className="error_label">
                   <FormattedMessage
              id="singIn.error"
              defaultMessage="Something went wrong"
              />
                </div>
              ) : null}
              <div className="success_label">{this.state.formSuccess}</div>
              <button onClick={event => this.submitForm(event)}>
              <FormattedMessage
              id="signIn.button"
              defaultMessage="Sign in"
              />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password) => dispatch(actions.auth(email, password))
  }
}

export default connect(null, mapDispatchToProps)(SignIn);
