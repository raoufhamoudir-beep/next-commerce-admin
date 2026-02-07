import { StickyNote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OrderNoteEditorProps {
    note: string;
    status: string;
    onNoteChange: (note: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

/**
 * OrderNoteEditor Component
 * A modal dialog for adding or editing notes on an order
 * 
 * @param note - Current note value
 * @param status - Order status (displayed in header for context)
 * @param onNoteChange - Callback when note text changes
 * @param onSave - Callback when user saves the note
 * @param onCancel - Callback when user cancels editing
 */
const OrderNoteEditor = ({ note, status, onNoteChange, onSave, onCancel }: OrderNoteEditorProps) => {
            const { t } = useTranslation("order");
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full  ">
            {/* Header */}
            <div className="p-5 border-b border-gray-200 flex items-center space-x-3">
                <StickyNote className="text-amber-600 w-6 h-6" />
                <h3 className="text-lg font-semibold text-gray-900">
                    {t("Add Note for")} {status}
                </h3>
            </div>

            {/* Content - Note Textarea */}
            <div className="p-5">
                <textarea
                    value={note}
                    onChange={(e) => onNoteChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                    rows={4}
                    placeholder="Enter your note here..."
                    autoFocus
                />
            </div>

            {/* Actions */}
            <div className="px-5 py-4 border-t border-gray-200 flex justify-end space-x-2">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                    {t("Cancel")}
                </button>
                <button
                    onClick={onSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors"
                >
                    {t("Save Note")}
                </button>
            </div>
        </div>
    );
};

export default OrderNoteEditor;