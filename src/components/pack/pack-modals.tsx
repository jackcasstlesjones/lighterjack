"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import type { ItemDraft, ModalState } from "./types";

type Props = {
  modal: ModalState;
  onClose: () => void;
  onSaveItem: (draft: ItemDraft) => void;
  onSaveCategory: (name: string) => void;
  onConfirmDelete: () => void;
};

export function PackModals({
  modal,
  onClose,
  onSaveItem,
  onSaveCategory,
  onConfirmDelete,
}: Props) {
  const open = modal !== null;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent hideClose>
        {modal?.type === "item" && (
          <ItemForm
            initial={modal.draft}
            isEdit={modal.itemId !== null}
            onCancel={onClose}
            onSave={onSaveItem}
          />
        )}
        {modal?.type === "cat" && (
          <CategoryForm
            initialName={modal.draft.name}
            isEdit={modal.catId !== null}
            onCancel={onClose}
            onSave={onSaveCategory}
          />
        )}
        {modal?.type === "delItem" && (
          <DeleteConfirm
            title="Delete item?"
            body={`“${modal.name}” will be removed from this list. This can't be undone.`}
            onCancel={onClose}
            onConfirm={onConfirmDelete}
          />
        )}
        {modal?.type === "delCat" && (
          <DeleteConfirm
            title="Delete category?"
            body={`“${modal.name}”${
              modal.count
                ? ` and its ${modal.count} item${modal.count > 1 ? "s" : ""}`
                : ""
            } will be removed. This can't be undone.`}
            onCancel={onClose}
            onConfirm={onConfirmDelete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ItemForm({
  initial,
  isEdit,
  onCancel,
  onSave,
}: {
  initial: ItemDraft;
  isEdit: boolean;
  onCancel: () => void;
  onSave: (draft: ItemDraft) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSave({
          name: String(fd.get("name") ?? ""),
          desc: String(fd.get("desc") ?? ""),
          weight: String(fd.get("weight") ?? ""),
          unit: (fd.get("unit") as "g" | "kg") || "g",
          qty: String(fd.get("qty") ?? "1"),
        });
      }}
    >
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit item" : "Add item"}</DialogTitle>
      </DialogHeader>

      <div className="grid gap-3.5 mt-4">
        <div>
          <Label htmlFor="name" className="mb-1.5 block">
            Item name
          </Label>
          <Input
            id="name"
            name="name"
            required
            autoFocus
            placeholder="e.g. Kakwa 55"
            defaultValue={initial.name}
          />
        </div>
        <div>
          <Label htmlFor="desc" className="mb-1.5 block">
            Description{" "}
            <span className="text-[#bdbdb5] font-normal">(optional)</span>
          </Label>
          <Input
            id="desc"
            name="desc"
            placeholder="Notes, colour, etc."
            defaultValue={initial.desc}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-[1.4]">
            <Label htmlFor="weight" className="mb-1.5 block">
              Weight
            </Label>
            <div className="flex gap-2">
              <Input
                id="weight"
                name="weight"
                type="number"
                step="any"
                placeholder="0"
                defaultValue={initial.weight}
                className="flex-1"
              />
              <UnitSelect defaultValue={initial.unit} />
            </div>
          </div>
          <div className="flex-1">
            <Label htmlFor="qty" className="mb-1.5 block">
              Quantity
            </Label>
            <Input
              id="qty"
              name="qty"
              type="number"
              min={0}
              defaultValue={initial.qty}
            />
          </div>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Save changes" : "Add item"}</Button>
      </DialogFooter>
    </form>
  );
}

function UnitSelect({ defaultValue }: { defaultValue: "g" | "kg" }) {
  return (
    <Select name="unit" defaultValue={defaultValue}>
      <SelectTrigger className="w-[78px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="g">g</SelectItem>
        <SelectItem value="kg">kg</SelectItem>
      </SelectContent>
    </Select>
  );
}

function CategoryForm({
  initialName,
  isEdit,
  onCancel,
  onSave,
}: {
  initialName: string;
  isEdit: boolean;
  onCancel: () => void;
  onSave: (name: string) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const name = String(fd.get("name") ?? "").trim();
        if (name) onSave(name);
      }}
    >
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Rename category" : "New category"}
        </DialogTitle>
      </DialogHeader>

      <div className="mt-4">
        <Label htmlFor="cat-name" className="mb-1.5 block">
          Category name
        </Label>
        <Input
          id="cat-name"
          name="name"
          required
          autoFocus
          placeholder="e.g. Sleep system"
          defaultValue={initialName}
        />
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Save" : "Create"}</Button>
      </DialogFooter>
    </form>
  );
}

function DeleteConfirm({
  title,
  body,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <div className="flex gap-3.5">
        <div className="w-[42px] h-[42px] flex-none rounded-xl bg-[#f8e9e4] flex items-center justify-center text-destructive">
          <Trash2 className="h-5 w-5" />
        </div>
        <div>
          <DialogTitle className="text-[17px]">{title}</DialogTitle>
          <DialogDescription className="mt-1">{body}</DialogDescription>
        </div>
      </div>
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </DialogFooter>
    </>
  );
}
