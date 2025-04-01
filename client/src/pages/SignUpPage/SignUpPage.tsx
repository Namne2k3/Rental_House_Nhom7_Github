
import { Button, Form, Grid, Image, Input, Spin, theme, Typography } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router";
import { COLORS } from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { signUpUser } from "../../store/slices/authSlice";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

type SignUpData = {
    fullName: string,
    password: string,
    email: string,
    phoneNumber: string
}

export default function SignUpPage() {
    const navigate = useNavigate()
    const { token } = useToken();
    const screens = useBreakpoint();
    const dispatch = useAppDispatch()
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const onFinish = async (values: SignUpData) => {
        try {
            const { payload } = await dispatch(signUpUser(values))

            if (payload.isSuccess) {

                navigate("/login")
            }

        } catch (error: unknown) {
            console.error("Đăng ký thất bại: ", error);
        }
    };

    const styles = {
        container: {
            margin: "0 auto",
            padding: screens.md ? `${token.paddingXL}px` : `${token.paddingXL}px ${token.padding}px`,
            width: "380px"
        },
        forgotPassword: {
            float: "right"
        },
        header: {
            marginBottom: token.marginXL,
            textAlign: "center" as const
        },
        section: {
            alignItems: "center",
            backgroundColor: token.colorBgContainer,
            display: "flex",
            height: screens.sm ? "100vh" : "auto",
            padding: screens.md ? `${token.sizeXXL}px 0px` : "0px"
        },
        signup: {
            marginTop: token.marginLG,
            textAlign: "center" as const,
            width: "100%"
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
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Image
                        src="./images/logo.jpg"
                        width={150}
                        preview={false}
                        style={{ borderRadius: 24, alignContent: 'center' }}
                    />
                </div>
                <div style={styles.header}>
                    <Title style={styles.title}>Đăng ký tài khoản</Title>
                </div>
                <Form
                    name="normal_signup"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark="optional"
                >
                    <Form.Item
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng điền họ tên đầy đủ!",
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Họ tên đầy đủ" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: "email",
                                required: true,
                                message: "Vui lòng điền địa chỉ Email!",
                            }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Địa chỉ Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        // extra="Mật khẩu phải có ít nhất 8 kí tự."
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng điền mật khẩu!",
                            },
                            {
                                min: 8,
                                message: "Mật khẩu phải có ít nhất 8 ký tự!"
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Mật khẩu"
                        />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại!",
                            },
                            {
                                pattern: /^[0-9]{10}$/,
                                message: "Số điện thoại phải có 10 chữ số!",
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Số điện thoại"
                            maxLength={10}
                            type="tel"
                        />
                    </Form.Item>
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
                                    Đăng ký
                                </Button>
                        }
                        <div style={styles.signup}>
                            <Text style={styles.text}>Đã có tài khoản?</Text>{" "}
                            <NavLink to={'/login'} style={{ color: COLORS.TAUPE }}>Đăng nhập</NavLink>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </section>
    );
}