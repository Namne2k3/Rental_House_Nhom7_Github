import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Alert, Button, Carousel, Descriptions, Empty, Image, Modal,
    Select, Space, Spin, Table, Tag, Typography, Input, Row,
    Col, DatePicker, Form, InputNumber, message
} from 'antd';
import api from '../../../services/api';
import { useState } from 'react';
import { CheckOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { User } from '../../../types';

const { Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const FeedbackManagementPage = () => {
    const [selectedReport, setSelectedReport] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
    const [responseText, setResponseText] = useState('');
    const queryClient = useQueryClient();
    const [filterValues, setFilterValues] = useState({
        reportId: '',  // Thay đổi searchText thành reportId
        reportType: '',
        status: null,
        dateRange: null,
    });
    const [messageApi, contextHolder] = message.useMessage();
    const [filteredData, setFilteredData] = useState<typeof data | null>(null);

    const fetchReports = async () => {
        const { data } = await api.get("/Report"); // Thay URL thực tế
        return data;
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ["reports"],
        queryFn: fetchReports,
        initialData: [],
    });

    const updateStatus = useMutation({
        mutationFn: async ({ id, status, response }: { id: number; status: number; response: string }) => {
            return await api.put(`/Report/UpdateStatus/${id}`, {
                status,
                response,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            setIsResponseModalVisible(false);
            setResponseText('');
        }
    });

    const handleFilter = async () => {
        try {
            const filterInfo = {
                reportId: filterValues.reportId ? parseInt(filterValues.reportId) : null,
                reportType: filterValues.reportType,
                status: filterValues.status,
                startDate: filterValues.dateRange ? dayjs(filterValues.dateRange[0]).format('YYYY-MM-DD') : null,
                endDate: filterValues.dateRange ? dayjs(filterValues.dateRange[1]).format('YYYY-MM-DD') : null
            };

            console.log('Thông tin tìm kiếm:', filterInfo);

            const response = await api.get('/Report/search', {
                params: filterInfo
            });

            setFilteredData(response.data)
        } catch (error) {
            messageApi.error(error.response.data.message);
            setFilteredData(null);
        }
    };

    const resetFilter = () => {
        setFilterValues({
            reportId: '',
            reportType: '',
            status: null,
            dateRange: null,
        });
    };

    const handleResponse = (record: any) => {
        setSelectedReport(record);
        setIsResponseModalVisible(true);
    };

    const statusColors: Record<number, string> = {
        0: "warning",
        1: "success",
        2: "error",
    };

    const statusLabels: Record<number, string> = {
        0: "Chưa duyệt",
        1: "Đã duyệt",
        2: "Đã từ chối"
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 80,
        },
        {
            title: "Loại báo cáo",
            dataIndex: "reportType",
            key: "reportType",
            width: 120,
            render: (type: string) => {
                const colors: { [key: string]: string } = {
                    'ChuNha': 'red',
                    'NoiDung': 'orange',
                    'HinhAnh': 'purple',
                    'Khac': 'default'
                };
                return <Tag color={colors[type] || 'default'}>{type}</Tag>;
            }
        },
        {
            title: "Người báo cáo",
            dataIndex: "user",
            key: "user",
            width: 200,
            render: (user: User) => (
                <Space direction="vertical" size="small">
                    <Text>{user?.fullName}</Text>
                    <Text type="secondary">{user?.email}</Text>
                    <Text type="secondary">{user?.phoneNumber}</Text>
                </Space>
            )
        },
        {
            title: "Nhà trọ",
            dataIndex: "nhaTro",
            key: "nhaTro",
            width: 250,
            render: (nhaTro: any) => nhaTro ? (
                <Space direction="vertical" size="small">
                    <Text strong>{nhaTro.title}</Text>
                    <Text type="secondary">{nhaTro.address}</Text>
                </Space>
            ) : 'Không có'
        },
        {
            title: "Nội dung",
            dataIndex: "description",
            key: "description",
            width: 200,
            ellipsis: true,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status: number) => {
                const statusConfig = {
                    0: { color: 'warning', text: 'Chờ xử lý' },
                    1: { color: 'success', text: 'Đã xử lý' },
                    2: { color: 'error', text: 'Từ chối' }
                };
                return (
                    <Tag color={statusConfig[status]?.color}>
                        {statusConfig[status]?.text}
                    </Tag>
                );
            }
        },
        {
            title: "Ngày báo cáo",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 150,
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            render: (_: any, record: any) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedReport(record);
                            setIsDetailModalVisible(true);
                        }}
                    >
                        Chi tiết
                    </Button>
                    {record.status === 0 && (
                        <Button
                            type="default"
                            icon={<CheckOutlined />}
                            onClick={() => handleResponse(record)}
                        >
                            Phản hồi
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col span={6}>
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Nhập ID báo cáo..."
                        value={filterValues.reportId ? Number(filterValues.reportId) : null}
                        onChange={value => setFilterValues(prev => ({ ...prev, reportId: value?.toString() || '' }))}
                        min={1}
                    />
                </Col>
                <Col span={5}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Loại báo cáo"
                        value={filterValues.reportType}
                        onChange={value => setFilterValues(prev => ({ ...prev, reportType: value }))}
                        allowClear
                    >
                        <Select.Option value="ChuNha">Chủ nhà</Select.Option>
                        <Select.Option value="NoiDung">Nội dung</Select.Option>
                        <Select.Option value="HinhAnh">Hình ảnh</Select.Option>
                        <Select.Option value="Khac">Khác</Select.Option>
                    </Select>
                </Col>
                <Col span={5}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Trạng thái"
                        value={filterValues.status}
                        onChange={value => setFilterValues(prev => ({ ...prev, status: value }))}
                        allowClear
                    >
                        <Select.Option value={0}>Chờ xử lý</Select.Option>
                        <Select.Option value={1}>Đã xử lý</Select.Option>
                        <Select.Option value={2}>Từ chối</Select.Option>
                    </Select>
                </Col>
                <Col span={8}>
                    <Space>
                        <RangePicker
                            style={{ width: 300 }}
                            onChange={(dates) => setFilterValues(prev => ({ ...prev, dateRange: dates }))}
                        />
                        <Button type="primary" onClick={handleFilter}>
                            Tìm kiếm
                        </Button>
                        <Button onClick={resetFilter}>
                            Đặt lại
                        </Button>
                    </Space>
                </Col>
            </Row>

            {data?.length < 1 ? (
                <Empty description="Không có dữ liệu" />
            ) : isLoading ? (
                <div style={{ textAlign: 'center', padding: 50 }}>
                    <Spin size="large" />
                </div>
            ) : error ? (
                <Alert message="Lỗi khi tải dữ liệu" type="error" />
            ) : (
                <Table
                    columns={columns}
                    dataSource={(filteredData || data)?.data || []}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        total: (filteredData || data)?.totalItems,
                        showTotal: (total) => `Tổng ${total} báo cáo`
                    }}
                    scroll={{ x: 1500 }}
                />
            )}

            {/* Modal chi tiết báo cáo */}
            <Modal
                title="Chi tiết báo cáo"
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                width={800}
                footer={null}
            >
                {selectedReport && (
                    <>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="ID báo cáo">{selectedReport.id}</Descriptions.Item>
                            <Descriptions.Item label="Loại báo cáo">
                                <Tag color="blue">{selectedReport.reportType}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={statusColors[selectedReport.status]}>
                                    {statusLabels[selectedReport.status]}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian báo cáo">
                                {dayjs(selectedReport.createdAt).format('DD/MM/YYYY HH:mm')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nội dung báo cáo">
                                {selectedReport.description}
                            </Descriptions.Item>
                            {selectedReport.response && (
                                <Descriptions.Item label="Phản hồi từ admin">
                                    {selectedReport.response}
                                </Descriptions.Item>
                            )}
                        </Descriptions>

                        {selectedReport.nhaTro && (
                            <div style={{ marginTop: 20 }}>
                                <Descriptions title="Thông tin nhà trọ" bordered column={1}>
                                    <Descriptions.Item label="Tiêu đề">{selectedReport.nhaTro.title}</Descriptions.Item>
                                    <Descriptions.Item label="Địa chỉ">{selectedReport.nhaTro.address}</Descriptions.Item>
                                    <Descriptions.Item label="Giá thuê">
                                        {selectedReport.nhaTro.price?.toLocaleString('vi-VN')} VNĐ/tháng
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Chủ nhà">
                                        <Space direction="vertical">
                                            <Text>{selectedReport.nhaTro.owner?.fullName}</Text>
                                            <Text>SĐT: {selectedReport.nhaTro.owner?.phoneNumber}</Text>
                                            <Text>Email: {selectedReport.nhaTro.owner?.email}</Text>
                                        </Space>
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>
                        )}

                        {selectedReport.images?.length > 0 && (
                            <div style={{ marginTop: 20 }}>
                                <Typography.Title level={5}>Hình ảnh đính kèm:</Typography.Title>
                                <Image.PreviewGroup>
                                    <Space wrap>
                                        {selectedReport.images.map((url: string, index: number) => (
                                            <Image
                                                key={index}
                                                src={url}
                                                width={160}
                                                height={160}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ))}
                                    </Space>
                                </Image.PreviewGroup>
                            </div>
                        )}
                    </>
                )}
            </Modal>

            {/* Modal phản hồi báo cáo */}
            <Modal
                title="Phản hồi báo cáo"
                open={isResponseModalVisible}
                onCancel={() => {
                    setIsResponseModalVisible(false);
                    setResponseText('');
                }}
                onOk={() => {
                    if (!responseText.trim()) {
                        message.error('Vui lòng nhập nội dung phản hồi');
                        return;
                    }
                    updateStatus.mutate({
                        id: selectedReport?.id,
                        status: 1,
                        response: responseText
                    });
                }}
                okText="Gửi phản hồi"
                cancelText="Hủy"
            >
                <Form layout="vertical">
                    <Form.Item
                        label="Nội dung phản hồi"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi' }]}
                    >
                        <TextArea
                            rows={4}
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Nhập nội dung phản hồi..."
                        />
                    </Form.Item>
                    <Form.Item label="Trạng thái">
                        <Select
                            defaultValue={1}
                            onChange={(value) => {
                                if (selectedReport) {
                                    updateStatus.mutate({
                                        id: selectedReport.id,
                                        status: value,
                                        response: responseText
                                    });
                                }
                            }}
                        >
                            <Select.Option value={1}>Đã xử lý</Select.Option>
                            <Select.Option value={2}>Từ chối</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default FeedbackManagementPage;