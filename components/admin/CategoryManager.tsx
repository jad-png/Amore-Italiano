"use client";

import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  deleteMenuCategory,
  reorderMenuCategories,
  updateMenuCategory,
} from "@/app/actions/cms";

export type AdminCategory = {
  id: string;
  name: string;
  display_order: number | null;
};

type CategoryManagerProps = {
  categories: AdminCategory[];
};

function SortableCategory({
  category,
  deleting,
  disabled,
  onDelete,
}: {
  category: AdminCategory;
  deleting: boolean;
  disabled: boolean;
  onDelete: (category: AdminCategory) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id, disabled });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : undefined,
      }}
      className={`mb-3 rounded-xl bg-white p-4 shadow-sm transition-shadow ${
        isDragging ? "relative shadow-xl ring-2 ring-[#596246]/20" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Déplacer ${category.name}`}
          className="cursor-grab touch-none rounded-lg p-2 text-[#4a4741] transition hover:bg-[#f7f2e8] active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={19} aria-hidden="true" />
        </button>
        <form
          action={async (formData) => {
            try {
              await updateMenuCategory(category.id, formData);
              toast.success("Catégorie renommée.");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Impossible de renommer la catégorie.");
            }
          }}
          className="flex min-w-0 flex-1 gap-2"
        >
          <input
            name="name"
            required
            defaultValue={category.name}
            aria-label={`Nom de ${category.name}`}
            className="min-w-0 flex-1 rounded-lg border border-[#ded8cc] p-2"
          />
          <button
            type="submit"
            className="rounded-lg px-2 text-xs font-bold text-[#a92e27] transition hover:bg-[#f7f2e8]"
          >
            RENOMMER
          </button>
        </form>
        <button
          type="button"
          onClick={() => onDelete(category)}
          disabled={deleting || disabled}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? (
            <Loader2 size={15} className="animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 size={15} aria-hidden="true" />
          )}
          <span className="hidden sm:inline">SUPPRIMER</span>
          <span className="sr-only">la catégorie et ses plats</span>
        </button>
      </div>
    </div>
  );
}

export default function CategoryManager({ categories: initialCategories }: CategoryManagerProps) {
  const router = useRouter();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );
  const [categories, setCategories] = useState(initialCategories);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSavingOrder, startSavingOrder] = useTransition();

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id || isSavingOrder) return;

    const oldIndex = categories.findIndex((category) => category.id === active.id);
    const newIndex = categories.findIndex((category) => category.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const previousCategories = categories;
    const nextCategories = arrayMove(categories, oldIndex, newIndex);
    setCategories(nextCategories);

    startSavingOrder(async () => {
      try {
        await reorderMenuCategories(nextCategories.map((category) => category.id));
        toast.success("Ordre des catégories enregistré.");
        router.refresh();
      } catch (error) {
        setCategories(previousCategories);
        toast.error(error instanceof Error ? error.message : "Impossible d'enregistrer l'ordre.");
      }
    });
  }

  async function handleDelete(category: AdminCategory) {
    const confirmed = window.confirm(
      `Supprimer « ${category.name} » et tous ses plats ? Cette action est irréversible.`,
    );
    if (!confirmed) return;

    setDeletingId(category.id);
    try {
      await deleteMenuCategory(category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
      toast.success(`« ${category.name} » et ses plats ont été supprimés.`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible de supprimer la catégorie.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={categories.map((category) => category.id)}
        strategy={verticalListSortingStrategy}
      >
        {categories.map((category) => (
          <SortableCategory
            key={category.id}
            category={category}
            deleting={deletingId === category.id}
            disabled={isSavingOrder || deletingId !== null}
            onDelete={handleDelete}
          />
        ))}
      </SortableContext>
      {isSavingOrder && (
        <p className="mt-2 flex items-center gap-2 text-xs text-[#4a4741]" role="status">
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          Enregistrement de l&apos;ordre…
        </p>
      )}
    </DndContext>
  );
}
