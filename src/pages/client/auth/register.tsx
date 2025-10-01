import React, { useState } from 'react';
import { message } from 'antd';
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import { useNavigate } from "react-router-dom";

import './register.scss';
import {registerApi} from '@/services/api'

type FieldType = {
        fullName: string;
        password: string;
        phone:string;
        email:string;
    };

const RegisterPage : React.FC = () =>{
    const [isSubmit, setIsSubmit]= useState(false);
     const navigate = useNavigate();
    // const [valueInput, setValueInput]= useState({});
    // console.log('input',valueInput);
    

    const onFinish: FormProps<FieldType>['onFinish'] = async(values) => {
        setIsSubmit(true);
        const {fullName,email,password,phone}=values;
        const res= await registerApi(fullName,email,password,phone);
        console.log('res',res);
        if(res.data){
            message.success("Creating new user is success ");
            navigate("/login");
        }else{
            message.error(res.message);
        }
        setIsSubmit(false);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    
    return(
    <div className='page_wrapper'>
        <div className='form_login'>
            <h1>Đăng ký tài khoản</h1>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                label="username"
                name="fullName"
                rules={[{ required: true, message: 'Please input your username!' }]}
                >
                <Input />
                </Form.Item>
                <Form.Item
                name="email"
                label="E-mail"
                rules={[
                {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                },
                {
                    required: true,
                    message: 'Please input your E-mail!',
                },
                ]}
                >
                    <Input />
                </Form.Item>
                
                <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
                >
                <Input.Password />
                </Form.Item>
            
                <Form.Item<FieldType>
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input your phone!' }]}
                >
                <Input />
                </Form.Item>
            
                <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                </Form.Item>
                <div className="footer">
                    <span>Đã có tài khoản? </span>
                    <a href="/login">Đăng Nhập</a>
                </div>
            </Form>
        </div>
    </div>
)};
export default RegisterPage;