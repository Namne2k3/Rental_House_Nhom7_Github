import { Col, Image, Row } from 'antd';
import { NhaTro } from '../../hooks/useRentalHook';
import './styles.css';
import Text from '../TextComponent/Text';
import { formatCurrencyVnd } from '../../utils';
import { COLORS } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { Link } from 'react-router';

type Props = {
    rental: NhaTro;
}

const RelatedRentalComponent = ({ rental }: Props) => {
    return (
        <Link
            to={`/nhatro/detail/${rental.id}`}
            className="related-rental-link"
        >
            <div className="related-rental-layout">
                <div className="related-rental-image-container">
                    <Image preview={false} style={{ objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }} src={rental.imageUrls[0]} width={'100%'} height={160} />
                </div>

                <div className='related-rental-info-container'>
                    <div>
                        <Text text={`${rental.address}`} />
                    </div>
                    <Row style={{ justifyContent: 'space-between' }}>
                        <Col>
                            <Text text="Mức giá" fontFamily={fonts.bold} />
                            <Text text={`${formatCurrencyVnd(rental?.price ? parseInt(rental.price) : 0)}/tháng`} fontSize={14} fontFamily={fonts.medium} />
                        </Col>
                        <Col>
                            <Text text="Diện tích" fontFamily={fonts.bold} />
                            <Text text={`${(rental?.area ? parseInt(rental.area) : 0)} m2`} fontSize={14} fontFamily={fonts.medium} />
                        </Col>
                    </Row>
                </div>
            </div>
        </Link>
    )
}

export default RelatedRentalComponent