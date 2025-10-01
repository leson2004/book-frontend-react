import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import { useNavigate } from "react-router-dom";
import { App } from 'antd';
import { useState } from 'react';

import './login.scss';
import {loginApi} from '@/services/api';
import {useCurrentApp} from '@/components/context/app.context';

type FieldType = {
        username: string;
        password: string;
    };
const LoginPage =()=>{
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit]= useState(false);
    const { notification,message } = App.useApp();
    const {setUser}=useCurrentApp();

    const onFinish = async(values: any) => {

        const {username,password}=values;
        setIsSubmit(true);
        const res = await loginApi(username,password);
        setIsSubmit(false);
        //console.log('res',res);
        if(res.data&&res.data.user){
            navigate("/");
            message.success('Đăng nhập tài khoản thành công ');
            localStorage.setItem("access_token", res.data.access_token);
            setUser(res.data.user);
        }else{
            notification.error({
            type: 'error',
            message: 'Có lỗi xảy ra',
            description: res.message&&Array.isArray(res.message)?res.message[0]:res.message,
            placement: 'topRight',
            duration:5
        });
        }
    console.log('Received values of form: ', values);

  };

  return (
   <div className='login-container'>
       <div className='form-login'>
            <h1>Đăng nhập </h1>
            <Form
              name="login"
              initialValues={{ remember: true }}
              style={{ maxWidth: 360 }}
              onFinish={onFinish}
            >
              <Form.Item<FieldType>
                name="username"
                rules={[

                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        { required: true, message: 'Please input your Email!' }
                    ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item<FieldType>
                name="password"
                rules={[
                            { required: true, message: 'Please input your Password!' }
                        ]}
              >
                <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Flex justify="space-between" align="center">
                  <Form.Item valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <a href="">Forgot password</a>
                </Flex>
              </Form.Item>
        
              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  Log in
                </Button>
                or <a href="/register">Register now!</a>
              </Form.Item>
            </Form>
       </div>
   </div>
  );
}
export default LoginPage;