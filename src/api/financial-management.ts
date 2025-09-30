/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./axios";

export const createFinancialRecord = async(record:any)=>{
    const res = await api.post("/api/financial-tracking/thematic",record);
    return res.data;
}

export const getFinancialRecordBYThematicAllocation = async ()=>{
    const res = await api.get("/api/financial-tracking/thematic");
    return res.data;
}