import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { store, history } from './redux/store';
import PublicRoutes from './router';
import { ThemeProvider } from 'styled-components';
import { LocaleProvider } from 'antd';
import {appConfig} from './utils/constants'

import { IntlProvider } from 'react-intl';
import themes from './settings/themes';
import {UserSession} from 'blockstack'
import AppLocale from './languageProvider';
import config, {
  getCurrentLanguage,
} from './containers/LanguageSwitcher/config';
import { themeConfig } from './settings';
import DashAppHolder from './dashAppStyle';
import Boot from './redux/boot';
import GlobalStyles from './settings/globalStyles';

const currentAppLocale =
  AppLocale[getCurrentLanguage(config.defaultLanguage || 'english').locale];
  class DashApp extends Component{
    state={
      userSession:new UserSession(appConfig)
    }
    componentDidMount=async()=>{
      const {userSession}=this.state
    console.log(userSession)
      if(!userSession.isUserSignedIn() && userSession.isSignInPending())
      {
      const userData= await userSession.handlePendingSignIn()
      if(!userData.username){
        throw new Error('this app requires a user name')
      }
      
    history.push('/dashboard')
    }
  }
render(){
  const{userSession}=this.state

return(
  <LocaleProvider locale={currentAppLocale.antd}>
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}
    >
      <ThemeProvider theme={themes[themeConfig.theme]}>
        <DashAppHolder>
          <Provider store={store}>
            <PublicRoutes history={history}  userSession={userSession} />
          </Provider>
          <GlobalStyles />
        </DashAppHolder>
      </ThemeProvider>
    </IntlProvider>
  </LocaleProvider>
);

// Boot()
//   .then(() => DashApp())
//   .catch(error => console.error(error));
}
}
export default DashApp;
export { AppLocale };
