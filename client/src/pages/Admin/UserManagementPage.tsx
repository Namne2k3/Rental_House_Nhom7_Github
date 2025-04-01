import { LockOutlined, UnlockOutlined, UserAddOutlined, EditOutlined } from '@ant-design/icons';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { Button, Form, Input, Modal, Select, Space, Table, Tag, message } from 'antd';
import { useState } from 'react';
import api from '../../services/api';
import dayjs from 'dayjs';

interface User {
    id: number;
    fullName: string;
    email: string;
    phoneNumber?: string;
    role: string;
    isLock: boolean;
    dateRegistered: string;
}

const UserManagementPage = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const queryClient = new QueryClient();
    const [searchField, setSearchField] = useState<string>('fullName');
    const [searchValue, setSearchValue] = useState<string>('');
    const [filterRole, setFilterRole] = useState<string>('');
    const [filterLockStatus, setFilterLockStatus] = useState<boolean | null>(null);
    const [filteredData, setFilteredData] = useState<User[] | null>(null);
    const [messageApi, messageContextHolder] = message.useMessage()
    const [modal, contextHolder] = Modal.useModal();

    // Fetch users
    const { data: users, isLoading, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get('/User/getAllUsers');
            return response.data;
        },
        initialData: [],
    });

    // Create user mutation
    const createUser = useMutation({
        mutationFn: (userData: Partial<User>) => api.post('/User', userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            messageApi.success('Tạo người dùng thành công');
            handleModalClose();
        },
        onError: () => messageApi.error('Có lỗi xảy ra khi tạo người dùng')
    });

    // Update user mutation
    const updateUser = useMutation({
        mutationFn: (userData: Partial<User>) => api.put(`/User/${userData.id}`, userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            messageApi.success('Cập nhật người dùng thành công');
            handleModalClose();
        },
        onError: () => messageApi.error('Có lỗi xảy ra khi cập nhật người dùng')
    });

    // Lock user mutation
    const lockUser = useMutation({
        mutationFn: (id: number) => api.put(`/User/LockUser`, Number(id)),
        onSuccess: () => {
            messageApi.success('Đã khóa tài khoản');
            refetch();
        },
        onError: () => messageApi.error('Có lỗi xảy ra khi khóa người dùng')
    });

    // Unlock user mutation
    const unLockUser = useMutation({
        mutationFn: (id: number) => api.put(`/User/UnlockUser`, Number(id)),
        onSuccess: () => {
            messageApi.success('Đã mở khóa tài khoản');
            refetch();
        },
        onError: () => messageApi.error('Có lỗi xảy ra khi mở khóa người dùng')
    });

    const handleSearch = async () => {
        try {
            const response = await api.post('/User/search', {
                searchField,
                searchValue,
                role: filterRole || null,
                isLock: filterLockStatus
            });
            setFilteredData(response.data.data);
        } catch (error) {
            messageApi.error(error.response.data.message);
        }
    };

    const resetSearch = () => {
        setSearchField('fullName');
        setSearchValue('');
        setFilterRole('');
        setFilterLockStatus(null);
        setFilteredData(null);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setEditingUser(null);
        form.resetFields();
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setIsModalVisible(true);
    };

    const handleLockUser = (id: number) => {
        modal.confirm({
            title: 'Xác nhận khóa tài khoản',
            cancelText: "Quay lại",
            content: 'Bạn có chắc chắn muốn khóa tài khoản này?',
            onOk: () => lockUser.mutate(id),
            okText: "Khóa",
            okType: "danger"
        });
    };

    const handleUnLockUser = (id: number) => {
        modal.confirm({
            title: 'Xác nhận mở khóa tài khoản',
            cancelText: "Quay lại",
            content: 'Bạn có chắc chắn muốn mở khóa tài khoản này?',
            onOk: () => unLockUser.mutate(id),
            okText: "Mở khóa",
            okType: "primary"
        });
    };

    const handleSubmit = async (values: any) => {
        if (editingUser) {
            updateUser.mutate({ ...values, id: editingUser.id });
        } else {
            createUser.mutate(values);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber'
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => <Tag color={role === 'Admin' ? 'red' : 'green'}>{role}</Tag>,
            filters: [
                { text: 'Admin', value: 'Admin' },
                { text: 'User', value: 'User' },
            ],
            onFilter: (value: string, record) => record.role === value,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isLock',
            key: 'isLock',
            render: (isLock: boolean) => (
                <Tag color={isLock ? 'red' : 'green'}>
                    {isLock ? 'Đã khóa' : 'Hoạt động'}
                </Tag>
            ),
            filters: [
                { text: 'Đã khóa', value: true },
                { text: 'Hoạt động', value: false },
            ],
            onFilter: (value: boolean, record) => record.isLock === value,
        },
        {
            title: 'Ngày đăng ký',
            dataIndex: 'dateRegistered',
            key: 'dateRegistered',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a, b) => dayjs(a.dateRegistered).unix() - dayjs(b.dateRegistered).unix(),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: User) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    {record.role !== 'Admin' && (
                        record.isLock ? (
                            <Button
                                type="primary"
                                icon={<UnlockOutlined />}
                                onClick={() => handleUnLockUser(record.id)}
                            >
                                Mở khóa
                            </Button>
                        ) : (
                            <Button
                                danger
                                icon={<LockOutlined />}
                                onClick={() => handleLockUser(record.id)}
                            >
                                Khóa
                            </Button>
                        )
                    )}
                </Space>
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            {messageContextHolder}
            <div style={{ padding: 24 }}>
                <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                    <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsModalVisible(true)}>
                        Thêm người dùng
                    </Button>
                    <Select
                        style={{ width: 150 }}
                        value={searchField}
                        onChange={setSearchField}
                    >
                        <Select.Option value="id">ID</Select.Option>
                        <Select.Option value="fullName">Họ tên</Select.Option>
                        <Select.Option value="email">Email</Select.Option>
                        <Select.Option value="phoneNumber">Số điện thoại</Select.Option>
                    </Select>

                    <Input
                        placeholder="Nhập từ khóa tìm kiếm..."
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        style={{ width: 250 }}
                    />

                    <Select
                        style={{ width: 150 }}
                        placeholder="Vai trò"
                        allowClear
                        value={filterRole}
                        onChange={setFilterRole}
                    >
                        <Select.Option value="Admin">
                            <Tag color="red">Admin</Tag>
                        </Select.Option>
                        <Select.Option value="User">
                            <Tag color="green">User</Tag>
                        </Select.Option>
                    </Select>

                    <Select
                        style={{ width: 150 }}
                        placeholder="Trạng thái"
                        allowClear
                        value={filterLockStatus}
                        onChange={setFilterLockStatus}
                    >
                        <Select.Option value={true}>
                            <Tag color="red">Đã khóa</Tag>
                        </Select.Option>
                        <Select.Option value={false}>
                            <Tag color="green">Hoạt động</Tag>
                        </Select.Option>
                    </Select>

                    <Button type="primary" onClick={handleSearch}>
                        Tìm kiếm
                    </Button>

                    <Button onClick={resetSearch}>
                        Đặt lại
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={(filteredData ?? users?.data) || []}
                    loading={isLoading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showTotal: (total) => `Tổng ${total} người dùng`
                    }}
                />

                <Modal
                    title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}
                    open={isModalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            name="fullName"
                            label="Họ tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item name="phoneNumber" label="Số điện thoại">
                            <Input />
                        </Form.Item>

                        <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
                            <Select>
                                <Select.Option value="Admin">Admin</Select.Option>
                                <Select.Option value="User">User</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    {editingUser ? 'Cập nhật' : 'Thêm mới'}
                                </Button>
                                <Button onClick={handleModalClose}>Hủy</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    );
};

export default UserManagementPage;
