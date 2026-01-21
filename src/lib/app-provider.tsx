import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

type AppProviderProps = {
    children: React.ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnReconnect: true,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    );
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                    <Toast />
                </QueryClientProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default AppProvider;
