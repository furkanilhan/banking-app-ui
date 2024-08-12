import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Account {
    id: string;
    name: string;
    number: string;
    balance: number;
}

interface AccountState {
    accounts: Account[];
    selectedAccount: Account | null;
}

const initialState: AccountState = {
    accounts: [],
    selectedAccount: null,
};

const accountSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        setAccounts(state, action: PayloadAction<Account[]>) {
            state.accounts = action.payload;
        },
        setSelectedAccount(state, action: PayloadAction<Account | null>) {
            state.selectedAccount = action.payload;
        },
        updateAccount(state, action: PayloadAction<Account>) {
            const index = state.accounts.findIndex(
                account => account.id === action.payload.id,
            );
            if (index >= 0) {
                state.accounts[index] = action.payload;
            }
        },
        deleteAccount(state, action: PayloadAction<string>) {
            state.accounts = state.accounts.filter(
                account => account.id !== action.payload,
            );
        },
    },
});

export const { setAccounts, setSelectedAccount, updateAccount, deleteAccount } =
    accountSlice.actions;
export default accountSlice.reducer;
