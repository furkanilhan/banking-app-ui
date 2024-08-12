import React from 'react';
import { Modal, message } from 'antd';
import { useDispatch } from 'react-redux';
import { deleteAccount as deleteAccountService } from '../../services/account';
import { deleteAccount } from '../../store/accountReducer';

interface DeleteModalProps {
    deletingAccountId: string | null;
    isVisible: boolean;
    onCancel: () => void;
    onAccountDeleted: () => void;
}

export const DeleteModalComponent: React.FC<DeleteModalProps> = ({ deletingAccountId, isVisible, onCancel, onAccountDeleted }) => {
    const dispatch = useDispatch();

    const handleDeleteAccount = async () => {
        if (deletingAccountId) {
            try {
                await deleteAccountService(deletingAccountId);
                dispatch(deleteAccount(deletingAccountId));
                message.success('Account deleted successfully!');
                onAccountDeleted(); 
            } catch (error) {
                message.error('Failed to delete account.');
            } finally {
                onCancel();
            }
        }
    };

    return (
        <Modal
            title="Delete Account"
            open={isVisible}
            onOk={handleDeleteAccount}
            onCancel={onCancel}
            okText="Delete"
            cancelText="Cancel"
        >
            <p>Are you sure you want to delete this account?</p>
        </Modal>
    );
};
