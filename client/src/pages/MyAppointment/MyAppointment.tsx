import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal, Spin, Table, Tag, Select, Input } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useAppSelector } from "../../hooks";
import api from "../../services/api";
import { useAppointmentsUser } from "../../hooks/useAppointmentHook";

const fetchAppointments = async (userId: number) => {
    const { data } = await api.get(`/Appointment/User/${userId}`);
    return data;
};

// API lấy lịch sử lịch hẹn
const fetchAppointmentHistory = async (appointmentId: number) => {
    const { data } = await api.get(`/Appointment/${appointmentId}/history`);
    return data;
};

const cancelAppointment = async ({ id, changedById }: { id: number; changedById: number }) => {
    await api.post(`/Appointment/Delete/${id}`, {
        reason: "Hello",
        changedById: changedById
    });
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

const MyAppointment = () => {
    const queryClient = useQueryClient();
    const { user } = useAppSelector((state) => state.auth);

    const { data: appointments, isLoading } = useAppointmentsUser({ userId: parseInt(user?.id) })

    const mutation = useMutation({
        mutationFn: cancelAppointment,
        onSuccess: () => {
            message.success("Hủy lịch hẹn thành công!");
            queryClient.invalidateQueries(["appointmentsUser"]);
        },
        onError: () => {
            message.error("Không thể hủy lịch hẹn!");
        },
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
    const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
    const [historyData, setHistoryData] = useState<{ [key: number]: any[] }>({});
    const [loadingHistory, setLoadingHistory] = useState<{ [key: number]: boolean }>({});

    const [searchField, setSearchField] = useState<string>('ownerName');
    const [searchValue, setSearchValue] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filteredData, setFilteredData] = useState(null);

    const handleSearch = async () => {
        try {
            const searchParams = {
                userId: parseInt(user!.id),
                searchField: searchValue ? searchField : undefined,
                searchValue: searchValue || undefined,
                status: filterStatus || undefined,
                searchType: 'user' as const
            };

            const results = await searchAppointments(searchParams);
            setFilteredData(results);
        } catch (error) {
            message.error("Có lỗi xảy ra khi tìm kiếm");
        }
    };

    const resetSearch = () => {
        setSearchValue('');
        setSearchField('ownerName');
        setFilterStatus('');
        setFilteredData(null);
    };

    const showConfirmModal = (appointmentId: number) => {
        setSelectedAppointment(appointmentId);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleConfirmCancel = () => {
        if (selectedAppointment !== null && user?.id) {
            mutation.mutate({ id: selectedAppointment, changedById: user.id });
            setIsModalOpen(false);
        }
    };

    // Xử lý mở rộng hàng để lấy dữ liệu lịch sử
    const handleExpand = async (expanded: boolean, record: any) => {
        if (expanded) {
            setExpandedRowKeys([...expandedRowKeys, record.id]);

            // Kiểm tra nếu chưa có lịch sử thì gọi API
            if (!historyData[record.id]) {
                setLoadingHistory((prev) => ({ ...prev, [record.id]: true }));
                try {
                    const data = await fetchAppointmentHistory(record.id);
                    setHistoryData((prev) => ({ ...prev, [record.id]: data }));
                } catch (error) {
                    message.error("Không thể tải lịch sử! " + error);
                }
                setLoadingHistory((prev) => ({ ...prev, [record.id]: false }));
            }
        } else {
            setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.id));
        }
    };

    const columns = [
        {
            title: "Mã số",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: "Nhà trọ",
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
            title: "Chủ nhà",
            dataIndex: "ownerName",
            key: "ownerName",
            sorter: (a, b) => a.ownerName.localeCompare(b.ownerName),
            filterSearch: true,
            filters: appointments?.map(item => ({
                text: item.ownerName,
                value: item.ownerName,
            })),
            onFilter: (value, record) => record.ownerName.includes(value),
        },
        {
            title: "Email",
            dataIndex: "ownerEmail",
            key: "ownerEmail",
            filterSearch: true,
            filters: appointments?.map(item => ({
                text: item.ownerEmail,
                value: item.ownerEmail,
            })),
            onFilter: (value, record) => record.ownerEmail.includes(value),
        },
        {
            title: "Số điện thoại",
            dataIndex: "ownerPhoneNumber",
            key: "ownerPhoneNumber",
            filterSearch: true,
            filters: appointments?.map(item => ({
                text: item.ownerPhoneNumber,
                value: item.ownerPhoneNumber,
            })),
            onFilter: (value, record) => record.ownerPhoneNumber.includes(value),
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
            render: (status) => {
                const color = status === "Pending" ? "blue" : status === "Approved" ? "green" : "red";
                return <Tag color={color}>{status === "Cancelled" ? "Đã hủy" : status === "Pending" ? "Chờ duyệt" : "Đã duyệt"}</Tag>;
            },
            filters: [
                { text: "Chờ duyệt", value: "Pending" },
                { text: "Đã duyệt", value: "Approved" },
                { text: "Đã hủy", value: "Cancelled" },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) =>
                record.status === "Pending" ? (
                    <Button danger onClick={() => showConfirmModal(record.id)}>
                        Hủy lịch
                    </Button>
                ) : (
                    <Tag color="gray">Không thể hủy</Tag>
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
                    <Select.Option value="ownerName">Tên chủ trọ</Select.Option>
                    <Select.Option value="ownerEmail">Email</Select.Option>
                    <Select.Option value="ownerPhoneNumber">Số điện thoại</Select.Option>
                    <Select.Option value="address">Địa chỉ</Select.Option>
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
                    <Select.Option value="Pending">
                        <Tag color="blue">Chờ duyệt</Tag>
                    </Select.Option>
                    <Select.Option value="Approved">
                        <Tag color="green">Đã duyệt</Tag>
                    </Select.Option>
                    <Select.Option value="Cancelled">
                        <Tag color="red">Đã hủy</Tag>
                    </Select.Option>
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
                expandable={{
                    expandedRowKeys,
                    onExpand: handleExpand,
                    expandedRowRender: (record) => {
                        const latestHistory = historyData[record.id]?.[0];
                        return (
                            <div style={{ padding: "10px" }}>
                                <b>Ghi chú:</b> {latestHistory?.notes || "Không có ghi chú"}
                                <br />
                                <b>Lịch sử cập nhật:</b>
                                {loadingHistory[record.id] ? (
                                    <Spin />
                                ) : historyData[record.id] && historyData[record.id].length > 0 ? (
                                    <ul>
                                        {historyData[record.id].map((historyItem, index) => (
                                            <li key={index}>
                                                {dayjs(historyItem.createdAt).format("DD/MM/YYYY HH:mm")} - {historyItem.status} bởi {historyItem.changedBy?.fullName}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Không có lịch sử cập nhật</p>
                                )}
                            </div>
                        );
                    }

                }}
            />

            {/* Modal Xác Nhận */}
            <Modal
                title="Xác nhận hủy lịch hẹn"
                open={isModalOpen}
                onOk={handleConfirmCancel}
                onCancel={handleCancel}
                okText="Hủy lịch"
                cancelText="Quay lại"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn hủy lịch hẹn này không?</p>
            </Modal>
        </>
    );
};

export default MyAppointment;
