import { LoadingOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Grid, Image, Input, Spin, theme, Typography } from "antd";
import { CSSProperties } from "react";
import { NavLink, useNavigate } from "react-router";
import { COLORS } from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { loginUser } from "../../store/slices/authSlice";
const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

type LoginData = {
    email: string,
    password: string
}

const LoginPage = () => {
    const { token } = useToken();
    const screens = useBreakpoint();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error, message } = useAppSelector((state) => state.auth);


    const onFinish = async (values: LoginData) => {
        try {
            const { payload } = await dispatch(loginUser(values))

            if (payload.isSuccess) {
                navigate("/")
            }

        } catch (error: unknown) {
            console.error("Đăng nhập thất bại: ", error);
        }
    };

    const styles = {
        container: {
            margin: "0 auto",
            padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
            width: "380px"
        },
        footer: {
            marginTop: token.marginLG,
            textAlign: "center" as const,
            width: "100%"
        } as CSSProperties,
        forgotPassword: {
            float: "right"
        },
        header: {
            marginBottom: token.marginXL
        },
        section: {
            alignItems: "center",
            backgroundColor: token.colorBgContainer,
            display: "flex",
            height: screens.sm ? "100vh" : "auto",
            padding: screens.md ? `${token.sizeXXL}px 0px` : "0px"
        },
        text: {
            color: token.colorTextSecondary
        },
        title: {
            fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3
        }
    };

    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image
                            src="./images/logo.jpg"
                            width={150}
                            preview={false}
                            style={{ borderRadius: 24, alignContent: 'center' }}
                        />
                    </div>
                    <Text style={{ color: 'green', display: 'block', marginTop: 16, textAlign: 'center' }}>{message}</Text>
                    <Title style={styles.title}>Đăng nhập</Title>
                    <Text style={styles.text}>
                        Chào mừng quay trở lại với
                    </Text>
                    <Text strong> FindRentalPlace</Text>
                </div>
                <Form
                    name="normal_login"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark="optional"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: "email",
                                required: true,
                                message: "Vui lòng điền địa chỉ Email!",
                            },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Địa chỉ Email"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng điền mật khẩu!",
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Mật khẩu"
                        />
                    </Form.Item>
                    {/* <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a style={styles.forgotPassword} href="">
                            Forgot password?
                        </a>
                        </Form.Item> */}
                    <Text style={{ color: 'red', display: 'block', textAlign: 'center', marginBottom: 24 }}>{error}</Text>
                    <Form.Item style={{ marginBottom: "0px" }}>
                        {
                            isLoading == true
                                ?
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Spin style={{ color: COLORS.DARK_SLATE }} indicator={<LoadingOutlined spin />} size='large' />
                                </div>
                                :
                                <Button
                                    block
                                    type="primary"
                                    htmlType="submit"
                                    style={{
                                        backgroundColor: COLORS.DARK_SLATE,
                                        borderColor: COLORS.DARK_SLATE
                                    }}
                                >
                                    Đăng nhập
                                </Button>
                        }
                        <div style={styles.footer}>
                            <Text style={styles.text}>Chưa có tài khoản?</Text>{" "}
                            <NavLink style={{ color: COLORS.TAUPE }} to={'/sign-up'}>Đăng ký ngay</NavLink>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </section>
    );
}

export default LoginPage;