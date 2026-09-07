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
  const [pendingDelete, setPendingDelete] = useState<AdminCategory | null>(null);
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

  async function confirmDelete() {
    if (!pendingDelete) return;

    const category = pendingDelete;
    setDeletingId(category.id);
    try {
      await deleteMenuCategory(category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
      toast.success(`« ${category.name} » et ses plats ont été supprimés.`);
      setPendingDelete(null);
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
            onDelete={setPendingDelete}
          />
        ))}
      </SortableContext>
      {isSavingOrder && (
        <p className="mt-2 flex items-center gap-2 text-xs text-[#4a4741]" role="status">
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          Enregistrement de l&apos;ordre…
        </p>
      )}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/55 p-4 backdrop-blur-sm animate-[admin-dialog-backdrop_180ms_ease-out]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deletingId) setPendingDelete(null);
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-category-title"
            aria-describedby="delete-category-description"
            className="w-full max-w-md rounded-2xl bg-[#f7f2e8] p-6 shadow-2xl animate-[admin-dialog-pop_220ms_cubic-bezier(.22,1,.36,1)]"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700">
              <Trash2 size={23} aria-hidden="true" />
            </div>
            <h2 id="delete-category-title" className="serif text-3xl">
              Supprimer cette catégorie ?
            </h2>
            <p id="delete-category-description" className="mt-3 text-sm text-[#4a4741]">
              « {pendingDelete.name} » et tous ses plats seront supprimés. Cette action est irréversible.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={() => setPendingDelete(null)}
                className="rounded-full border border-[#ded8cc] px-5 py-3 text-sm font-bold transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                ANNULER
              </button>
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={confirmDelete}
                className="inline-flex items-center gap-2 rounded-full bg-red-700 px-5 py-3 text-sm font-bold !text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deletingId ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
                {deletingId ? "SUPPRESSION…" : "SUPPRIMER"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
}
