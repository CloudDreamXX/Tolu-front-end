import { useEffect } from "react";

const useAutoRefetchOnReconnect = (refetch) => {
    useEffect(() => {
        const handleOnline = () => {
            console.log("Internet reconnected! Refetching data...");
            refetch(); // Auto refetch when online
        };
        window.addEventListener("online", handleOnline);
        return () => window.removeEventListener("online", handleOnline);
    }, [refetch]);
};

export default useAutoRefetchOnReconnect;
