import { AreaChartOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Dropdown, Input, Radio, Slider } from 'antd';
import { ChangeEventHandler, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AddressDTO, searchRentals, searchRentalsAddress, setAreaRange, setPriceRange } from '../../store/slices/searchSlice';
import './styles.css';

import type { AutoCompleteProps, MenuProps, RadioChangeEvent } from 'antd';
import Text from '../TextComponent/Text';

const searchResult = (addresses: AddressDTO[]) => {
    return addresses?.map((add) => {
        return {
            value: add.id,
            label: (
                <div
                    key={add.id}
                    style={{
                        display: 'flex',
                        width: "100%",
                        justifyContent: 'space-between',
                    }}
                    // Nếu cần, có thể thêm onClick để stop propagation
                    onClick={(e) => e.stopPropagation()}
                >
                    <Text text={add.address} />
                </div>
            ),
        }
    });
}

const SearchComponent = () => {
    const dispatch = useAppDispatch();

    const { search, addresses, priceRange, areaRange } = useAppSelector((state) => state.search);
    const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
    const [searchState, setSearchState] = useState(search);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string>('');

    // area state
    const [priceRangeState, setPriceRangeState] = useState(priceRange);
    const [areaRangeState, setAreaRangeState] = useState(areaRange);
    const [areaDropdownOpen, setAreaDropdownOpen] = useState(false);
    const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('');

    const handleAreaFilterChange = (e: RadioChangeEvent) => {
        setSelectedAreaFilter(e.target.value);
        switch (e.target.value) {
            case "under30":
                setAreaRangeState([0, 30]);
                break;
            case "30to50":
                setAreaRangeState([30, 50]);
                break;
            case "50to80":
                setAreaRangeState([50, 80]);
                break;
            case "80to100":
                setAreaRangeState([80, 100]);
                break;
            default:
                break;
        }
    };

    const handleClearAreaFilter = () => {
        setAreaRangeState([0, 100]);
        setSelectedAreaFilter('');
        dispatch(setAreaRange([0, 100]));
    };

    const handleFilterChange = (e: RadioChangeEvent) => {
        console.log(e.target.value);

        setSelectedFilter(e.target.value);
        switch (e.target.value) {
            case "0to3":
                setPriceRangeState(() => [0, (3 * 1000000)])
                break;

            case "3to5":
                setPriceRangeState(() => [(3 * 1000000), (5 * 1000000)])
                break;

            case "5to10":
                setPriceRangeState(() => [(5 * 1000000), (10 * 1000000)])
                break;

            case "10to40":
                setPriceRangeState(() => [(10 * 1000000), (40 * 1000000)])
                break;

            case "40to70":
                setPriceRangeState(() => [(40 * 1000000), (70 * 1000000)])
                break;

            case "70to100":
                setPriceRangeState(() => [(70 * 1000000), (100 * 1000000)])
                break;

            case "above100":
                setPriceRangeState(() => [(100 * 1000000), (1000 * 1000000)])
                break;

            default:
                break;
        }
    };


    const handleSearchRental = (search: string) => {
        if (priceRangeState) {
            dispatch(setPriceRange(priceRangeState))
        }

        if (areaRangeState) {
            dispatch(setAreaRange(areaRangeState));
        }

        if (search) {
            dispatch(searchRentals({ search }));
        }
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
        setSearchState(event.target.value);
        await dispatch(searchRentalsAddress({ search: event.target.value }));
        setOptions(event.target.value ? searchResult(addresses ?? []) : []);
    }

    const onSelect = (value: string) => {
        console.log(value);
    };

    // const handlePriceRangeChange = (value: [number, number]) => {
    //     console.log(value);
    //     setPriceRange(value);
    // };


    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div
                    style={{ padding: '12px', minWidth: '300px' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div>
                        <h4>Khoảng giá (triệu)</h4>
                        <Slider
                            range
                            min={0}
                            max={100000000}
                            value={priceRangeState}
                            onChange={setPriceRangeState}
                        // marks={{
                        //     0: '0tr',
                        //     5: '5tr',
                        //     10: '10tr'
                        // }}
                        />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <h4>Lọc nhanh</h4>
                        <Radio.Group
                            value={selectedFilter}
                            onChange={handleFilterChange}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}
                        >
                            <Radio value="0to3">Từ 1 đến 3 triệu</Radio>
                            <Radio value="3to5">Từ 3 đến 5 triệu</Radio>
                            <Radio value="5to10">Từ 5 đến 10 triệu</Radio>
                            <Radio value="10to40">Từ 10 đến 40 triệu</Radio>
                            <Radio value="40to70">Từ 40 đến 70 triệu</Radio>
                            <Radio value="70to100">Từ 70 đến 100 triệu</Radio>
                            <Radio value="above100">Trên 100 triệu</Radio>
                        </Radio.Group>
                    </div>
                </div>
            ),
        },
    ];

    const areaFilterItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div
                    style={{ padding: '12px', minWidth: '300px' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div>
                        <h4>Khoảng diện tích (m²)</h4>
                        <Slider
                            range
                            min={0}
                            max={100}
                            value={areaRangeState}
                            onChange={setAreaRangeState}
                            marks={{
                                0: '0m²',
                                50: '50m²',
                                100: '100m²'
                            }}
                        />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <h4>Lọc nhanh</h4>
                        <Radio.Group
                            value={selectedAreaFilter}
                            onChange={handleAreaFilterChange}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}
                        >
                            <Radio value="under30">Dưới 30m²</Radio>
                            <Radio value="30to50">Từ 30m² - 50m²</Radio>
                            <Radio value="50to80">Từ 50m² - 80m²</Radio>
                            <Radio value="80to100">Từ 80m² - 100m²</Radio>
                        </Radio.Group>
                    </div>
                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <Button onClick={handleClearAreaFilter}>
                            Xóa bộ lọc
                        </Button>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div style={{ display: 'flex', gap: '16px', flexDirection: "column" }} >
            <AutoComplete
                style={{ width: "100%" }}
                options={options}
                onSelect={onSelect}
                size="middle"
                className="custom-search-button"
            >
                <Input.Search
                    onSearch={handleSearchRental}
                    value={searchState}
                    onChange={handleChange}
                    prefix={<SearchOutlined />}
                    size="large"
                    placeholder="Tìm kiếm địa chỉ"
                    enterButton="Tìm kiếm"
                />
            </AutoComplete>
            <div style={{ display: "flex", justifyContent: "start", gap: 8 }}>
                <Dropdown
                    menu={{ items }}
                    trigger={['click']}
                    open={dropdownOpen}
                    onOpenChange={(flag) => setDropdownOpen(flag)}
                    placement="bottomRight"
                >
                    <Button
                        icon={<FilterOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(!dropdownOpen);
                        }}
                    >
                        Lọc giá
                    </Button>
                </Dropdown>

                <Dropdown
                    menu={{ items: areaFilterItems }}
                    trigger={['click']}
                    open={areaDropdownOpen}
                    onOpenChange={(flag) => setAreaDropdownOpen(flag)}
                    placement="bottomRight"
                >
                    <Button
                        icon={<AreaChartOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            setAreaDropdownOpen(!areaDropdownOpen);
                        }}
                    >
                        Lọc diện tích
                    </Button>
                </Dropdown>
            </div>
        </div>
    )
}

export default SearchComponent;
