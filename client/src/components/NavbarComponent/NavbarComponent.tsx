import { BellOutlined, CaretDownOutlined, CloseOutlined, HeartOutlined, LoadingOutlined, LogoutOutlined, MenuOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from 'antd';
import { Avatar, Badge, Button, Col, Divider, Dropdown, Empty, Grid, Image, Menu, Popover, Space, Spin, theme } from "antd";
import { Link, useNavigate } from "react-router";
import { COLORS } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { logout } from "../../store/slices/authSlice";
import { setCurrentPage } from "../../store/slices/pageSlice";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import Text from "../TextComponent/Text";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Favorite, removeFavoriteLocally, removeNhaTroFromSaveList } from "../../store/slices/favoriteSlice";
import './styles.css';
import { AppointmentDTO, fetchAppointmentsCustomer, fetchAppointmentsUser } from "../../hooks/useAppointmentHook";

const { useToken } = theme;
const { useBreakpoint } = Grid;

const userMenuItems: MenuProps['items'] = [
    {
        key: 'GeneralPage',
        label: 'Tổng quan',
        icon: <SettingOutlined />
    },
    {
        key: 'ProfilePage',
        label: 'Thông tin cá nhân',
        icon: <UserOutlined />
    },
    {
        type: 'divider',
    },
    {
        key: 'logout',
        label: 'Đăng xuất',
        danger: true,
        icon: <LogoutOutlined />
    },
];

const menuItems = [
    {
        label: "Thuê phòng trọ",
        key: "",
    },
    // {
    //     label: "Tin tức",
    //     key: "news",
    // }
];

const SavedRentalContainer = ({ savedRentalData }: { savedRentalData: Favorite[] }) => {

    const dispatch = useAppDispatch()
    const handleRemoveRentalFromSaveList = (id: number) => {
        // console.log(id);
        dispatch(removeFavoriteLocally(id))
        dispatch(removeNhaTroFromSaveList({ id: id }))
    }

    return (
        <div className="saved-rental-layout">
            <Text text="Tin đăng đã lưu" fontFamily={fonts.bold} fontSize={16} />
            <Divider style={{ margin: 0 }} />
            <div className="saved-rental-container">
                {
                    savedRentalData?.length > 0 ?
                        savedRentalData.map((item, index) => {
                            return (
                                <div className="saved-rental-item" key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                                    <Link to={`/nhatro/detail/${item.nhaTro.id}`}>
                                        <div style={{ marginBottom: 6 }}>
                                            <div style={{ display: "flex" }}>
                                                <div style={{ display: "flex", alignItems: 'center' }}>
                                                    <img style={{ borderRadius: 8 }} width={64} height={48} src={item.nhaTro.images[0].imageUrl} />
                                                </div>
                                                <Col style={{ marginLeft: 12, maxWidth: 400 }}>
                                                    <Text fontFamily={fonts.bold} text={item.nhaTro.title} />
                                                    <Text fontFamily={fonts.regular} text={item.nhaTro.address} />
                                                </Col>
                                            </div>
                                        </div>
                                    </Link>
                                    <div >
                                        <CloseOutlined className="saved-rental-item-close-icon" onClick={() => handleRemoveRentalFromSaveList(item.id)} />
                                    </div>
                                </div>
                            )
                        })
                        :
                        <Empty description="Chưa có dữ liệu" />
                }
            </div>
        </div>
    )
}

const NotificationContainer = ({ appointments }: { appointments: AppointmentDTO[] }) => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="saved-rental-layout">
            <Text text="Thông báo" fontFamily={fonts.bold} fontSize={16} />
            <Divider style={{ margin: 0 }} />
            <div className="saved-rental-container">
                {
                    appointments.length > 0
                        ?
                        appointments.map((item, index) => {
                            return (
                                <Link
                                    key={index}
                                    to={"/generalSetting/OwnerAppointment"}
                                    style={{
                                        padding: 16,
                                        borderRadius: 12,
                                        backgroundColor: "#f5f5f5",
                                        marginTop: 12,
                                        transition: 'all 0.3s ease',
                                        ':hover': {
                                            backgroundColor: '#e6e6e6'
                                        }
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                        <Badge color={COLORS.DARK_SLATE} />
                                        <div style={{ flex: 1 }}>
                                            <Text
                                                text={`Lịch hẹn mới từ khách hàng`}
                                                fontFamily={fonts.bold}
                                                fontSize={14}
                                            />
                                            <div style={{ marginTop: 8 }}>
                                                <Text
                                                    text={`Khách hàng: ${item.customerName}`}
                                                    fontSize={13}
                                                />
                                                <Text
                                                    text={`Thời gian: ${formatDate(item.appointmentTime)}`}
                                                    fontSize={13}
                                                />
                                                <Text
                                                    text={`Địa chỉ: ${item.address}`}
                                                    fontSize={13}
                                                    style={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical'
                                                    }}
                                                />
                                            </div>
                                            <div style={{
                                                marginTop: 8,
                                                display: 'flex',
                                                gap: 16,
                                                color: COLORS.DARK_SLATE,
                                                fontSize: 13
                                            }}>
                                                <span>📞 {item.customerPhoneNumber}</span>
                                                <span>✉️ {item.customerEmail}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                        :
                        <Empty description="Chưa có dữ liệu" />
                }
            </div>
        </div>
    )
}

const NavbarComponent = () => {
    const { token } = useToken();
    const screens = useBreakpoint();
    const navigate = useNavigate()
    const { currentPage } = useAppSelector((state) => state.page)
    const { savedRentals, savedRentalData } = useAppSelector((state) => state.favorite)
    const { user, isLoading } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();

    const { data: appointments } = useQuery({
        queryKey: ["appointments"],
        queryFn: () => fetchAppointmentsCustomer({ ownerId: user?.id, status: "Pending" }), // API lấy danh sách lịch hẹn
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        gcTime: 1000 * 60 * 5
    });


    const handleMenuProfileClick: MenuProps['onClick'] = (e) => {
        if (e.key == "logout") {
            queryClient.clear()
            dispatch(logout())
            navigate("/login")
        } else {
            navigate(`/generalSetting/${e.key}`)
        }
    };

    const onMenuItemClick: MenuProps["onClick"] = (e) => {
        navigate(`/${e.key}`)
        dispatch(setCurrentPage(e.key))
    };

    const styles = {
        container: {
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            margin: "0 auto",
        },
        // header: {
        //     borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
        //     position: "relative" as const,
        //     padding: 0,
        //     [`@media screen and (max-width: ${token.screenMD}px)`]: {
        //         padding: 0
        //     },
        //     [`@media screen and (min-width: ${token.screenMD}px)`]: {
        //         padding: 0
        //     }
        // },
        logo: {
            display: "block",
            height: token.sizeLG,
            left: "50%",
            position: screens.md ? "static" : "absolute",
            top: "50%",
            transform: screens.md ? " " : "translate(-50%, -50%)"
        },
        menu: {
            backgroundColor: "transparent",
            borderBottom: "none",
            lineHeight: screens.sm ? "4rem" : "3.5rem",
            marginLeft: screens.md ? "0px" : `-${token.size}px`,
            width: screens.md ? "inherit" : token.sizeXXL,
            fontFamily: fonts.bold
        },
        menuContainer: {
            alignItems: "center",
            display: "flex",
            gap: token.size,
            width: "100%"
        }
    };

    return (
        <nav className="header">
            <div style={styles.container}>
                <div style={styles.menuContainer}>
                    <Link
                        to={"/"}
                    >
                        <Image preview={false} style={{ borderRadius: 12 }} height={64} src="/images/logo.jpg" />
                    </Link>
                    <Menu
                        style={styles.menu}
                        mode="horizontal"
                        items={menuItems}
                        onClick={onMenuItemClick}
                        selectedKeys={screens.md ? [currentPage] : []}
                        overflowedIndicator={
                            <Button type="text" icon={<MenuOutlined />}></Button>
                        }
                    />
                </div>
                {
                    isLoading ?
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Spin style={{ color: COLORS.DARK_SLATE }} indicator={<LoadingOutlined spin />} size='default' />
                        </div>
                        :
                        user == null
                            ?
                            <Space>
                                {screens.md ? <ButtonComponent onClick={() => navigate("/login")} backgroundColor="transparent" color={COLORS.DARK_SLATE} text="Đăng nhập" /> : ""}
                                <ButtonComponent onClick={() => navigate("/sign-up")} text="Đăng ký" />
                            </Space>
                            :
                            <Space align="center" size="small">
                                <Badge
                                    count={appointments?.length ?? 0}
                                    offset={[-4, 3]} // Adjust badge position
                                >
                                    <Popover
                                        content={<NotificationContainer appointments={appointments ?? []} />}
                                        trigger="click"
                                        placement="bottomRight"
                                    >
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginRight: 8,
                                            height: "100%"
                                        }}>
                                            <BellOutlined
                                                style={{
                                                    color: COLORS.DARK_SLATE,
                                                    fontSize: '24px',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        </div>
                                    </Popover>
                                </Badge>
                                <Badge
                                    count={savedRentals?.length ?? 0}
                                    offset={[-4, 3]} // Adjust badge position
                                >
                                    <Popover
                                        content={<SavedRentalContainer savedRentalData={savedRentalData} />}
                                        trigger="click"
                                        placement="bottomRight"
                                    >
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginRight: 8,
                                            height: "100%"
                                        }}>
                                            <HeartOutlined
                                                style={{
                                                    color: COLORS.DARK_SLATE,
                                                    fontSize: '24px',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        </div>
                                    </Popover>
                                </Badge>
                                <Avatar
                                    style={{
                                        backgroundColor: COLORS.DARK_SLATE,
                                        cursor: 'pointer'
                                    }}
                                    icon={<UserOutlined />}
                                />
                                <Dropdown
                                    menu={{
                                        items: userMenuItems,
                                        onClick: handleMenuProfileClick
                                    }}
                                    placement="bottomRight"
                                    trigger={['click']}
                                >
                                    <Space
                                        style={{
                                            cursor: 'pointer',
                                            color: COLORS.DARK_SLATE
                                        }}
                                    >
                                        <Text text={user?.fullName} />
                                        <CaretDownOutlined />
                                    </Space>
                                </Dropdown>
                                <Link
                                    to={`/nhatro/create`}
                                >
                                    <Button style={{ padding: 16 }}>
                                        <Text fontFamily={fonts.bold} text="Đăng tin" />
                                    </Button>
                                </Link>
                            </Space>
                }
            </div>
        </nav>
    );
}

export default NavbarComponent