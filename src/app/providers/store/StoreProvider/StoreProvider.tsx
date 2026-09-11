import { store } from "@/app/providers/store/store";
import { Provider } from "react-redux";

interface StoreProviderProps {
    children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};