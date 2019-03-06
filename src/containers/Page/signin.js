 import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Loader from '../../Loader/index'
import Input from '../../components/uielements/input';
import Checkbox from '../../components/uielements/checkbox';
import Button from '../../components/uielements/button';
import authAction from '../../redux/auth/actions';
import appAction from '../../redux/app/actions';
import Auth0 from '../../helpers/auth0';
import Firebase from '../../helpers/firebase';
import FirebaseLogin from '../../components/firebase';
import IntlMessages from '../../components/utility/intlMessages';
import SignInStyleWrapper from './signin.style';
import {appConfig} from '../../utils/constants'
import {UserSession} from 'blockstack'

const { login } = authAction;
const { clearMenu } = appAction;

class SignIn extends Component {
  state = {
    redirectToReferrer: false,
    loadingUser: false,
    userSession:new UserSession(appConfig)

  };
  componentDidMount=async()=>{
    const {userSession,history}=this.state
  console.log(userSession)
    if(!userSession.isUserSignedIn() && userSession.isSignInPending())
    {
    const userData= await userSession.handlePendingSignIn()
    if(!userData.username){
      throw new Error('this app requires a user name')
    }
    
    this.props.history.push('/dashboard');
  }
}
  componentWillReceiveProps(nextProps) {
    if (
      this.props.isLoggedIn !== nextProps.isLoggedIn &&
      nextProps.isLoggedIn === true
    ) {
      this.setState({ redirectToReferrer: true });
    }
  }
  handleLogin = (/*token = false*/ e,) => {
      const { userSession } = this.state
  
      e.preventDefault()
      const origin ="http://localhost:8888"
      userSession.redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data'])
      this.setState({ loadingUser: true })
      // this.props.history.push('/dashboard');

    // const { login, clearMenu } = this.props;
    // if (token) {
    //   login(token);
    // } else {
    //   login();
    // }
    // clearMenu();
  };
  render() {
    const { history } = this.props;
    const from = { pathname: '/dashboard' };
    const { redirectToReferrer,loadingUser } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <SignInStyleWrapper className="isoSignInPage">
        <div className="isoLoginContentWrapper">
       <div className="isoLoginContent">
           <div className="isoLogoWrapper">
            <Link to="https://www.blockcred.io/">
                <IntlMessages id="page.signInTitle" />
              </Link>
            </div>

            <div className="isoSignInForm">
              {/*   <div className="isoInputWrapper">
                <Input size="large" placeholder="Username" />
              </div>

              <div className="isoInputWrapper">
                <Input size="large" type="password" placeholder="Password" />
 

              <div className="isoInputWrapper isoLeftRightComponent">
                <Checkbox>
                  <IntlMessages id="page.signInRememberMe" />
                </Checkbox>
                <Button type="primary" onClick={this.handleLogin}>
                  <IntlMessages id="page.signInButton" />
                </Button>
              </div>

              <p className="isoHelperText">
                <IntlMessages id="page.signInPreview" />
    </p>*/}
 
              <div className="isoInputWrapper isoOtherLogin">
              {
                loadingUser ? <Loader /> :
                <Button
                  onClick={this.handleLogin}
                  type="primary"
                  className="btnFacebook"
                >
                  <IntlMessages id="page.signInFacebook" />
                </Button>
              }
               {/*  <Button 
                  onClick={this.handleLogin}
                  type="primary"
                  className="btnGooglePlus"
                >
                  <IntlMessages id="page.signInGooglePlus" />
                </Button>
                

                {Auth0.isValid && (
                  <Button
                    onClick={() => {
                      Auth0.login();
                    }}
                    type="primary"
                    className="btnAuthZero"
                  >
                    <IntlMessages id="page.signInAuth0" />
                  </Button>
                )}

                 {Firebase.isValid && (
                   <FirebaseLogin history={history} login={this.props.login} />
                 )}
               
               </div>
    {/*          <div className="isoCenterComponent isoHelperWrapper">
                <Link to="/forgotpassword" className="isoForgotPass">
                  <IntlMessages id="page.signInForgotPass" />
                </Link>
                <Link to="/signup">
                  <IntlMessages id="page.signInCreateAccount" />
                </Link>
                     */}
              </div>
               
            </div>
        
          </div>
       </div>
      
      </SignInStyleWrapper>
    );
  }
}

export default connect(
  state => ({
    isLoggedIn: state.Auth.idToken !== null ? true : false,
  }),
  { login, clearMenu }
)(SignIn);
