import React from 'react';
import { Pagination } from 'antd';

interface PaginationComponentProps {
    currentPage: number;
    totalItems: number;
    pageSize?: number;
    onPageChange: (page: number) => void;
}

export const PaginationComponent: React.FC<PaginationComponentProps> = ({
    currentPage,
    totalItems,
    pageSize = 5,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / pageSize);

    if (totalPages <= 1) {
        return null;
    }

    return (
        <Pagination
            className="custom-pagination"
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={onPageChange}
            style={{ marginTop: 16 }}
        />
    );
};
