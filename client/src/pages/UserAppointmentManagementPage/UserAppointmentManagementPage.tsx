import { SearchOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Empty, Form, Input, Modal, Select, Space, Spin, Table, Tag, message } from "antd";
import type { Dayjs } from "dayjs";
import moment from "moment";
import { useState } from "react";
import { useAppointmentsUser } from "../../hooks/useAppointmentHook";
import api from "../../services/api";
import { AppointmentHistoryDto } from "../../types/appointment";

const { Option } = Select;
const statusTable = {
    "Pending": "Chờ xác nhận",
    "Confirmed": "Đã xác nhận",
    "Cancelled": "Đã hủy"
} as const;

type StatusType = keyof typeof statusTable;

const UserAppointmentManagementPage = () => {
    const { data: appointments, isLoading } = useAppointmentsUser();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [filterStatus, setFilterStatus] = useState<StatusType | "">("");
    const [filterDate, setFilterDate] = useState<Dayjs | null>(null);
    const queryClient = useQueryClient();

    const handleDelete = async (appointmentId: number) => {
        try {
            const appointmentHistory: AppointmentHistoryDto = {
                id: appointmentId,
                status: "Cancelled",
                notes: "Người dùng đã hủy lịch hẹn",
                changedBy: "1", // TODO: Replace with actual user ID from auth context
                createdAt: new Date().toISOString()
            };

            const response = await api.put(`/Appointment/${appointmentId}`, appointmentHistory);
            if (response.status === 200) {
                messageApi.success("Đã hủy lịch hẹn", 2);
                queryClient.invalidateQueries({ queryKey: ['appointments'] });
            }
        } catch (error) {
            console.error(error);
            messageApi.error("Có lỗi xảy ra khi hủy lịch hẹn", 2);
        }
    };

    const filteredAppointments = appointments?.filter(appt =>
        (searchText ? appt.fullName.toLowerCase().includes(searchText.toLowerCase()) || appt.title.toLowerCase().includes(searchText.toLowerCase()) : true)
        && (filterStatus ? appt.status === filterStatus : true)
        && (filterDate ? moment(appt.createAt).isSame(filterDate.toDate(), 'day') : true)
    );

    const columns = [
        { title: "Mã số", dataIndex: "id", key: "id" },
        { title: "Khách hàng", dataIndex: "userName", key: "userName" },
        { title: "SĐT", dataIndex: "phoneNumber", key: "phoneNumber" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Địa chỉ", dataIndex: "address", key: "address" },
        {
            title: "Ngày tạo", dataIndex: "createAt", key: "createAt",
            render: (date: string) => {
                return <p>{new Date(date).toLocaleString("vi-VN")}</p>
            }
        },
        {
            title: "Trạng thái", dataIndex: "status", key: "status",
            render: (status: StatusType) => {
                const color = status === "Pending" ? "orange" : status === "Confirmed" ? "green" : "red";
                return <Tag color={color}>{statusTable[status]}</Tag>;
            }
        },
        {
            title: "Cập nhật", dataIndex: "updatedAt", key: "updatedAt",
            render: (date: string | null) => date ? moment(date).format("YYYY-MM-DD") : "-"
        },
        {
            title: "Hành động", key: "action",
            render: (_: unknown, record: { id: number }) => (
                <Space>
                    <Button danger onClick={() => handleDelete(record.id)}>Hủy lịch hẹn</Button>
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
                    appointments?.length === 0
                        ?
                        <Empty />
                        :
                        <div>
                            {contextHolder}
                            <Space style={{ marginBottom: 16 }}>
                                <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} onChange={(e) => setSearchText(e.target.value)} />
                                <DatePicker placeholder="Lọc theo ngày tạo" onChange={(date) => setFilterDate(date)} />
                                <Select placeholder="Lọc theo trạng thái" allowClear onChange={setFilterStatus}>
                                    <Option value="Pending">Chờ xác nhận</Option>
                                    <Option value="Confirmed">Đã xác nhận</Option>
                                    <Option value="Cancelled">Đã hủy</Option>
                                </Select>
                            </Space>
                            <Table columns={columns} dataSource={filteredAppointments} rowKey="id" />
                            <Modal title="Thêm lịch hẹn" open={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)}>
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
                                    <Form.Item name="createAt" label="Ngày tạo" rules={[{ required: true, message: "Vui lòng chọn ngày" }]}>
                                        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </div>
            }
        </>
    );
};

export default UserAppointmentManagementPage;
