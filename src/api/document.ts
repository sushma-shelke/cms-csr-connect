/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./axios";

export const uploadDocument = (files: any) => {
    const res = api.post("/upload/documents", files);
    return res;
}