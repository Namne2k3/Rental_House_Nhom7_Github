import { BookOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import NhaTroManagementPage from './NhaTroManagementPage/NhaTroManagementPage';
import UserManagementPage from './UserManagementPage';
import FeedbackManagementPage from './FeedbackManagementPage';

const { Header, Sider, Content } = Layout;

const AdminPanel = () => {
    const [selectedKey, setSelectedKey] = useState('users');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: 'users',
            icon: <TeamOutlined />,
            label: 'Quản lý người dùng',
        },
        {
            key: 'rentals',
            icon: <HomeOutlined />,
            label: 'Quản lý nhà trọ',
        },
        {
            key: 'feedbacks',
            icon: <BookOutlined />,
            label: 'Quản lý khiếu nại',
        },
    ];

    const renderContent = () => {
        switch (selectedKey) {
            case 'users':
                return <UserManagementPage />;
            case 'rentals':
                return <NhaTroManagementPage />;
            case 'feedbacks':
                return <FeedbackManagementPage />;
            default:
                return <UserManagementPage />;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                style={{ background: colorBgContainer }}
            >
                <div style={{
                    height: 32,
                    margin: 16,
                    background: 'transparent',
                    borderRadius: 6
                }} />
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['users']}
                    items={menuItems}
                    onSelect={({ key }) => setSelectedKey(key)}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}>
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminPanel;