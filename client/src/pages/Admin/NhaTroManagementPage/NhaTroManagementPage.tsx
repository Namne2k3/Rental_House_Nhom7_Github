import {
    Button, Space, Table, Tag, Modal, message, Input, Spin, Typography,
    notification, Tooltip, Badge, Drawer, Descriptions, Image,
    Form, Switch, Divider, Select, InputNumber, Upload
} from 'antd';
import './style.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    CheckOutlined, CloseOutlined, EyeOutlined, LoadingOutlined,
    SmileOutlined, DeleteOutlined, ExclamationCircleOutlined,
    EditOutlined, UploadOutlined
} from '@ant-design/icons';

import { useState } from 'react';
import api from '../../../services/api';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setCurrentPagination } from '../../../store/slices/pageSlice';
import { searchRentals } from '../../../store/slices/searchSlice';


const { Search } = Input;
const { Title } = Typography;

interface NhaTro {
    id: number;
    title: string;
    address: string;
    price: number;
    status: 0 | 1;
    postedDate: string;
    fullName: string;
    email: string;
    description?: string;
    rejectionReason?: string;
    approvedDate?: string;
    imageUrls: string[];
    isActive: boolean;
}

const NhaTroManagementPage = () => {
    const { currentPagination, currentPageSize } = useAppSelector((state) => state.page);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const [rejectReason, setRejectReason] = useState<string>('');
    const [notificationApi, contextHolder] = notification.useNotification();
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedNhaTro, setSelectedNhaTro] = useState<NhaTro | null>(null);
    const [editingImages, setEditingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const { search } = useAppSelector((state) => state.search)
    const [editForm] = Form.useForm();
    const [modal, contextHolerModal] = Modal.useModal();
    const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});
    const [filterStatus, setFilterStatus] = useState<number | null>(null);
    const [filterIsActive, setFilterIsActive] = useState<boolean | null>(null);
    const [searchTitle, setSearchTitle] = useState<string>('');
    const [filterPriceRange, setFilterPriceRange] = useState<[number, number] | null>(null);
    const [filterAreaRange, setFilterAreaRange] = useState<[number, number] | null>(null);
    const [messageApi, messageApiContextHolder] = message.useMessage()
    const { data: nhaTros, isLoading } = useQuery({
        queryKey: ['nhaTros', currentPagination, currentPageSize],
        queryFn: async () => {
            const response = await api.get('/NhaTro/GetAllNhaTros', {
                params: {
                    page: currentPagination,
                    pageSize: currentPageSize,
                    title: search
                }
            });
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 2,
    });

    const [filteredData, setFilteredData] = useState<typeof nhaTros | null>(null);

    const handleTableChange = (pagination: any, filters: any) => {
        setFilteredInfo(filters);
        handleChangePagination(pagination.current, pagination.pageSize);
    };

    // View detail handler
    const showDetail = (record: NhaTro) => {
        setSelectedNhaTro(record);
        setDetailVisible(true);
    };

    const updateNhaTro = useMutation({
        mutationFn: async (data: Partial<NhaTro>) => {
            const formData = new FormData();

            // Append basic data
            formData.append('nhaTroData', JSON.stringify(data));

            // Append existing images that weren't deleted
            formData.append('existingImages', JSON.stringify(editingImages));

            // Append new images
            newImages.forEach(file => {
                formData.append('newImages', file);
            });

            return api.put(`/NhaTro/${data.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nhaTros'] });
            messageApi.success('Cập nhật thành công');
            setIsEditModalVisible(false);
            setNewImages([]);
            setEditingImages([]);
        },
        onError: () => {
            messageApi.error('Có lỗi xảy ra khi cập nhật');
        }
    });

    const updateStatus = useMutation({
        mutationFn: async ({ id, status, reason }: { id: number; status: number; reason?: string }) => {
            return await api.put(`/NhaTro/updateStatus/${id}`, {
                reason,
                status
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nhaTros'] });
            notificationApi.open({
                message: 'Cập nhật trạng thái thành công',
                icon: <SmileOutlined style={{ color: '#108ee9' }} />
            });
        },
        onError: () => messageApi.error('Có lỗi xảy ra khi cập nhật trạng thái')
    });

    const handleChangePagination = (page: number, pageSize: number) => {
        dispatch(setCurrentPagination({ currentPagination: page, currentPageSize: pageSize }));
    };

    const handleApprove = (id: number) => {
        modal.confirm({
            title: 'Xác nhận duyệt',
            content: 'Bạn có chắc chắn muốn duyệt bài đăng này?',
            onOk: () => updateStatus.mutate({ id, status: 1 })
        });
    };

    const handleEdit = (record: NhaTro) => {
        editForm.setFieldsValue({
            id: record.id,
            title: record.title,
            address: record.address,
            price: record.price,
            description: record.description,
            isActive: record.isActive,
        });
        setEditingImages(record.imageUrls);
        setIsEditModalVisible(true);
    };

    const handleUploadChange = ({ file }: { file: File }) => {
        if (file) {
            setNewImages(prev => [...prev, file]);
            const imageUrl = URL.createObjectURL(file);
            setEditingImages(prev => [...prev, imageUrl]);
        }
    };

    const handleDeleteImage = (index: number) => {
        setEditingImages(prev => prev.filter((_, i) => i !== index));
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleReject = (id: number) => {
        modal.confirm({
            title: 'Từ chối bài đăng',
            content: (
                <div>
                    <p>Vui lòng nhập lý do từ chối:</p>
                    <Input.TextArea
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                </div>
            ),
            onOk: () => {
                if (!rejectReason) {
                    messageApi.error('Vui lòng nhập lý do từ chối');
                    return;
                }
                updateStatus.mutate({
                    id,
                    status: 0,
                    reason: rejectReason
                });
                setRejectReason('');
            }
        });
    };

    const handleDelete = (id: number) => {
        modal.confirm({
            title: 'Xác nhận xóa',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await api.delete(`/NhaTro/${id}`);
                    queryClient.invalidateQueries({ queryKey: ['nhaTros'] });
                    messageApi.success('Xóa bài đăng thành công');
                } catch (error) {
                    messageApi.error('Có lỗi xảy ra khi xóa bài đăng' + error);
                }
            },
        });
    };

    const handleSubmit = (values: any) => {
        console.log('Form values:', values);
        console.log('New images:', newImages);
        console.log('Existing images:', editingImages);

        // Continue with the existing update logic
        updateNhaTro.mutate(values);
    };



    const handleStatusChange = (record: NhaTro, checked: boolean) => {
        modal.confirm({
            title: 'Xác nhận thay đổi trạng thái',
            content: `Bạn có chắc chắn muốn ${checked ? 'kích hoạt' : 'vô hiệu hóa'} nhà trọ này?`,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => {
                console.log('ID nhà trọ:', record.id);
                console.log('Trạng thái mới:', checked);
                handleUpdateStatus(record.id, checked);
            }
        });
    };

    const handleApproveStatus = (id: number, newStatus: number, reason?: string) => {
        modal.confirm({
            title: newStatus === 1 ? 'Xác nhận duyệt bài đăng' : 'Xác nhận từ chối bài đăng',
            content: newStatus === 2 ? (
                <div>
                    <p>Vui lòng nhập lý do từ chối:</p>
                    <Input.TextArea
                        rows={4}
                        value={reason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                </div>
            ) : 'Bạn có chắc chắn muốn duyệt bài đăng này?',
            onOk: async () => {
                if (newStatus === 2 && !rejectReason) {
                    messageApi.error('Vui lòng nhập lý do từ chối');
                    return;
                }
                try {
                    // Log thông tin để backend xử lý sau
                    console.log('Cập nhật trạng thái:', {
                        id,
                        newStatus,
                        reason: rejectReason
                    });
                    messageApi.success('Cập nhật trạng thái thành công');
                    setRejectReason('');
                } catch (error) {
                    messageApi.error('Có lỗi xảy ra khi cập nhật trạng thái');
                }
            }
        });
    };

    const handleSearch = async () => {
        try {
            const response = await api.get('/NhaTro/search', {
                params: {
                    title: searchTitle,
                    status: filterStatus,
                    isActive: filterIsActive,
                    minPrice: filterPriceRange?.[0],
                    maxPrice: filterPriceRange?.[1],
                    minArea: filterAreaRange?.[0],
                    maxArea: filterAreaRange?.[1],
                    page: currentPagination,
                    pageSize: currentPageSize
                }
            });

            setFilteredData(response.data);
        } catch (error) {
            messageApi.error('Có lỗi xảy ra khi tìm kiếm');
            setFilteredData(null);
        }
    };

    const columns = [
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            render: (_: unknown, record: NhaTro) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="primary"
                            ghost
                            icon={<EyeOutlined />}
                            onClick={() => showDetail(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: 300,
            ellipsis: true,
        },
        {
            title: 'Diện tích (m²)',
            dataIndex: 'area',
            key: 'area',
            width: 120,
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'postedDate',
            key: 'postedDate',
            width: 120,
            render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expiredDate',
            key: 'expiredDate',
            width: 120,
            render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 120,
            render: (isActive: boolean, record: NhaTro) => (
                <Switch
                    checked={isActive}
                    onChange={(checked) => handleStatusChange(record, checked)}
                    checkedChildren="Hoạt động"
                    unCheckedChildren="Vô hiệu"
                />
            ),
        },
        {
            title: 'Trạng thái duyệt',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (status: number, record: NhaTro) => {
                let color = 'default';
                let text = 'Chờ duyệt';

                if (status === 1) {
                    color = 'success';
                    text = 'Đã duyệt';
                } else if (status === 2) {
                    color = 'error';
                    text = 'Đã từ chối';
                }

                return (
                    <Space direction="vertical">
                        <Tag color={color}>{text}</Tag>
                        {status === 0 && (
                            <Space>
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={() => handleApproveStatus(record.id, 1)}
                                >
                                    Duyệt
                                </Button>
                                <Button
                                    danger
                                    size="small"
                                    onClick={() => handleApproveStatus(record.id, 2)}
                                >
                                    Từ chối
                                </Button>
                            </Space>
                        )}
                    </Space>
                );
            },
            filters: [
                { text: 'Chờ duyệt', value: 0 },
                { text: 'Đã duyệt', value: 1 },
                { text: 'Đã từ chối', value: 2 },
            ],
        },
    ];

    const handleUpdateStatus = async (id: number, isActive: boolean) => {
        try {
            await api.put(`/NhaTro/UpdateActive/${id}`, isActive);
            queryClient.invalidateQueries({ queryKey: ['nhaTros'] });
            messageApi.success('Cập nhật trạng thái thành công');
        } catch (error) {
            messageApi.error('Có lỗi xảy ra khi cập nhật trạng thái ' + error);
        }
    };

    return (
        <>
            {contextHolder}
            {contextHolerModal}
            {messageApiContextHolder}
            <div>
                <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <Input
                        placeholder="Tìm kiếm theo tiêu đề..."
                        style={{ width: 200 }}
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                    />

                    <Select
                        style={{ width: 150 }}
                        placeholder="Trạng thái duyệt"
                        allowClear
                        value={filterStatus}
                        onChange={setFilterStatus}
                    >
                        <Select.Option value={0}>Chờ duyệt</Select.Option>
                        <Select.Option value={1}>Đã duyệt</Select.Option>
                        <Select.Option value={2}>Đã từ chối</Select.Option>
                    </Select>

                    <Select
                        style={{ width: 150 }}
                        placeholder="Trạng thái hiển thị"
                        allowClear
                        value={filterIsActive}
                        onChange={setFilterIsActive}
                    >
                        <Select.Option value={true}>Đang hiển thị</Select.Option>
                        <Select.Option value={false}>Đã ẩn</Select.Option>
                    </Select>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span>Giá:</span>
                        <InputNumber
                            style={{ width: 120 }}
                            placeholder="Từ"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                            onChange={(value) => setFilterPriceRange(prev => [value || 0, prev?.[1] || 0])}
                        />
                        <span>-</span>
                        <InputNumber
                            style={{ width: 120 }}
                            placeholder="Đến"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                            onChange={(value) => setFilterPriceRange(prev => [prev?.[0] || 0, value || 0])}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span>Diện tích:</span>
                        <InputNumber
                            style={{ width: 100 }}
                            placeholder="Từ"
                            onChange={(value) => setFilterAreaRange(prev => [value || 0, prev?.[1] || 0])}
                        />
                        <span>-</span>
                        <InputNumber
                            style={{ width: 100 }}
                            placeholder="Đến"
                            onChange={(value) => setFilterAreaRange(prev => [prev?.[0] || 0, value || 0])}
                        />
                        <span>m²</span>
                    </div>

                    <Button type="primary" onClick={handleSearch}>
                        Tìm kiếm
                    </Button>

                    <Button onClick={() => {
                        setSearchTitle('');
                        setFilterStatus(null);
                        setFilterIsActive(null);
                        setFilterPriceRange(null);
                        setFilterAreaRange(null);
                    }}>
                        Đặt lại
                    </Button>
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: 50 }}>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
                    </div>
                ) : (
                    <>
                        <Table
                            columns={columns}
                            dataSource={(filteredData || nhaTros)?.data}
                            loading={isLoading}
                            rowKey="id"
                            onChange={handleTableChange}
                            pagination={{
                                current: currentPagination,
                                pageSize: currentPageSize,
                                total: (filteredData || nhaTros)?.totalItems,
                                showSizeChanger: true,
                                showTotal: (total) => `Tổng số ${total} bài đăng`,
                            }}
                            scroll={{ x: 'max-content' }}
                            bordered
                        />
                        <Modal
                            title="Chi tiết bài đăng"
                            open={detailVisible}
                            onCancel={() => setDetailVisible(false)}
                            width={800}
                            footer={null}
                        >
                            {selectedNhaTro && (
                                <>
                                    <Descriptions bordered column={1}>
                                        <Descriptions.Item label="Tiêu đề">{selectedNhaTro.title}</Descriptions.Item>
                                        <Descriptions.Item label="Địa chỉ">{selectedNhaTro.address}</Descriptions.Item>
                                        <Descriptions.Item label="Giá thuê">
                                            {selectedNhaTro.price?.toLocaleString('vi-VN')} VNĐ/tháng
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Diện tích">
                                            {selectedNhaTro.area} m²
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Số phòng ngủ">
                                            {selectedNhaTro.bedRoomCount || 'Không có thông tin'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Số phòng tắm">
                                            {selectedNhaTro.bathRoom || 'Không có thông tin'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Ngày đăng">
                                            {new Date(selectedNhaTro.postedDate).toLocaleDateString('vi-VN')}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Ngày hết hạn">
                                            {new Date(selectedNhaTro.expiredDate).toLocaleDateString('vi-VN')}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Trạng thái">
                                            <Tag color={selectedNhaTro.isActive ? 'green' : 'red'}>
                                                {selectedNhaTro.isActive ? 'Đang hoạt động' : 'Vô hiệu'}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Liên kết">
                                            <a href={selectedNhaTro.url} target="_blank" rel="noopener noreferrer">
                                                Xem trên website
                                            </a>
                                        </Descriptions.Item>
                                    </Descriptions>

                                    <Divider orientation="left">Thông tin người đăng</Divider>
                                    <Descriptions bordered column={1}>
                                        <Descriptions.Item label="Họ tên">{selectedNhaTro.fullName}</Descriptions.Item>
                                        <Descriptions.Item label="Số điện thoại">{selectedNhaTro.phoneNumber}</Descriptions.Item>
                                        <Descriptions.Item label="Email">{selectedNhaTro.email}</Descriptions.Item>
                                    </Descriptions>

                                    <Divider orientation="left">Mô tả</Divider>
                                    <div style={{ whiteSpace: 'pre-line', marginBottom: '20px' }}>
                                        {selectedNhaTro.description}
                                    </div>

                                    <Divider orientation="left">Hình ảnh</Divider>
                                    <div style={{ marginTop: 16 }}>
                                        <Image.PreviewGroup>
                                            <Space wrap>
                                                {selectedNhaTro.imageUrls.map((url, index) => (
                                                    <Image
                                                        key={index}
                                                        width={180}
                                                        src={url}
                                                        alt={`Ảnh ${index + 1}`}
                                                    />
                                                ))}
                                            </Space>
                                        </Image.PreviewGroup>
                                    </div>
                                </>
                            )}
                        </Modal>
                        <Modal
                            title="Chỉnh sửa thông tin nhà trọ"
                            open={isEditModalVisible}
                            onCancel={() => setIsEditModalVisible(false)}
                            footer={null}
                        >
                            <Form
                                form={editForm}
                                layout="vertical"
                                onFinish={handleSubmit}
                            >
                                <Form.Item name="id" hidden>
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="title"
                                    label="Tiêu đề"
                                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="address"
                                    label="Địa chỉ"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="price"
                                    label="Giá"
                                    rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="description"
                                    label="Mô tả"
                                >
                                    <Input.TextArea rows={4} />
                                </Form.Item>

                                <Form.Item
                                    name="isActive"
                                    label="Trạng thái hoạt động"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
                                </Form.Item>

                                <Form.Item label="Danh sách ảnh hiện tại">
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {editingImages.map((url, index) => (
                                            <div key={index} style={{ position: 'relative' }}>
                                                <img
                                                    src={url}
                                                    alt={`Ảnh ${index + 1}`}
                                                    style={{
                                                        width: 100,
                                                        height: 100,
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <Button
                                                    type="text"
                                                    icon={<DeleteOutlined />}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        color: 'red',
                                                        background: 'rgba(255,255,255,0.8)'
                                                    }}
                                                    onClick={() => handleDeleteImage(index)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </Form.Item>

                                <Form.Item label="Thêm ảnh mới">
                                    <Upload
                                        beforeUpload={() => false}
                                        onChange={handleUploadChange}
                                        multiple
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item>
                                    <Space>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={updateNhaTro.isPending}
                                        >
                                            Cập nhật
                                        </Button>
                                        <Button onClick={() => {
                                            setIsEditModalVisible(false);
                                            setNewImages([]);
                                            setEditingImages([]);
                                        }}>
                                            Hủy
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </>
                )}
            </div>
        </>
    );
};

export default NhaTroManagementPage;