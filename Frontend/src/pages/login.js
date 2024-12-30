import React from 'react';
import { Link } from 'react-router-dom';

import { Helmet } from 'react-helmet';

import '../styles/login.css';

const Login = (props) => {
  return (
    <div className='login-container'>
      <Helmet>
        <title>FYV</title>
      </Helmet>
      <div className='login-login'>
        <img
          src='/external/loginpage16363-yf5-900w.png'
          alt='loginpage16363'
          className='login-loginpage1'
        />
        <div className='login-frame28986'>
          <div className='login-frame28985'>
            <div className='login-frame28984'>
              <div className='login-bg-tabswitcher32px'>
                <button className='login-tabswitcherbutton28px1'>
                  <div className='login-frame3'>
                    <span className='login-text10 MicroButtonLabel'>
                      Sign in
                    </span>
                  </div>
                </button>
                <button className='login-tabswitcherbutton28px2'>
                  <div className='login-frame1'>
                    <span className='login-text11 MicroButtonLabel'>
                      Sign up
                    </span>
                  </div>
                </button>
              </div>
            </div>
            <div className='login-sign-in-forms'>
              <div className='login-sign-in-form-web'>
                <div className='login-frame28976'>
                  <span className='login-text12 Title1'>
                    Nice to see you again
                  </span>
                  <div className='login-frame28968'>
                    <div className='login-frame28977'>
                      <div className='login-input-configurator1'>
                        <div className='login-input-configurator2'>
                          <input
                            type='text'
                            placeholder='Login'
                            className='login-satellite-input1'
                          />
                          <div className='login-login-input'>
                            <input
                              type='text'
                              placeholder
                              className='login-input-bg1'
                            />
                            <div className='login-regular-input-double-row1'>
                              <div className='login-placeholder-value1'>
                                <div className='login-frame288801'>
                                  <span className='login-text13 Placeholder-Value'>
                                    Email or phone number
                                  </span>
                                </div>
                              </div>
                              <div className='login-input-icons1'>
                                <div className='login-login-icons1'>
                                  <div className='login-frame28875'></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='login-input-configurator3'>
                        <div className='login-input-configurator4'>
                          <input
                            type='text'
                            placeholder='Password'
                            className='login-satellite-input2'
                          />
                          <div className='login-password-input'>
                            <input
                              type='text'
                              placeholder
                              className='login-input-bg2'
                            />
                            <div className='login-regular-input-double-row2'>
                              <div className='login-placeholder-value2'>
                                <div className='login-frame288802'>
                                  <span className='login-text14 Placeholder-Value'>
                                    Enter password
                                  </span>
                                </div>
                              </div>
                              <div className='login-input-icons2'>
                                <div className='login-login-icons2'>
                                  <img
                                    src='/external/rectangle4736288-bw6-200h.png'
                                    alt='Rectangle4736288'
                                    className='login-rectangle473'
                                  />
                                  <img
                                    src='/external/vector6289-0zo486.svg'
                                    alt='Vector6289'
                                    className='login-vector1'
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='login-frame28978'>
                      <div className='login-switcher-item-left'>
                        <div className='login-switcher'>
                          <div className='login-bg-switcher'>
                            <img
                              src='/external/default6305-8nzj-200h.png'
                              alt='Default6305'
                              className='login-default'
                            />
                          </div>
                          <div className='login-knob-icon'>
                            <img
                              src='/external/knob206307-3sc-200h.png'
                              alt='Knob206307'
                              className='login-knob20'
                            />
                          </div>
                        </div>
                        <span className='login-text15'>Remember me</span>
                      </div>
                      <span className='login-text16'>Forgot password?</span>
                    </div>
                  </div>
                </div>
                <button className='login-primarybutton40px'>
                  <Link
                    to='/main-screen-off'
                    className='login-text17 ButtonLabel'>
                    Sign in
                  </Link>
                </button>
                <img
                  src='/external/nav6312-mw9m-200h.png'
                  alt='Nav6312'
                  className='login-nav'
                />
                <div className='login-frame28981'>
                  <button className='login-google-big-button40px'>
                    <div className='login-frame61'>
                      <div className='login-other-pay-method'>
                        <div className='login-group3019'>
                          <img
                            src='/external/vector6318-qqs3.svg'
                            alt='Vector6318'
                            className='login-vector2'
                          />
                          <img
                            src='/external/vector6319-jzm.svg'
                            alt='Vector6319'
                            className='login-vector3'
                          />
                          <img
                            src='/external/vector6320-tim7.svg'
                            alt='Vector6320'
                            className='login-vector4'
                          />
                          <img
                            src='/external/vector6321-oizn.svg'
                            alt='Vector6321'
                            className='login-vector5'
                          />
                        </div>
                      </div>
                      <Link
                        to='/register'
                        className='login-text18'>
                        Or sign in with Google
                      </Link>
                    </div>
                  </button>
                </div>
              </div>
              <div className='login-sign-up-offer'>
                <span className='login-text19'>Dont have an account?</span>
                <span className='login-text20'>Sign up now</span>
              </div>
            </div>
          </div>
          <div className='login-bottom-panel'></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
