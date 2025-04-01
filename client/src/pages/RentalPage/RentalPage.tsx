import { LoadingOutlined, SmileOutlined } from "@ant-design/icons";
import { Pagination, Spin, notification } from "antd";
import { useCallback, useEffect } from "react";
import RentalCardComponent from "../../components/RentalCardComponent/RentalCardComponent";
import SearchComponent from "../../components/SearchComponent/SearchComponent";
import Text from "../../components/TextComponent/Text";
import { COLORS } from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useRentals } from "../../hooks/useRentalHook";
import { useUrlParams } from "../../hooks/useUrlsHook";
import { addNhaTroToSaveList, removeFavoriteLocally } from "../../store/slices/favoriteSlice";
import { setCurrentPagination } from "../../store/slices/pageSlice";
import { searchRentals, setPriceRange } from "../../store/slices/searchSlice";

const RentalPage = () => {
    const dispatch = useAppDispatch();
    const { savedRentalData } = useAppSelector((state) => state.favorite);
    const { search, priceRange, areaRange } = useAppSelector((state) => state.search)
    const { currentPagination, currentPageSize } = useAppSelector((state) => state.page);
    const { setFilterParams, getFilterParams } = useUrlParams();
    const [api, contextHolder] = notification.useNotification();

    const { data: rentals, isLoading, error } = useRentals({
        page: currentPagination,
        pageSize: currentPageSize,
        address: search,
        price1: priceRange[0],
        price2: priceRange[1],
        area1: areaRange[0],
        area2: areaRange[1]
    });

    const openNotification = (message: string) => {
        api.open({
            message: message,
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
    };

    const handleChangePagination = useCallback((number: number, pageSize: number) => {
        dispatch(setCurrentPagination({ currentPagination: number, currentPageSize: pageSize }));
    }, [dispatch]);

    const handleAddNhaTroToSaveList = useCallback((nhaTroId: number) => {
        // dispatch(addFavoriteLocally(nhaTroId));
        dispatch(addNhaTroToSaveList({ id: nhaTroId }));
        openNotification("Đã lưu thông tin nhà trọ")
    }, [dispatch]);

    const handleRemoveNhaTroFromSaveList = useCallback((nhaTroId: number) => {
        dispatch(removeFavoriteLocally(nhaTroId));
    }, [dispatch]);

    const handleCopyPhoneNumber = useCallback((phoneNumber: string) => {
        navigator.clipboard.writeText(phoneNumber)
        alert("Đã sao chép số điện thoại: " + phoneNumber);
    }, [])

    useEffect(() => {
        const { search, price1, price2, page, pageSize } = getFilterParams()
        if (search) dispatch(searchRentals({ search }));
        if (price1 && price2) dispatch(setPriceRange([price1, price2]));
        if (page) dispatch(setCurrentPagination({ currentPagination: page, currentPageSize: pageSize }));
    }, []);

    // cập nhật các biến filter từ URL nếu có thay đổi
    useEffect(() => {
        setFilterParams({
            search,
            price1: priceRange[0],
            price2: priceRange[1],
            page: currentPagination,
            pageSize: currentPageSize,
            area1: areaRange[0],
            area2: areaRange[1]
        });
    }, [search, priceRange, currentPagination, currentPageSize, areaRange]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin
                    style={{ color: COLORS.DARK_SLATE }}
                    indicator={<LoadingOutlined spin />}
                    size='large'
                />
            </div>
        );
    }

    if (error) {
        console.log(error);
    }

    return (
        <div>
            {contextHolder}
            <SearchComponent />
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "4px"
            }}>
                <Text
                    text={`Hiện đang có `}
                    style={{ display: 'inline' }}
                />
                <Text
                    text={`${rentals?.totalItems ?? 0}`}
                    style={{
                        fontWeight: 'bold',
                        display: 'inline'
                    }}
                />
                <Text
                    text={` phòng trọ đang cho thuê`}
                    style={{ display: 'inline' }}
                />
            </div>
            {
                rentals?.data?.map((item) => {
                    return (
                        <RentalCardComponent
                            key={item.id}
                            rental={item}
                            isSaved={savedRentalData.map(s => s.nhaTroId).includes(item.id)}
                            handleCopyPhoneNumber={handleCopyPhoneNumber}
                            onAddToSaveList={() => handleAddNhaTroToSaveList(item.id)}
                            onRemoveFromSaveList={() => handleRemoveNhaTroFromSaveList(item.id)}
                        />
                    )
                })
            }
            <div style={{ marginTop: 24 }}>
                <Pagination align="center" pageSize={currentPageSize} onChange={handleChangePagination} defaultCurrent={currentPagination} total={rentals?.totalItems} />
            </div>
        </div>
    );
};

export default RentalPage;