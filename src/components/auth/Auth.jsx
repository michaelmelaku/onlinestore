import React, {useState} from 'react';
import {GoogleLogin} from 'react-google-login';
import {Container, Grid, Paper, Avatar, Button,  Typography} from "@material-ui/core";
import { LockOutlined } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import Icon  from './Icon';
import Input from './Input';
import useStyles from "./styles";
import {loginWithGoogle} from '../../redux/reducers/authSlice';
import { loginUser, registerUser } from '../../redux/apiCalls/authApiCalls';
import HOC from "../HOC";
const initialState = {firstName: '', 
                       lastName: '', email: '',
                       password: '', confirmPassword: ''};

const Auth = ({handleAppPage}) => {
    const [isSignup, setIsSignup] = useState(false);
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const handleShowPassword = () => setShowPassword(!showPassword); 
    const loginPlace = useSelector((state) => state.states.loginPlace);

    const dispatch = useDispatch();
    
    const handleChange= (e) => {
        setFormData((prev) => {
            return {...prev, [e.target.name]: e.target.value};
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isSignup){
            registerUser(formData, dispatch);
            if(loginPlace==="login") {
                handleAppPage('productPage')
            }
            else if (loginPlace==="cart"){
                handleAppPage('checkout')
            }
        } else {
            loginUser(formData, dispatch);
            if(loginPlace==="login") {
                handleAppPage('productPage')
            }
            else if (loginPlace==="cart"){
                handleAppPage('checkout')
            }
        }
    }

    const switchMode = () => {
        setFormData(initialState);
        setIsSignup((preIsSignup) => !preIsSignup);
        setShowPassword(false);
    }

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;
        try {
            dispatch(loginWithGoogle({token, result}));
            if(loginPlace==="login") {
                handleAppPage('productPage')
            }
            else if (loginPlace==="cart"){
                handleAppPage('checkout')
            }
        }
        catch(error) {
            console.log(error);
        }
    };

    const googleFailure = (error) => {
        
        console.log("Google Sign In was unsuccessful. Try Again Later");
    };

  return (
    <Container className={classes.authContainer} component="main" maxWidth="xs">
        <div className={classes.toolbar} />
        <Paper className={classes.paper} elevation={2}>
            <Avatar className={classes.avatar}>
                    <LockOutlined />
            </Avatar>
            <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                   <Input value={formData.firstName} name="firstName"  label="First Name" handleChange={handleChange} autoFocus  />
                                   <Input value={formData.lastName} name="lastName" label="Last Name" handleChange={handleChange}   />
                                </>
                            )}
                            <Input value={formData.email} name="email" label="Email Address" handleChange={handleChange} type="email"/>
                            <Input value={formData.password} name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword}/>
                            {isSignup && <Input value={formData.confirmPassword} name="confirmPassword" label="Confirm Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword}/>}
                            
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <GoogleLogin clientId="1020193705109-r2f6e31mhi2aqqjqo2461vsfkm6nonol.apps.googleusercontent.com" 
                        render={(renderProps) => {
                            return (
                                <Button 
                                    className={classes.googleButton} 
                                    color="primary" 
                                    fullWidth 
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                    startIcon={<Icon />} variant="contained">
                                        Google Sign In
                                </Button>
                            )
                        }}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy="single_host_origin"
                    />
                    <Grid container justifycontent="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignup? 'Already have an account? Sign In': "Don't have an account? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
        </Paper>
    </Container>
  )
}

export default HOC(Auth)