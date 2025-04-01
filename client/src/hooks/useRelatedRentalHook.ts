import { useQuery } from "@tanstack/react-query";
import { NhaTro } from "./useRentalHook";
import api from "../services/api";

/*
Các giá trị falsy
!!null       // false
!!undefined  // false
!!""        // false
!!0         // false
!!NaN       // false

// Các giá trị truthy
!!"hello"   // true
!!1        // true
!!{}       // true
!![]       // true
!!42       // true
*/

const fetchRelatedNhaTros = async (id: string): Promise<NhaTro[]> => {
    const response = await api.get(`/NhaTro/GetRelatedNhaTros?id=${id}`)
    return response.data
}

export const useRelatedRentals = (id: string) => {
    return useQuery({
        queryKey: ['relatedRentals', id],
        queryFn: () => fetchRelatedNhaTros(id),
        enabled: !!id, // chỉ fetch khi có id
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        gcTime: 1000 * 60 * 5
    })
}





