import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Upload, message } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useState } from 'react';
import { COLORS } from '../../constants/colors';
import Text from '../../components/TextComponent/Text';
import { fonts } from '../../constants/fonts';
import api from '../../services/api';
import { useAppSelector } from '../../hooks';

const { TextArea } = Input;

const CreateNewRentalPostPage = () => {
    const { user } = useAppSelector((state) => state.auth)
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage()

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);

            // Create FormData
            const formData = new FormData();

            // Create nhaTroData object
            const nhaTroData = {
                id: 0, // Default value for new entry
                title: values.title,
                address: values.address,
                description: values.description,
                descriptionHtml: values.description, // Same as description for now
                url: null,
                price: values.price,
                priceExt: null,
                area: values.area,
                bedRoom: values.bathRoom, // Map to bathroom count
                postedDate: new Date(),
                expiredDate: null,
                type: null,
                code: null,
                bedRoomCount: values.bedRoomCount,
                bathRoom: values.bathRoom,
                furniture: values.furniture,
                latitude: values.latitude,
                longitude: values.longitude,
                priceBil: null,
                priceMil: null,
                priceVnd: values.price,
                areaM2: values.area,
                pricePerM2: values.price / values.area,
                userId: user?.id,
                fullName: user?.fullName || '',
                phoneNumber: user?.phoneNumber || '',
                email: user?.email || '',
                images: [] // Will be handled separately
            };

            // Add nhaTroData as JSON string
            formData.append('nhaTroData', JSON.stringify(nhaTroData));

            // Add images
            fileList.forEach(file => {
                formData.append('images', file);
            });

            const response = await api.post('/NhaTro', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.isSuccess) {
                messageApi.success('Tạo tin đăng thành công');
                form.resetFields();
                setFileList([]);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error: any) {
            messageApi.error('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Add validation for the form
    const validateForm = {
        price: [
            { required: true, message: 'Vui lòng nhập giá thuê!' },
            { type: 'number', min: 0, message: 'Giá thuê phải lớn hơn 0!' }
        ],
        area: [
            { required: true, message: 'Vui lòng nhập diện tích!' },
            { type: 'number', min: 0, message: 'Diện tích phải lớn hơn 0!' }
        ],
        title: [
            { required: true, message: 'Vui lòng nhập tiêu đề!' },
            { max: 500, message: 'Tiêu đề không được quá 500 ký tự!' }
        ],
        address: [
            { required: true, message: 'Vui lòng nhập địa chỉ!' },
            { max: 255, message: 'Địa chỉ không được quá 255 ký tự!' }
        ]
    };

    const beforeUpload = (file: RcFile) => {
        const isImage = file.type.startsWith('image/');
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isImage) {
            messageApi.error('Chỉ được upload file ảnh!');
            return false;
        }

        if (!isLt2M) {
            messageApi.error('Ảnh phải nhỏ hơn 2MB!');
            return false;
        }

        setFileList(prev => [...prev, file]);
        return false; // Return false to prevent auto upload
    };

    return (
        <>
            {contextHolder}
            <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 16px' }}>
                <Text
                    fontFamily={fonts.bold}
                    fontSize={32}
                    text='Đăng tin cho thuê'
                />
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Số phòng ngủ"
                                name="bedRoomCount"
                                rules={[{ required: true, message: 'Vui lòng nhập số phòng ngủ!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    placeholder="Nhập số phòng ngủ"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Số phòng tắm"
                                name="bathRoom"
                                rules={[{ required: true, message: 'Vui lòng nhập số phòng tắm!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    placeholder="Nhập số phòng tắm"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Nội thất"
                        name="furniture"
                    >
                        <Input placeholder="Mô tả nội thất (VD: Có máy lạnh, tủ lạnh,...)" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Vĩ độ (Latitude)"
                                name="latitude"
                                rules={[{ required: true, message: 'Vui lòng nhập vĩ độ!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="VD: 10.762622"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Kinh độ (Longitude)"
                                name="longitude"
                                rules={[{ required: true, message: 'Vui lòng nhập kinh độ!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="VD: 106.660172"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Tiêu đề"
                                name="title"
                                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                            >
                                <Input placeholder="Nhập tiêu đề bài đăng" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            >
                                <Input placeholder="Nhập địa chỉ nhà trọ" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Giá thuê (VNĐ)"
                                name="price"
                                rules={validateForm.price}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                                    placeholder="Nhập giá thuê"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Diện tích (m²)"
                                name="area"
                                rules={validateForm.area}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Nhập diện tích"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Mô tả chi tiết"
                        name="description"
                    >
                        <TextArea
                            rows={6}
                            placeholder="Nhập mô tả chi tiết về nhà trọ..."
                            style={{
                                minHeight: 150,
                                resize: 'vertical'
                            }}
                        />
                    </Form.Item>

                    <Form.Item name="imageUrls" label="Hình ảnh" rules={[{ required: true, message: 'Vui lòng tải lên ít nhất 1 ảnh!' }]}>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            beforeUpload={beforeUpload}
                            onRemove={(file) => {
                                setFileList(fileList.filter(item => item !== file));
                            }}
                            multiple
                        >
                            {fileList.length >= 8 ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{
                                backgroundColor: COLORS.DARK_SLATE,
                                width: '100%'
                            }}
                        >
                            Đăng tin
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default CreateNewRentalPostPage;