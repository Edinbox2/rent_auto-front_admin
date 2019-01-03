import React, {Component} from "react";
import { Switch, Redirect, Route, withRouter } from "react-router-dom";
import SignIn from "./components/signIn/index";
import Dashboard from "./components/admin/dashboard";
import PrivateRoute from './components/authRoutes/privateRoute';
import PublicRoute from './components/authRoutes/publicRoute';
import Cars from './components/admin/cars';
import CarInfo from './components/admin/cars/carInfo';
import {connect} from 'react-redux';
import * as action from './store/actions/login';
import Logout from './components/authRoutes/logout';
import Options from './components/admin/options'

class Routes extends Component  {
  state={
    user: null
  }
  componentDidMount(){
      this.props.onTryAutoSignup()
  }

  static getDerivedStateFromProps(props, state){
    return state={
      user: localStorage.getItem('token') !== null
    }
  }
  
  render (){
    console.log(this.state.user)
  return (
    <div>
      <Switch>  
        <PrivateRoute {...this.props} user={this.state.user} path="/dashboard/add" exact component={CarInfo}/>
        <PrivateRoute {...this.props} user={this.state.user} path="/dashboard/options" exact component={Options}/>
        <PrivateRoute {...this.props} user={this.state.user} path="/dashboard/cars/:id" exact component={CarInfo}/>
        <PrivateRoute {...this.props} user={this.state.user} path="/dashboard/cars" exact component={Cars}/>
        <PrivateRoute {...this.props} user={this.state.user} path="/logout" exact component={Logout} />
        <PrivateRoute {...this.props} user={this.state.user} path="/dashboard" exact component={Dashboard}/>
        <PublicRoute {...this.props} user={this.state.user} path="/sign_in" restricted={true} exact component={SignIn} />
        {  <Route path="/" exact /> ? <Redirect to={this.state.user ? '/dashboard' : '/sign_in'}/> : null }  
      </Switch>
    </div>
  );
  }
};

// перезагружает state
const mapStateToProps = state => {
  return {
    user: state.login.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup:()=> dispatch(action.authCheckState())
  }
} 

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));
