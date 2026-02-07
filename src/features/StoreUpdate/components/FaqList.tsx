 import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { faqs } from '@/types';
import { useTranslation } from 'react-i18next';
 
interface FaqListProps {
  items: faqs[];
  onReorder: (items: faqs[]) => void;
  onEdit: (item: faqs) => void;
  onDelete: (id: string) => void;
}

const FaqList = ({ items, onReorder, onEdit, onDelete }: FaqListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
    const { t } = useTranslation("store"); // 👈 load dashboard.json


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
        {t("No FAQs added yet.")}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(f => f.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((faq) => (
            <SortableFaqItem key={faq.id} data={faq} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

// Inner Component for single row
const SortableFaqItem = ({ data, onEdit, onDelete }: { data: faqs, onEdit: (i: faqs) => void, onDelete: (id: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: data.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-3 hover:border-teal-500 hover:shadow-sm transition-all">
      <div {...attributes} {...listeners} className="mt-1 text-gray-400 cursor-grab active:cursor-grabbing hover:text-gray-600">
        <GripVertical size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-800 text-sm truncate">{data.question}</h4>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{data.answer}</p>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(data)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Pencil size={16} /></button>
        <button onClick={() => onDelete(data.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
      </div>
    </div>
  );
};

export default FaqList;