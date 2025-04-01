import React, { useState } from 'react';
import { Card, Row, Col, Table, Statistic, Spin, Input, Select, DatePicker, Space } from 'antd';
import { Column } from '@ant-design/plots';
import { useRentalViewStats, useRentalStatusStats } from '../../hooks/useRentalStats';
import { RentalViewStats } from '../../types/rental';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import AIAnalysis from '../AIAnalysis/AIAnalysis';
import { renderMatches } from 'react-router';
import { formatCurrencyVnd } from '../../utils';

const { Option } = Select;

const PostStatistics = () => {
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [filterDate, setFilterDate] = useState<moment.Moment | null>(null);

    const {
        data: viewStats,
        isLoading: isLoadingViews,
        error: viewError
    } = useRentalViewStats();

    const {
        data: statusStats,
        isLoading: isLoadingStatus,
        error: statusError
    } = useRentalStatusStats();

    if (isLoadingViews || isLoadingStatus) {
        return <Spin size="large" />;
    }

    if (viewError || statusError) {
        return <div>Đã có lỗi xảy ra khi tải dữ liệu</div>;
    }

    const columns = [
        {
            title: 'Mã số',
            dataIndex: 'id',
            key: 'id',
            render: (date: string) => <strong>{date}</strong>
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            filteredValue: [searchText],
            onFilter: (_, record) =>
                record.title.toLowerCase().includes(searchText.toLowerCase()),
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'postedDate',
            key: 'postedDate',
            render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
            sorter: (a: RentalViewStats, b: RentalViewStats) =>
                new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime(),
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expiredDate',
            key: 'expiredDate',
            render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
            sorter: (a: RentalViewStats, b: RentalViewStats) =>
                new Date(a.expiredDate).getTime() - new Date(b.expiredDate).getTime(),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => formatCurrencyVnd(price)
        },
        {
            title: 'Diện tích',
            dataIndex: 'area',
            key: 'area'
        },
        {
            title: 'Lượt xem',
            dataIndex: 'viewCount',
            key: 'viewCount',
            sorter: (a: RentalViewStats, b: RentalViewStats) => a.viewCount - b.viewCount,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'expiredDate',
            key: 'expiredDate',
            render: (date: string) => {
                const now = new Date();
                const isExpired = new Date(date) < now;
                return (
                    <span style={{ color: isExpired ? 'red' : 'green' }}>
                        {isExpired ? 'Hết hạn' : 'Còn hạn'}
                    </span>
                );
            },
        },
    ];

    const statusData = statusStats ? [
        { type: 'Đang hoạt động', value: statusStats.activePosts },
        { type: 'Đã hết hạn', value: statusStats.expiredPosts },
        { type: 'Chờ duyệt', value: statusStats.pendingPosts },
    ] : [];

    const filteredData = viewStats?.filter(item => {
        const now = new Date();

        const matchesSearch = searchText
            ? item.title.toLowerCase().includes(searchText.toLowerCase())
            : true;

        const matchesStatus = filterStatus
            ? (filterStatus === 'valid' ? new Date(item.expiredDate) >= now : new Date(item.expiredDate) < now)
            : true;

        const matchesDate = filterDate
            ? moment(item.postedDate).isSame(filterDate, 'day')
            : true;

        return matchesSearch && matchesStatus && matchesDate;
    });



    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng số bài đăng"
                            value={statusStats?.totalPosts || 0}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Đang hoạt động"
                            value={statusStats?.activePosts || 0}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Đã hết hạn"
                            value={statusStats?.expiredPosts || 0}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>

            <div style={{ marginBottom: 24 }}>
                <AIAnalysis viewStats={viewStats || []} />
            </div>

            <Card title="Biểu đồ trạng thái bài đăng" style={{ marginBottom: 24 }}>
                <Column
                    data={statusData || []}
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

            <Card title="Bài đăng của bạn">
                <Space style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Tìm kiếm theo địa chỉ"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 200 }}
                    />
                    <Select
                        placeholder="Lọc theo hạn sử dụng"
                        allowClear
                        style={{ width: 200 }}
                        onChange={setFilterStatus}
                    >
                        <Option value="valid">Còn hạn</Option>
                        <Option value="expired">Hết hạn</Option>
                    </Select>

                    <DatePicker
                        placeholder="Lọc theo ngày đăng"
                        onChange={setFilterDate}
                        style={{ width: 200 }}
                    />
                </Space>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default PostStatistics;