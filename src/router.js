import React , { Component }  from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux';
import Loader from './Loader'
import _ from 'lodash';
import App from './containers/App/App';
import UserProvider from './User/UserProvider'
import asyncComponent from './helpers/AsyncFunc';
import Auth0 from './helpers/auth0';
import Login from './containers/Page/signin'
const RestrictedRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLoggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/signin',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);
class PublicRoutes extends Component{

  state = { user: {} }

  
  componentDidMount() {
    const { userSession } = this.props
console.log(userSession)
    const user = userSession.loadUserData()

    this.setState({ user })
  }
  render(){
    const { user } = this.state
    const { history, isLoggedIn,userSession }=this.props
    if (_.isEmpty(user)) {
      return <Loader />
    }

  return (
    <ConnectedRouter history={history}>
      <div>
      <UserProvider userSession={userSession}>

        <Route
          exact
          path={'/'}
          component={asyncComponent(() => import('./containers/Page/signin'))}
        />
        <Route
          exact
          path={'/404'}
          component={asyncComponent(() => import('./containers/Page/404'))}
        />
        <Route
          exact
          path={'/500'}
          component={asyncComponent(() => import('./containers/Page/500'))}
        />
        <Route
          exact
          path={'/signin'}
          component={<Login userSession={userSession} />}
        />
        <Route
          exact
          path={'/signup'}
          component={asyncComponent(() => import('./containers/Page/signup'))}
        />
        <Route
          exact
          path={'/forgotpassword'}
          component={asyncComponent(() =>
            import('./containers/Page/forgotPassword')
          )}
        />
        <Route
          exact
          path={'/resetpassword'}
          component={asyncComponent(() =>
            import('./containers/Page/resetPassword')
          )}
        />

        <Route
          path="/auth0loginCallback"
          render={props => {
            Auth0.handleAuthentication(props);
          }}
        />
       {/* <RestrictedRoute
          path="/dashboard"
          component={App}
          isLoggedIn={isLoggedIn}
       />*/}
        </UserProvider>
      </div>
    </ConnectedRouter>
  );
};
}

export default connect(state => ({
  isLoggedIn: state.Auth.idToken !== null,
}))(PublicRoutes);
