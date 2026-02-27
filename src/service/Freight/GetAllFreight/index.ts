import { api } from "../../Api";
import { IGetAllFreightsResponse } from "./get-all-freight";

export const getAllFreight = async (): Promise<IGetAllFreightsResponse[]> => {
    const { data } = await api.get<IGetAllFreightsResponse[]>("/frete");
    return data;
};
