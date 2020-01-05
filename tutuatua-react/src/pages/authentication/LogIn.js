import React, { Component } from 'react';
import { Carousel } from 'antd';
import './LogIn.css'
import { LogInForm } from '../../components/LogInForm'
import SignUpForm from '../../components/SignUpForm';

class LogIn extends Component {

  state={
    linkToSignUpForm: false,    
  }

  handleLinkSignUpForm = () => {
    this.setState({linkToSignUpForm: !this.state.linkToSignUpForm})
  }

  pushToTutor = () => {
    this.props.history.push('/tutor')
  }

  pushToStudent = () => {
    this.props.history.push('/student')
  }

  render() {
    return (
      <div id='container-login'>

        <div id='frame-logo'>
          <Carousel autoplay>
            <div className='pic-car'> <img alt='' src='https://image.freepik.com/free-vector/online-education-background_52683-7795.jpg' /> </div>
            <div className='pic-car'> <img alt='' src='https://image.freepik.com/free-vector/online-education-background_52683-8091.jpg' /> </div>
            <div className='pic-car'> <img alt='' src='https://image.freepik.com/free-vector/online-education-background_52683-7677.jpg' /> </div>
          </Carousel>    
          <div>

          </div>
        </div>    

        <div id='frame-login'>     
          {this.state.linkToSignUpForm ? 
            <SignUpForm handleLinkSignUpForm={this.handleLinkSignUpForm} /> : 
            <LogInForm 
              handleLinkSignUpForm={this.handleLinkSignUpForm} 
              pushToTutor={this.pushToTutor}
              pushToStudent={this.pushToStudent}
            /> 
          }
        </div>

      </div>
    );
  }
}

export default LogIn;