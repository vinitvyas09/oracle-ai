"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("51fb0029-e2d2-4d0d-9ae2-fcde84bfece2");
    }, []);

    return null;
}