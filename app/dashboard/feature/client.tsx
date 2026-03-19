"use client";

import {
  createFeatureItemAction,
  deleteFeatureItemAction,
  updateFeatureItemAction,
} from "@/app/dashboard/feature/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

// Purpose: Client UI for /dashboard/feature.
// Use this file for client-only hooks and browser-only logic
// (for example `useFormState`, `useFormStatus`, `useState`, or `dynamic(..., { ssr: false })`).
//
// Replication guide for new feature UIs:
// - Keep all DB/session logic out of this file.
// - Accept preloaded data + permission flags from `page.tsx`.
// - Bind server actions directly to forms (`action={...}`).
// - Use the same "List + Add dialog + Edit dialog + Delete action" layout to bootstrap quickly.
// - Keep the empty state and read-only state explicit so behavior is obvious.

type ClientProps = {
  status: "success" | "error" | null;
  message: string | null;
  canManage: boolean;
  items: {
    id: string;
    title: string;
    description: string;
    status: string;
    updatedAt: string;
  }[];
};

function formatTimestamp(iso: string) {
  // Keep this deterministic across SSR and hydration.
  // Locale-dependent formatting (e.g. toLocaleString) can mismatch by timezone/locale.
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown";
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min} UTC`;
}

export default function Client({ status, message, canManage, items }: ClientProps) {
  return (
    <section className="space-y-6">
      {/* Page header + primary action.
         Pattern: put create action at top-right for predictable CRUD UX. */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Feature CRUD Example</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reusable pattern: list page + add-item dialog + row-level edit/delete actions.
          </p>
        </header>
        {canManage ? (
          // Create dialog pattern:
          // - Trigger button opens modal.
          // - Form posts directly to server action.
          // - Use same field names as action schema keys.
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Feature Item</DialogTitle>
                <DialogDescription>
                  Create a new record with server-action validation.
                </DialogDescription>
              </DialogHeader>
              <form action={createFeatureItemAction} className="space-y-3">
                {/* Keep field naming consistent across create/edit forms.
                   This makes action schema reuse straightforward. */}
                <div className="space-y-2">
                  <label htmlFor="new-title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input id="new-title" name="title" required maxLength={80} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="new-status" className="text-sm font-medium">
                    Status
                  </label>
                  <select
                    id="new-status"
                    name="status"
                    defaultValue="active"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="new-description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea id="new-description" name="description" maxLength={500} rows={3} />
                </div>

                <DialogFooter>
                  {/* `DialogClose` keeps cancel behavior consistent and accessible. */}
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Create Item</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      {status && message ? (
        // Flash message area fed by query params after action redirects.
        // Copy this block into new pages to keep status feedback consistent.
        <p
          className={`rounded-md border px-3 py-2 text-sm ${
            status === "success"
              ? "border-emerald-500/30 text-emerald-600"
              : "border-destructive/30 text-destructive"
          }`}
        >
          {message}
        </p>
      ) : null}

      {!canManage ? (
        // Explicit read-only notice helps avoid confusion for member-level users.
        <p className="text-sm text-muted-foreground">
          You can view items, but only owner/admin can create, edit, or delete.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Items</CardTitle>
          <CardDescription>Team-scoped records for CRUD scaffolding.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* List view pattern:
             - Table for compact scanning.
             - Keep high-signal columns visible on desktop.
             - Hide secondary columns on small screens. */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="hidden md:table-cell">Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                // Empty state should tell user exactly how to proceed.
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No items yet. Use Add Item to create your first record.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "active" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden max-w-[260px] truncate md:table-cell">
                      {item.description || "No description"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatTimestamp(item.updatedAt)}
                    </TableCell>
                    <TableCell>
                      {/* Row actions:
                         - Edit uses dialog for in-context updates.
                         - Delete uses direct form submit for simplicity.
                         - Both actions remain server-authoritative via action guards. */}
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" disabled={!canManage}>
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Item</DialogTitle>
                              <DialogDescription>
                                Update fields and save changes.
                              </DialogDescription>
                            </DialogHeader>
                            <form action={updateFeatureItemAction} className="space-y-3">
                              <input type="hidden" name="id" value={item.id} />
                              {/* Hidden id field is required for row-targeted updates. */}

                              <div className="space-y-2">
                                <label htmlFor={`title-${item.id}`} className="text-sm font-medium">
                                  Title
                                </label>
                                <Input
                                  id={`title-${item.id}`}
                                  name="title"
                                  defaultValue={item.title}
                                  required
                                  maxLength={80}
                                />
                              </div>

                              <div className="space-y-2">
                                <label htmlFor={`status-${item.id}`} className="text-sm font-medium">
                                  Status
                                </label>
                                <select
                                  id={`status-${item.id}`}
                                  name="status"
                                  defaultValue={item.status}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                  <option value="active">active</option>
                                  <option value="inactive">inactive</option>
                                </select>
                              </div>

                              <div className="space-y-2">
                                <label
                                  htmlFor={`description-${item.id}`}
                                  className="text-sm font-medium"
                                >
                                  Description
                                </label>
                                <Textarea
                                  id={`description-${item.id}`}
                                  name="description"
                                  defaultValue={item.description}
                                  maxLength={500}
                                  rows={3}
                                />
                              </div>

                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button type="submit">Save Changes</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <form action={deleteFeatureItemAction}>
                          {/* Delete stays intentionally small and obvious.
                             For sensitive data, replace with a confirm dialog later. */}
                          <input type="hidden" name="id" value={item.id} />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            disabled={!canManage}
                          >
                            <Trash2 className="mr-1 size-4" />
                            Delete
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
