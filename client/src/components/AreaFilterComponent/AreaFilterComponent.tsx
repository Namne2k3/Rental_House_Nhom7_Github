import { useAppDispatch } from '../../hooks';
import { setAreaRange } from '../../store/slices/searchSlice';
import Text from '../TextComponent/Text';
import { fonts } from '../../constants/fonts';
import './styles.css';
import { Divider } from 'antd';

const AreaFilterComponent = () => {
    const dispatch = useAppDispatch();

    const areaRanges = [
        { label: 'Dưới 30m²', range: [0, 30] },
        { label: 'Từ 30m² - 50m²', range: [30, 50] },
        { label: 'Từ 50m² - 80m²', range: [50, 80] },
        { label: 'Từ 80m² - 100m²', range: [80, 100] },
        { label: 'Trên 100m²', range: [100, 1000] },
    ];

    const handleAreaRangeClick = (range: number[]) => {
        dispatch(setAreaRange(range));
    };

    return (
        <div className="area-filter-container">
            {areaRanges.map((item, index) => (
                <div
                    key={index}
                    className="area-filter-item"
                    onClick={() => handleAreaRangeClick(item.range)}
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

export default AreaFilterComponent;