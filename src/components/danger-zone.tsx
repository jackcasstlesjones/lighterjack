"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function DangerZone({ email }: { email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setPassword("");
    setError(null);
    setSubmitting(false);
  }

  async function onConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await authClient.deleteUser({ password });
      if (result.error) {
        setError(result.error.message || "Could not delete account.");
        setSubmitting(false);
        return;
      }
      router.push("/sign-in");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6 mt-6 border-destructive/30">
      <h2 className="text-lg font-bold mb-1 text-destructive">Danger zone</h2>
      <p className="text-sm text-muted-foreground mb-5">
        Permanently delete your account, all pack lists, and saved preferences.
        This can’t be undone.
      </p>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete account
      </Button>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) reset();
        }}
      >
        <DialogContent hideClose>
          <form onSubmit={onConfirm}>
            <div className="flex gap-3.5">
              <div className="w-[42px] h-[42px] flex-none rounded-xl bg-[#f8e9e4] flex items-center justify-center text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-[17px]">
                  Delete account?
                </DialogTitle>
                <DialogDescription className="mt-1">
                  This will permanently delete <strong>{email}</strong> and every
                  pack list on it. Enter your password to confirm.
                </DialogDescription>
              </div>
            </div>

            <div className="mt-5">
              <Label htmlFor="delete-password" className="mb-1.5 block">
                Password
              </Label>
              <Input
                id="delete-password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <p className="text-sm text-destructive mt-2 m-0">{error}</p>
              )}
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={submitting || password.length === 0}
              >
                {submitting ? "Deleting…" : "Delete account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
