import { UserOutlined } from '@ant-design/icons';
import type { TabsProps } from "antd";
import { Alert, Avatar, Button, Form, Input, Tabs, Upload } from "antd";
import { useState } from "react";
import Text from "../../components/TextComponent/Text";
import { COLORS } from '../../constants/colors';
import { fonts } from "../../constants/fonts";
import { useAppDispatch, useAppSelector } from '../../hooks';
import { updatePasswordUser, updateUser } from '../../store/slices/authSlice';

const ModifyInformationUserPage = () => {

    const [form] = Form.useForm();
    const [avatar, setAvatar] = useState<string>();
    const { user, isLoading, message: messageState } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

    const handleSubmit = async (values: { fullName: string, email: string, phoneNumber: string, id: number }) => {
        try {
            // API call here
            dispatch(updateUser(values))
        } catch (error) {
            console.error(error)
        }
    };

    const beforeUpload = (file: File) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
        }
        return isJpgOrPng && isLt2M;
    };

    const handleAvatarChange = (info: any) => {
        if (info.file.status === 'done') {
            // Get url from response
            setAvatar(info.file.response.url);
        }
    };

    return (
        <div style={{ margin: '0 auto', maxWidth: "500px", padding: '12px' }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    fullName: user?.fullName,
                    phoneNumber: user?.phoneNumber,
                    email: user?.email,
                    id: parseInt(user?.id)
                }}
            >
                {
                    messageState &&
                    <Alert
                        message={messageState}
                        type='success'
                    />
                }
                <div style={{ marginBottom: 24 }}>
                    <h2>Thông tin cá nhân</h2>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Upload
                            name="avatar"
                            listType="picture-circle"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={handleAvatarChange}
                        >
                            {avatar ? (
                                <Avatar size={100} src={avatar} />
                            ) : (
                                <Avatar size={100} icon={<UserOutlined />} />
                            )}
                        </Upload>
                    </div>

                    {/* hidden ID */}
                    <Form.Item
                        label="Id"
                        name="id"
                        hidden
                    >
                        <Input size="large" placeholder="Nhập họ và tên" />
                    </Form.Item>

                    <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                    >
                        <Input size="large" placeholder="Nhập họ và tên" />
                    </Form.Item>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <h2>Thông tin liên hệ</h2>
                    <Form.Item
                        label="Số điện thoại"
                        name="phoneNumber"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                        ]}
                    >
                        <Input size="large" placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input size="large" placeholder="Nhập email" />
                    </Form.Item>
                </div>

                <Form.Item>
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: COLORS.DARK_SLATE
                        }}
                        htmlType="submit"
                        size="large"
                        block
                        loading={isLoading}
                    >
                        Lưu thay đổi
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

const UserSettingPage = () => {
    const [form] = Form.useForm();
    const { user, isLoading, message: messageState } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

    const validatePassword = (_: any, value: string) => {
        if (!value) {
            return Promise.reject('Vui lòng nhập mật khẩu!');
        }
        if (value.length < 8) {
            return Promise.reject('Mật khẩu phải có ít nhất 8 ký tự!');
        }
        if (!/[A-Z]/.test(value)) {
            return Promise.reject('Mật khẩu phải chứa ít nhất 1 ký tự viết hoa!');
        }
        if (!/\d/.test(value)) {
            return Promise.reject('Mật khẩu phải chứa ít nhất 1 ký tự số!');
        }
        return Promise.resolve();
    };

    const handleSubmit = async (values: any) => {

        if (values.newPassword !== values.confirmPassword) {
            return;
        }

        try {
            // API call here to change password

            dispatch(updatePasswordUser({ newPassword: values.newPassword, currentPassword: values.currentPassword }))
            form.resetFields();
        } catch (error) {
            console.error(error);

        }
    };

    return (
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <div>
                {
                    messageState &&
                    <Alert
                        message={messageState}
                    />
                }
                <h2>Đổi mật khẩu</h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        id: parseInt(user?.id),
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                    }}
                >
                    <Form.Item
                        hidden
                        name="id"
                    >

                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu hiện tại"
                        name="currentPassword"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }
                        ]}
                    >
                        <Input.Password size="large" placeholder="Nhập mật khẩu hiện tại" />
                    </Form.Item>

                    <div style={{ textAlign: 'right', marginTop: -16, marginBottom: 16 }}>
                        <Button type="link" style={{ padding: 0 }}>
                            Bạn quên mật khẩu?
                        </Button>
                    </div>

                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[
                            { validator: validatePassword }
                        ]}
                    >
                        <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
                    </Form.Item>

                    <Form.Item
                        label="Nhập lại mật khẩu mới"
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Vui lòng nhập lại mật khẩu mới!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Mật khẩu nhập lại không khớp!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password size="large" placeholder="Nhập lại mật khẩu mới" />
                    </Form.Item>

                    <div style={{ marginBottom: 24 }}>
                        <Text text="Yêu cầu mật khẩu:" fontFamily={fonts.medium} />
                        <ul style={{ color: '#666', marginTop: 8 }}>
                            <li>Tối thiểu 8 ký tự</li>
                            <li>Chứa ít nhất 1 ký tự viết hoa</li>
                            <li>Chứa ít nhất 1 ký tự số</li>
                        </ul>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            loading={isLoading}
                            style={{
                                backgroundColor: COLORS.DARK_SLATE
                            }}
                        >
                            Lưu thay đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Chỉnh sửa thông tin',
        children: <ModifyInformationUserPage />,
    },
    {
        key: '2',
        label: 'Cài đặt tài khoản',
        children: <UserSettingPage />
    }
];

const ProfilePage = () => {

    const onChange = (key: string) => {
        console.log(key);

    };

    return (
        <div>
            {/* <Text text="Quản lý tài khoản" fontFamily={fonts.extraBold} fontSize={32} /> */}
            <Tabs
                defaultActiveKey="1"
                items={items}
                onChange={onChange}
            />
        </div>
    )
}

export default ProfilePage