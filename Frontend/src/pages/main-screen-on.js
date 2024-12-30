import React from 'react';
import { Link } from 'react-router-dom';

import { Helmet } from 'react-helmet';

import '../styles/main-screen-on.css';

const MainScreenON = (props) => {
  return (
    <div className='main-screen-on-container'>
      <Helmet>
        <title>exported project</title>
      </Helmet>
      <div className='main-screen-on-main-screen-on'>
        <div className='main-screen-on-sidebar'>
          <div className='main-screen-on-header1'>
            <img
              src='/external/vibenobmg15171-ypbp-200w.png'
              alt='vibenoBmg15171'
              className='main-screen-on-vibeno-bmg1'
            />
            <span className='main-screen-on-text10'>FYV</span>
          </div>
        </div>
        <img
          src='/external/rectangle66986712-ncsb-200w.png'
          alt='Rectangle66986712'
          className='main-screen-on-rectangle6698'
        />
        <div className='main-screen-on-main'>
          <div className='main-screen-on-header2'>
            <div className='main-screen-on-left'>
              <span className='main-screen-on-text11'>Chatroom</span>
              <div className='main-screen-on-duration'>
                <span className='main-screen-on-text12 Body1(Medium)'>
                  (00:34:07)
                </span>
              </div>
            </div>
            <div className='main-screen-on-right'>
              <img
                src='/external/morevertical4246-xt6.svg'
                alt='morevertical4246'
                className='main-screen-on-morevertical'
              />
              <div className='main-screen-on-input-button'>
                <span className='main-screen-on-text13 Body1(Medium)'>
                  Next room (Spacebar)
                </span>
                <img
                  src='/external/arrowforwardi424-faqf.svg'
                  alt='ArrowforwardI424'
                  className='main-screen-on-arrowforward'
                />
              </div>
            </div>
          </div>
          <div className='main-screen-on-content'>
            <div className='main-screen-on-video-stream'>
              <img
                src='/external/rectangle66996712-n5w-200w.png'
                alt='Rectangle66996712'
                className='main-screen-on-rectangle6699'
              />
              <div className='main-screen-on-camera1'>
                <div className='main-screen-on-controls1'>
                  <span className='main-screen-on-text14 Body1(Medium)'>
                    Video enabled
                  </span>
                  <img
                    src='/external/eyeoff4254-1zar.svg'
                    alt='eyeoff4254'
                    className='main-screen-on-eyeoff'
                  />
                </div>
              </div>
              <div className='main-screen-on-camera2'></div>
              <div className='main-screen-on-controls2'>
                <div className='main-screen-on-middle'>
                  <div className='main-screen-on-control1'>
                    <img
                      src='/external/video4259-zxik.svg'
                      alt='video4259'
                      className='main-screen-on-video'
                    />
                  </div>
                  <div className='main-screen-on-control2'>
                    <img
                      src='/external/micoff4261-wg1j.svg'
                      alt='micoff4261'
                      className='main-screen-on-micoff'
                    />
                  </div>
                </div>
                <div className='main-screen-on-wrapper'>
                  <Link
                    to='/main-screen-off'
                    className='main-screen-on-navlink'>
                    <div className='main-screen-on-control3'>
                      <img
                        src='/external/closelight4264-tfpn.svg'
                        alt='CloseLight4264'
                        className='main-screen-on-close-light'
                      />
                      <span className='main-screen-on-text15 Body1(Medium)'>
                        Leave Room
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className='main-screen-on-chat'>
              <div className='main-screen-on-message-history'>
                <div className='main-screen-on-message-wrap1'>
                  <div className='main-screen-on-message1'>
                    <span className='main-screen-on-text16 Body1'>
                      Hi there! I&apos;m from Italy. How about you?
                    </span>
                  </div>
                </div>
                <div className='main-screen-on-message-wrap2'>
                  <div className='main-screen-on-message2'>
                    <span className='main-screen-on-text17 Body1'>
                      Hey! I&apos;m from Canada. What&apos;s it like in Italy?
                    </span>
                  </div>
                </div>
                <div className='main-screen-on-message-wrap3'>
                  <div className='main-screen-on-message3'>
                    <span className='main-screen-on-text18 Body1'>
                      It&apos;s beautiful, especially the food and the
                      historical places. Ever been here?
                    </span>
                  </div>
                </div>
                <div className='main-screen-on-message-wrap4'>
                  <div className='main-screen-on-message4'>
                    <span className='main-screen-on-text19 Body1'>
                      No, but I&apos;d love to visit one day. I hear the
                      architecture is amazing. What do you like most about
                      living there?
                    </span>
                  </div>
                </div>
              </div>
              <div className='main-screen-on-controls3'>
                <div className='main-screen-on-new-message-wrap'>
                  <span className='main-screen-on-text20 Body1'>
                    Type a message
                  </span>
                  <img
                    src='/external/send4282-eyt7.svg'
                    alt='Send4282'
                    className='main-screen-on-send'
                  />
                </div>
              </div>
              <div className='main-screen-on-english'>
                <span className='main-screen-on-text21 Body1(Medium)'>
                  English
                </span>
                <img
                  src='/external/chevrondown4287-ovl.svg'
                  alt='chevrondown4287'
                  className='main-screen-on-chevrondown'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainScreenON;
