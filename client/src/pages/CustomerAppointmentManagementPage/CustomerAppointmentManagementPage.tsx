import { SearchOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Empty, Form, Input, Modal, Popover, Row, Select, Space, Spin, Table, Tag, message } from "antd";
import moment from "moment";
import { useState } from "react";
import { useAppointmentsCustomer } from "../../hooks/useAppointmentHook";
import api from "../../services/api";
import { AppointmentHistoryDto } from "../../types/appointment";
import { useAppSelector } from "../../hooks";


const { Option } = Select;
const statusTable = {
    "Pending": "Chờ xác nhận",
    "Confirmed": "Đã xác nhận",
    "Cancelled": "Đã hủy"
}
const CustomerAppointmentManagementPage = () => {
    const { user } = useAppSelector((state) => state.auth);
    const { data: appointments, isLoading, error } = useAppointmentsCustomer();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [filterStatus, setFilterStatus] = useState("Pending");
    const [filterDate, setFilterDate] = useState(null);
    const queryClient = useQueryClient()
    const handleOk = () => {
        // form.validateFields().then((values) => {
        //     const updatedAppointments = editingAppointment
        //         ? appointments.map((appt) =>
        //             appt.userId === editingAppointment.userId ? { ...appt, ...values, createdAt: values.createdAt.format("YYYY-MM-DD") } : appt
        //         )
        //         : [...appointments, { userId: Date.now(), ...values, createdAt: values.createdAt.format("YYYY-MM-DD"), updatedAt: null }];

        //     setAppointments(updatedAppointments);
        //     setIsModalOpen(false);
        //     setEditingAppointment(null);
        //     form.resetFields();
        // });
    };

    const handleDelete = (userId) => {
        // setAppointments(appointments.filter((appt) => appt.userId !== userId));
    };

    const handleStatusChange = async (appointmentId: number, newStatus: string) => {
        try {
            const appointmentHistory: AppointmentHistoryDto = {
                id: appointmentId,
                status: newStatus,
                notes: newStatus === "Confirmed" ? "Đã xác nhận lịch hẹn" : "Đã hủy lịch hẹn",
                changedBy: user?.id?.toString() || "",
                createdAt: new Date().toISOString()
            };

            const response = await api.put(`/Appointment/${appointmentId}`, appointmentHistory);

            if (response.status === 200) {
                if (newStatus === "Confirmed") {
                    messageApi.success("Đã duyệt lịch hẹn", 2);
                } else {
                    messageApi.success("Đã hủy lịch hẹn", 2);
                }
                queryClient.invalidateQueries({ queryKey: ['appointments'] });
            }
        } catch (error) {
            console.error(error);
            messageApi.error("Có lỗi xảy ra khi cập nhật trạng thái", 2);
        }
    };

    const filteredAppointments = appointments?.filter(appt =>
        (searchText ? appt.fullName.toLowerCase().includes(searchText.toLowerCase()) || appt.title.toLowerCase().includes(searchText.toLowerCase()) : true)
        && (filterStatus ? appt.status === filterStatus : true)
        && (filterDate ? moment(appt.createdAt).isSame(filterDate, 'day') : true)
    );

    const columns = [
        { title: "Mã số", dataIndex: "id", key: "id" },
        { title: "Khách hàng", dataIndex: "userName", key: "userName" },
        { title: "SĐT", dataIndex: "phoneNumber", key: "phoneNumber" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Địa chỉ", dataIndex: "address", key: "address" },
        {
            title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt",
            render: (date: string) => {
                return <p>{new Date(date).toLocaleString("vi-VN")}</p>
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "Chờ xác nhận", value: "Pending" },
                { text: "Đã xác nhận", value: "Confirmed" },
                { text: "Đã hủy", value: "Cancelled" },
            ],
            onFilter: (value: string, record) => record.status === value,
            render: (status) => {
                const color = status === "Pending" ? "orange" : status === "Confirmed" ? "green" : "red";
                return <Tag color={color}>{statusTable[status]}</Tag>;
            }
        },
        {
            title: "Cập nhật", dataIndex: "updatedAt", key: "updatedAt",
            render: (date) => date ? moment(date).format("YYYY-MM-DD") : "-"
        },
        {
            title: "Hành động", key: "action",
            render: (_, record) => (
                <Space>
                    <Popover
                        content={
                            <Row style={{ gap: 8 }}>
                                <Button onClick={() => handleStatusChange(record.id, "Confirmed")}>Duyệt</Button>
                                <Button onClick={() => handleStatusChange(record.id, "Cancelled")}>Hủy</Button>
                            </Row>
                        }
                    >
                        <Button>Xác nhận</Button>
                    </Popover>
                    <Button danger onClick={() => handleDelete(record.userId)}>Xóa</Button>
                </Space>
            )
        }
    ];

    return (
        <>
            {
                isLoading ?
                    <Spin />
                    :
                    appointments?.length == 0
                        ?
                        <Empty description="Chưa có dữ liệu" />
                        :
                        <div>
                            {contextHolder}
                            <Space style={{ marginBottom: 16 }}>
                                <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} onChange={(e) => setSearchText(e.target.value)} />
                                <DatePicker placeholder="Lọc theo ngày tạo" onChange={(date) => setFilterDate(date)} />
                                <Select
                                    style={{ width: 200 }}
                                    defaultValue="Pending"
                                    placeholder="Lọc theo trạng thái"
                                    onChange={setFilterStatus}
                                    allowClear
                                >
                                    <Option value="Pending">
                                        <Tag color="orange">Chờ xác nhận</Tag>
                                    </Option>
                                    <Option value="Confirmed">
                                        <Tag color="green">Đã xác nhận</Tag>
                                    </Option>
                                    <Option value="Cancelled">
                                        <Tag color="red">Đã hủy</Tag>
                                    </Option>
                                </Select>
                            </Space>
                            <Table columns={columns} dataSource={filteredAppointments} rowKey="userId" />
                            {/* <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm lịch hẹn</Button> */}
                            <Modal title={editingAppointment ? "Chỉnh sửa lịch hẹn" : "Thêm lịch hẹn"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
                                <Form form={form} layout="vertical">
                                    <Form.Item name="fullName" label="Tên khách hàng" rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="address" label="Địa chỉ">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="createdAt" label="Ngày tạo" rules={[{ required: true, message: "Vui lòng chọn ngày" }]}>
                                        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </div>
            }
        </>
    );
};

export default CustomerAppointmentManagementPage;
