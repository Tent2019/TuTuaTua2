import React from 'react';
import './SignUpForm.css'
import { connect } from 'react-redux'
import { addUser } from '../redux/actions/actions';
import Axios from '../config/axios.setup'
// === test - store === //
// import store from '../redux/store/store'
// ==================== //
import { Form, Input, Button, Select, notification, Icon } from 'antd';

const { Option } = Select;
const successRegister = (succmsg) => {
  notification.open({
    message: 'Register success',
    description: succmsg,
    icon: <Icon type="smile" style={{color:'blue'}} /> ,
  });
};
const failRegister = (errmsg) => {
  notification.open({
    message: 'Fail to register',
    description: errmsg,
    icon: <Icon type="warning" style={{color:'red'}} /> ,
  });
};

class RegistrationForm extends React.Component {
  state = {
    isDirty: false
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('Password and Confirm password do not match')
    } else {
      callback()
    }
  }

  handleDirtyBlur = e => {
    const { value } = e.target
    this.setState({ isDirty: this.state.isDirty || !!value })
  }
  compareToSecondPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && this.state.isDirty) {
      form.validateFields(
        ['confirm'], 
        { force: true });
    }
    callback()
  }

  submitForm = (e) => {
    e.preventDefault()

    this.props.form.validateFieldsAndScroll(async (err, value) => {
      if (!err) {
        try {
          let result = await Axios.post('/registerUser',{
            username: value.username,
            password: value.password,
            role: value.usertypes
          })  
          successRegister(result.data.message)
          this.props.form.resetFields()        
        } catch (err) {
          failRegister(err.response.data)      
        }        
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;    
    const formItemLayout = {
      labelCol: { xs: { span: 12 }, sm: { span: 6 }, },
      wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, },
    };

    const { handleLinkSignUpForm } = this.props        
    return (
      <div id='container-form2'>
        <Form id='form2'
          {...formItemLayout} onSubmit={this.submitForm}
        >
          <Form.Item label="Username">
            {getFieldDecorator('username', {
              rules: [{ 
                  required: true,
                  message: 'Please input your username!',
                }]
            })(<Input className='login-input' />)}
          </Form.Item>

          <Form.Item label="Password" hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  validator: this.compareToSecondPassword,
                },
              ],
            })(<Input.Password className='login-input' />)}
          </Form.Item>     

          <Form.Item label="Confirm Password" hasFeedback>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password  className='login-input' 
                  onBlur={this.handleDirtyBlur} 
                />)
            }
          </Form.Item>

          <Form.Item label="User Types">
            {getFieldDecorator('usertypes', {
              rules: [
                { required: true, 
                  message: 'Please select your user types!' 
                }
              ],
            })(<Select
              showSearch
              className='select-input'            
              placeholder="Select type"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="tutor">tutor</Option>
              <Option value="student">student</Option>
            </Select>)}
          </Form.Item>

          <Form.Item style={{marginTop:'30px'}}>                         
            <Button type="primary" ghost htmlType="submit"
              style={{marginRight:'30px'}} 
            >
              Register
            </Button>    
            <Button type="primary" htmlType="submit"
              onClick={handleLinkSignUpForm}
            >
              Back
            </Button>           
          </Form.Item>
        </Form>
      </div>      
    );
  }
}

const mapDispatchToProps = {
  addUser: addUser
}

const SignUpForm = Form.create({ name: 'register' })(RegistrationForm);
export default connect(null, mapDispatchToProps)(SignUpForm)