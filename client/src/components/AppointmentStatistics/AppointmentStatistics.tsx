import React from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Space, Button, Badge, Tag } from 'antd';
import { Column } from '@ant-design/plots';
import { useAppointmentStats } from '../../hooks/useAppointmentHook';
import moment from 'moment';

const { RangePicker } = DatePicker;

const STATUS_COLORS = {
    Pending: 'warning',
    Confirmed: 'processing',
    Completed: 'success',
    Cancelled: 'error'
};

const AppointmentStatistics = () => {
    const [dateRange, setDateRange] = React.useState<[moment.Moment, moment.Moment] | null>(null);
    const { data: stats, isLoading } = useAppointmentStats({
        startDate: dateRange?.[0]?.toISOString(),
        endDate: dateRange?.[1]?.toISOString()
    });

    const statusData = stats ? [
        { type: 'Chờ xác nhận', value: stats.pendingAppointments },
        { type: 'Đã xác nhận', value: stats.confirmedAppointments },
        { type: 'Hoàn thành', value: stats.completedAppointments },
        { type: 'Đã hủy', value: stats.cancelledAppointments },
    ] : [];

    const columns = [
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => moment(date).format('DD/MM/YYYY')
        },
        {
            title: 'Khách hàng',
            dataIndex: 'user',
            key: 'user',
            render: (_, record: any) => (
                <Space direction="vertical" size="small">
                    <div><strong>{record.userName}</strong></div>
                    <div>{record.userPhone}</div>
                    <div>{record.userEmail}</div>
                </Space>
            )
        },
        {
            title: 'Nhà trọ',
            dataIndex: 'nhaTro',
            key: 'nhaTro',
            render: (_, record: any) => (
                <Space direction="vertical" size="small">
                    <div><strong>{record.nhaTroTitle}</strong></div>
                    <div>{record.nhaTroAddress}</div>
                    <div>Giá: {record.nhaTroPrice.toLocaleString('vi-VN')} VNĐ</div>
                </Space>
            )
        },
        {
            title: 'Thời gian hẹn',
            dataIndex: 'appointmentTime',
            key: 'appointmentTime',
            render: (time: string) => moment(time).format('HH:mm DD/MM/YYYY')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={STATUS_COLORS[status as keyof typeof STATUS_COLORS]}>
                    {status}
                </Tag>
            )
        },
        {
            title: 'Ghi chú',
            dataIndex: 'notes',
            key: 'notes',
            ellipsis: true
        }
    ];

    return (
        <div>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Bộ lọc thời gian */}
                <Card>
                    <Space>
                        <RangePicker
                            onChange={(dates) => setDateRange(dates as [moment.Moment, moment.Moment])}
                            style={{ width: 300 }}
                        />
                        <Button type="primary">Xem thống kê</Button>
                    </Space>
                </Card>

                {/* Thống kê tổng quan */}
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Tổng số lịch hẹn"
                                value={stats?.totalAppointments || 0}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Chờ xác nhận"
                                value={stats?.pendingAppointments || 0}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Đã xác nhận"
                                value={stats?.confirmedAppointments || 0}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Hoàn thành"
                                value={stats?.completedAppointments || 0}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Biểu đồ thống kê */}
                <Card title="Biểu đồ trạng thái lịch hẹn">
                    <Column
                        data={statusData}
                        xField="type"
                        yField="value"
                        label={{
                            position: 'middle',
                            style: {
                                fill: '#FFFFFF',
                                opacity: 0.6,
                            },
                        }}
                    />
                </Card>

                {/* Bảng chi tiết */}
                <Card title="Chi tiết lịch hẹn theo ngày">
                    <Table
                        columns={columns}
                        dataSource={stats?.dailyStats || []}
                        rowKey="date"
                        loading={isLoading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng số ${total} ngày`
                        }}
                    />
                </Card>
            </Space>
        </div>
    );
};

export default AppointmentStatistics;