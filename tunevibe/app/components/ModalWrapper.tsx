"use client";

import React from "react";

interface ModalWrapperProps {
    children: React.ReactNode;
    onClose: () => void;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ children, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={onClose}
            ></div>

            <div className="bg-gray-800 text-white p-6 rounded-lg z-10 max-w-md w-full">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default ModalWrapper;
