import { X } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import type { MenuItem } from "../../types/menuTypes";
import { Button } from "../common/button";
import MenuForm from "./MenuForm";

interface MenuFormProps {
  editItem?: MenuItem;
  onSuccess?: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}
interface MenuFormModalProps extends Omit<MenuFormProps, "onCancel"> {
  isOpen: boolean;
  onClose: () => void;
}

const MenuFormModal: React.FC<MenuFormModalProps> = ({
  isOpen,
  onClose,
  editItem,
  onSuccess,
  isSubmitting,
}) => {
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    },
    [isSubmitting, onClose]
  );
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const modal = document.querySelector(".modal-content");
      if (modal && !modal.contains(event.target as Node) && !isSubmitting) {
        onClose();
      }
    },
    [isSubmitting, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscapeKey, handleClickOutside]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="modal-content bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
          {/* Loading Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
                <p className="text-sm text-gray-600">
                  {editItem ? "Updating..." : "Creating..."}
                </p>
              </div>
            </div>
          )}

          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {editItem ? "Edit Menu Item" : "Add New Menu Item"}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-500 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <MenuForm
              editItem={editItem}
              onSuccess={() => {
                onSuccess?.();
                onClose();
              }}
              onCancel={onClose}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuFormModal;
