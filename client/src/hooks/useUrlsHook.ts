import { useSearchParams } from "react-router";

export const useUrlParams = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const setFilterParams = ({
        search,
        price1,
        price2,
        page,
        pageSize,
        area1,
        area2
    }: {
        search?: string;
        price1?: number;
        price2?: number;
        page?: number;
        pageSize?: number;
        area1?: number;
        area2?: number;
    }) => {
        const params = new URLSearchParams(searchParams);

        if (search) params.set('search', search);
        if (price1 !== undefined) params.set('price1', price1.toString());
        if (price2 !== undefined) params.set('price2', price2.toString());
        if (page) params.set('page', page.toString());
        if (pageSize) params.set('pageSize', pageSize.toString());
        if (area1) params.set('area1', area1.toString())
        if (area2) params.set('area2', area2.toString())


        setSearchParams(params);
    };

    const getFilterParams = () => {
        return {
            search: searchParams.get('search') || '',
            price1: Number(searchParams.get('price1')) || 0,
            price2: Number(searchParams.get('price2')) || 10000000,
            page: Number(searchParams.get('page')) || 1,
            pageSize: Number(searchParams.get('pageSize')) || 20,
            area1: Number(searchParams.get("area1")) || 0,
            area2: Number(searchParams.get("area2")) || 100,
        };
    };

    return { setFilterParams, getFilterParams };
}