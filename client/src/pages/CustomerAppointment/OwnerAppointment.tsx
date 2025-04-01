import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useAppSelector } from "../../hooks";
import { Button, Table, Tag, message, Modal, Input, List, Select } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const fetchOwnerAppointments = async (ownerId: number) => {
    const { data } = await api.get(`/Appointment/Owner/${ownerId}`);
    return data;
};

const searchAppointments = async (params: {
    userId?: number,
    ownerId?: number,
    searchField?: string,
    searchValue?: string,
    status?: string,
    searchType: 'owner' | 'user'
}) => {
    console.log("Search params being sent to backend:", params);
    try {
        const { data } = await api.get(`/Appointment/search`, { params });
        return data;
    } catch (error) {
        console.error("Error searching appointments:", error);
        throw error;
    }
};

const updateAppointmentStatus = async ({ id, status, notes, changedById }: { id: number; status: string; notes: string, changedById: number }) => {
    await api.put(`/Appointment/${id}/status`, { status, notes, changedById });
};

const fetchAppointmentHistory = async (appointmentId: number) => {
    const { data } = await api.get(`/Appointment/${appointmentId}/history`);
    return data;
};

const OwnerAppointment = () => {
    const queryClient = useQueryClient();
    const { user } = useAppSelector((state) => state.auth);
    const [searchField, setSearchField] = useState<string>('customerName');
    const [searchValue, setSearchValue] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filteredData, setFilteredData] = useState(null);

    const { data: appointments, isLoading } = useQuery({
        queryKey: ["ownerAppointments"],
        queryFn: () => fetchOwnerAppointments(parseInt(user!.id)),
    });

    const mutation = useMutation({
        mutationFn: updateAppointmentStatus,
        onSuccess: () => {
            message.success("Cập nhật lịch hẹn thành công!");
            queryClient.invalidateQueries(["ownerAppointments"]);
        },
        onError: () => {
            message.error("Không thể cập nhật lịch hẹn!");
        },
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    // State cho modal lịch sử cập nhật
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);

    // Fetch lịch sử cuộc hẹn
    const { data: historyData, isLoading: isHistoryLoading } = useQuery({
        queryKey: ["appointmentHistory", selectedHistoryId],
        queryFn: () => (selectedHistoryId !== null ? fetchAppointmentHistory(selectedHistoryId) : Promise.resolve([])),
        enabled: selectedHistoryId !== null,
    });

    const showConfirmModal = (appointmentId: number, status: string) => {
        setSelectedAppointment(appointmentId);
        setSelectedStatus(status);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setNotes("");
    };

    const handleConfirmUpdate = () => {
        if (selectedAppointment !== null) {
            mutation.mutate({ id: selectedAppointment, status: selectedStatus, notes, changedById: user?.id });
            setIsModalOpen(false);
            setNotes("");
        }
    };

    const showHistoryModal = (appointmentId: number) => {
        setSelectedHistoryId(appointmentId);
        setIsHistoryModalOpen(true);
    };

    const closeHistoryModal = () => {
        setIsHistoryModalOpen(false);
        setSelectedHistoryId(null);
    };

    const handleSearch = async () => {
        try {
            const searchParams = {
                ownerId: parseInt(user!.id),
                searchField: searchValue ? searchField : undefined,
                searchValue: searchValue || undefined,
                status: filterStatus || undefined,
                searchType: 'owner' as const
            };

            const results = await searchAppointments(searchParams);
            setFilteredData(results);
        } catch (error) {
            message.error("Có lỗi xảy ra khi tìm kiếm");
        }
    };

    const resetSearch = () => {
        setSearchValue('');
        setSearchField('customerName');
        setFilterStatus('');
        setFilteredData(null);
    };

    const columns = [
        {
            title: "Mã số",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: "Khách hàng",
            dataIndex: "customerName",
            key: "customerName",
            sorter: (a, b) => a.customerName.localeCompare(b.customerName),
            filterSearch: true,
            filters: appointments?.map(item => ({
                text: item.customerName,
                value: item.customerName,
            })),
            onFilter: (value, record) => record.customerName.includes(value),
        },
        {
            title: "Email",
            dataIndex: "customerEmail",
            key: "customerEmail",
            filterSearch: true,
            filters: appointments?.map(item => ({
                text: item.customerEmail,
                value: item.customerEmail,
            })),
            onFilter: (value, record) => record.customerEmail.includes(value),
        },
        {
            title: "Số điện thoại",
            dataIndex: "customerPhoneNumber",
            key: "customerPhoneNumber",
            filterSearch: true,
            filters: appointments?.map(item => ({
                text: item.customerPhoneNumber,
                value: item.customerPhoneNumber,
            })),
            onFilter: (value, record) => record.customerPhoneNumber.includes(value),
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
            filterSearch: true,
            filters: appointments?.map(item => ({
                text: item.address,
                value: item.address,
            })),
            onFilter: (value, record) => record.address.includes(value),
        },
        {
            title: "Thời gian",
            dataIndex: "appointmentTime",
            key: "appointmentTime",
            render: (time) => dayjs(time).format("DD/MM/YYYY HH:mm"),
            sorter: (a, b) => dayjs(a.appointmentTime).unix() - dayjs(b.appointmentTime).unix(),
            filterSearch: true,
            filters: appointments?.map(item => ({
                text: dayjs(item.appointmentTime).format("DD/MM/YYYY"),
                value: dayjs(item.appointmentTime).format("DD/MM/YYYY"),
            })),
            onFilter: (value, record) => dayjs(record.appointmentTime).format("DD/MM/YYYY") === value,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "Chờ duyệt", value: "Pending" },
                { text: "Đã duyệt", value: "Approved" },
                { text: "Đã hủy", value: "Cancelled" },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                const color = status === "Pending" ? "blue" : status === "Approved" ? "green" : "red";
                return <Tag color={color}>{status === "Approved" ? "Đã duyệt" : status === "Pending" ? "Chờ duyệt" : "Đã hủy"}</Tag>;
            },
        },
        {
            title: "Ghi chú",
            dataIndex: "notes",
            key: "notes",
            filterSearch: true,
            filters: appointments?.filter(item => item.notes).map(item => ({
                text: item.notes,
                value: item.notes,
            })),
            onFilter: (value, record) => record.notes?.includes(value),
            render: (notes) => (notes ? notes : <Tag color="gray">Chưa có</Tag>),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <>
                    {record.status === "Pending" ? (
                        <>
                            <Button type="primary" onClick={() => showConfirmModal(record.id, "Approved")}>
                                Duyệt
                            </Button>
                            <Button danger onClick={() => showConfirmModal(record.id, "Cancelled")} style={{ marginLeft: 8 }}>
                                Từ chối
                            </Button>
                        </>
                    ) : (
                        <Tag color="gray">Đã xử lý</Tag>
                    )}
                    <Button type="default" onClick={() => showHistoryModal(record.id)} style={{ marginLeft: 8 }}>
                        Xem lịch sử
                    </Button>
                </>
            ),
        },
    ];

    return (
        <>
            <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                <Select
                    style={{ width: 120 }}
                    value={searchField}
                    onChange={setSearchField}
                >
                    <Select.Option value="id">Mã số</Select.Option>
                    <Select.Option value="customerName">Tên khách</Select.Option>
                    <Select.Option value="customerEmail">Email</Select.Option>
                    <Select.Option value="customerPhoneNumber">Số điện thoại</Select.Option>
                </Select>
                <Input
                    placeholder="Nhập từ khóa tìm kiếm..."
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    style={{ width: 250 }}
                />
                <Select
                    style={{ width: 150 }}
                    placeholder="Trạng thái"
                    allowClear
                    value={filterStatus}
                    onChange={setFilterStatus}
                >
                    <Select.Option value="Pending">Chờ duyệt</Select.Option>
                    <Select.Option value="Approved">Đã duyệt</Select.Option>
                    <Select.Option value="Cancelled">Đã hủy</Select.Option>
                </Select>
                <Button type="primary" onClick={handleSearch}>
                    Tìm kiếm
                </Button>
                <Button onClick={resetSearch}>
                    Đặt lại
                </Button>
            </div>

            <Table
                loading={isLoading}
                columns={columns}
                dataSource={(filteredData ?? appointments)?.map((item) => ({ ...item, key: item.id })) || []}
                pagination={{ pageSize: 5 }}
                onChange={(pagination, filters, sorter) => {
                    console.log('Table params:', { pagination, filters, sorter });
                }}
            />

            {/* Modal Xác Nhận */}
            <Modal
                title="Xác nhận cập nhật lịch hẹn"
                open={isModalOpen}
                onOk={handleConfirmUpdate}
                onCancel={handleCancel}
                okText={selectedStatus === "Approved" ? "Duyệt" : "Từ chối"}
                cancelText="Quay lại"
                okButtonProps={{ danger: selectedStatus === "Cancelled" }}
            >
                <p>Bạn có chắc chắn muốn {selectedStatus === "Approved" ? "duyệt" : "từ chối"} lịch hẹn này không?</p>
                <Input.TextArea
                    placeholder="Nhập ghi chú (tuỳ chọn)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                />
            </Modal>

            {/* Modal Lịch Sử Cập Nhật */}
            <Modal
                title="Lịch sử cập nhật"
                open={isHistoryModalOpen}
                onCancel={closeHistoryModal}
                footer={[
                    <Button key="close" onClick={closeHistoryModal}>
                        Đóng
                    </Button>,
                ]}
            >
                {isHistoryLoading ? (
                    <p>Đang tải lịch sử...</p>
                ) : historyData && historyData.length > 0 ? (
                    <List
                        dataSource={historyData}
                        renderItem={(item) => {
                            const color = item.status === "Pending" ? "blue" : item.status === "Approved" ? "green" : "red";
                            return (
                                <List.Item>
                                    <List.Item.Meta
                                        title={<b>Trạng thái: <Tag color={color} >{item.status == "Approved" ? "Đã duyệt" : item.status == "Pending" ? "Chờ duyệt" : "Đã hủy"}</Tag></b>}
                                        description={
                                            <>
                                                <p><b>Ghi chú:</b> {item.notes || "Không có"}</p>
                                                <p><b>Thay đổi bởi:</b> User {item.changedById}</p>
                                                <p><b>Thời gian:</b> {dayjs(item.changedAt).format("DD/MM/YYYY HH:mm")}</p>
                                            </>
                                        }
                                    />
                                </List.Item>
                            )
                        }}
                    />
                ) : (
                    <p>Không có lịch sử cập nhật.</p>
                )}
            </Modal>
        </>
    );
};

export default OwnerAppointment;
