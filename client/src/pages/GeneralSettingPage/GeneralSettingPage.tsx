import type { TabsProps } from 'antd';
import { Card, Col, Row, Tabs, Typography } from 'antd';
import AccountActivity from '../../components/AccountActivity/AccountActivity';
import AppointmentStatistics from '../../components/AppointmentStatistics/AppointmentStatistics';
import PostStatistics from '../../components/PostStatistics/PostStatistics';
import MyAppointment from '../MyAppointment/MyAppointment';
import OwnerAppointment from '../CustomerAppointment/OwnerAppointment';


const { Title } = Typography;

const GeneralSettingPage = () => {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thống kê bài đăng của bạn',
            children: <PostStatistics />,
        },
        // {
        //     key: '2',
        //     label: 'Thống kê lịch hẹn',
        //     children: <AppointmentStatistics />,
        // },
        // {
        //     key: '3',
        //     label: 'Lịch hẹn của bạn',
        //     children: <MyAppointment />,
        // },
        // {
        //     key: '4',
        //     label: 'Lịch hẹn với khách hàng',
        //     children: <OwnerAppointment />,
        // },
        // {
        //     key: '5',
        //     label: 'Hoạt động tài khoản',
        //     children: <AccountActivity />,
        // },
    ];

    return (
        <div className="general-setting-container" >
            {/* <Title level={2}>Thống kê tổng quan</Title> */}

            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card>
                        <Tabs defaultActiveKey="1" items={items} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default GeneralSettingPage;