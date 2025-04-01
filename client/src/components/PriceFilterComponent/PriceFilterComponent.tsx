import { Divider } from 'antd';
import { fonts } from '../../constants/fonts';
import { useAppDispatch } from '../../hooks';
import { setPriceRange } from '../../store/slices/searchSlice';
import Text from '../TextComponent/Text';
import './styles.css';

const PriceFilterComponent = () => {
    const dispatch = useAppDispatch();

    const priceRanges = [
        { label: 'Từ 1 đến 3 triệu', range: [1000000, 3000000] },
        { label: 'Từ 3 đến 5 triệu', range: [3000000, 5000000] },
        { label: 'Từ 5 đến 10 triệu', range: [5000000, 10000000] },
        { label: 'Từ 10 đến 40 triệu', range: [10000000, 40000000] },
        { label: 'Từ 40 đến 70 triệu', range: [40000000, 70000000] },
        { label: 'Từ 70 đến 100 triệu', range: [70000000, 100000000] },
        { label: 'Trên 100 triệu', range: [100000000, 1000000000] },
    ];

    const handlePriceRangeClick = (range: number[]) => {
        dispatch(setPriceRange(range));
    };

    return (
        <div className="price-filter-container">
            {priceRanges.map((item, index) => (
                <div
                    key={index}
                    className="price-filter-item"
                    onClick={() => handlePriceRangeClick(item.range)}
                >
                    <Text
                        style={{
                            margin: 0
                        }}
                        text={item.label}
                        fontSize={14}
                        fontFamily={fonts.regular}
                    />
                </div>
            ))}
            <Divider />
        </div>
    );
};

export default PriceFilterComponent;