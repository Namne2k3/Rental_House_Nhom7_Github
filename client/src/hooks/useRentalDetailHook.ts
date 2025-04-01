import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { NhaTro } from "./useRentalHook";

const fetchDetailNhaTro = async (id: string): Promise<NhaTro> => {
    const response = await api.get(`/NhaTro/GetNhaTroById?id=${id}`, {
        timeout: 3000
    })
    return response.data
}

export const useRentalDetail = (id: string) => {
    return useQuery({
        queryKey: ['rentalDetail', id],
        queryFn: () => fetchDetailNhaTro(id),
        enabled: !!id,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        gcTime: 1000 * 60 * 5
    })
}


