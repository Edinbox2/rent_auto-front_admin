import * as actionType from './actionTypes';
import axios from 'axios';

export const authStart = ()=>{
    return {
        type: actionType.AUTH_START
    }
}

export const authSuccess = (idToken, email)=>{
    return {
        type: actionType.AUTH_SUCCESS,
        idToken: idToken, 
        email: email
    }
}

export const authFail = (error) =>{
    return {
        type: actionType.AUTH_FAIL,
        error: error
    }
}

export const logout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate')
    return {
        type: actionType.AUTH_LOGOUT
    }
}

export const checkAuthTimeout=(expirationTime)=>{
    return dispatch=>{
        setTimeout(()=>{
            dispatch(logout());
        }, expirationTime * 1000)
    }
}

export const auth = (email, password) =>{
    return dispatch=>{
        dispatch(authStart());
        const authData = {
            user:{
               email: email, 
            password: password,  
            }
        }
      
        axios.post('https://api.rent-auto.biz.tm/auth/sign_in', authData)
        .then( response => { 
            console.log(response)
            const expirationTime = 3600;
            const expiresIn = new Date(new Date().getTime() + expirationTime * 1000)
            localStorage.setItem('token', response.data.authentication_token)
            localStorage.setItem('expirationDate', expiresIn)
            dispatch(authSuccess(response.data.authentication_token, authData.user.email))
            dispatch(checkAuthTimeout(expirationTime))
        })
        .catch(err=>{
            console.log(err)
            dispatch(authFail(err))
        })
    }
}

export const authCheckState = () => {
    
    return dispatch =>{
        const token = localStorage.getItem('token');
        
        if(!token){
            dispatch(logout());
        }else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate < new Date()){
            dispatch(logout())
            }else{
                dispatch(authSuccess(token))
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000))
            } 
        }
    }
}