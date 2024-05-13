import React, { useState, useEffect } from 'react';
import "./Login.css";
import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../ReduxToolKit/Slice/userSlice"
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => {
    return state.user.loading;
  });
  const error = useSelector((state) => state.user.error);
  

  const onFinish = (values) => {
    dispatch(login({ payload: values, navigate: () => navigate("/newsearch") }));
  };
  useEffect(() => {
    error && toast.error(error?.Message);
  }, [error]);
  return (
    <>
      <ToastContainer />

      <div className='container-fluid bg-white'>
      <div className='signup-body'>
        <div className='row'>
          <div className='col-lg-4'></div>
          <div className='col-lg-4 signup-box'>
            <h1 className="heading">VITA GUIDE</h1>
            <h1 className='heading' style={{color: "#0f6efd", fontSize: "25px"}}>Sign In</h1>
                    <Form
                      name="normal_login"
                      className="login-form"
                      initialValues={{
                        remember: true,
                      }}
                      onFinish={onFinish}>
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Please input email!",
                          },
                          {
                            type: "email",
                            message: "Invalid email!",
                          },
                        ]}
                        style={{
                          marginBottom: "30px",
                          borderRadius: "none !important",
                        }}>
                        <Input placeholder="Email" autoComplete="off"
                          style={{
                            border: "none", // Remove default border
                            borderBottom: "1px solid #ccc", // Add bottom border
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Please input password!",
                          },
                        ]}
                        style={{ marginBottom: "10px" }}>
                        <Input
                          type="password"
                          placeholder="Password"
                          style={{
                            border: "none", // Remove default border
                            borderBottom: "1px solid #ccc", // Add bottom border
                          }}
                        />
                      </Form.Item>
                      <Form.Item className="forgot-password">
                        {/*<a className="login-form-forgot" href="/forgotpassword">*/}
                        {/*  Forgot password?*/}
                        {/*</a>*/}
                      </Form.Item>

                      <Form.Item className="d-flex justify-content-center signin-button">
                        <Button
                          htmlType="submit"
                          loading={loading}
                          className="login-form-button">
                          Sign In
                        </Button>
                      </Form.Item>
                      <Form.Item className="d-flex justify-content-center dont-have-account">
                        <p>
                          Don’t have an account? &nbsp;
                          <span>
                            <a href="/signup">Sign up here</a>
                          </span>
                        </p>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
    </>
  );
};

export default Login