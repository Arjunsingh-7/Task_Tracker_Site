"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, Circle, Trash2, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { Task, Status } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
}

export function TaskItem({ task, onUpdate }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleStatus = async () => {
    setIsUpdating(true);
    try {
      const newStatus: Status = task.status === "Pending" ? "Completed" : "Pending";
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      
      toast.success(`Task marked as ${newStatus}`);
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteTask = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");
      
      toast.success("Task deleted");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const priorityColors = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900",
    Medium: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900",
    High: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900",
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 border-zinc-200/60 bg-white hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:shadow-none rounded-[2rem]",
      task.status === "Completed" && "bg-zinc-50/50 dark:bg-zinc-900/40"
    )}>
      <CardHeader className="p-6 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={cn("px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg border", priorityColors[task.priority])}>
                {task.priority}
              </Badge>
              {task.status === "Completed" && (
                <Badge variant="secondary" className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  Completed
                </Badge>
              )}
            </div>
            <CardTitle className={cn(
              "text-lg font-semibold tracking-tight leading-snug transition-all duration-300",
              task.status === "Completed" ? "text-zinc-400 line-through decoration-zinc-300" : "text-zinc-900 dark:text-zinc-50"
            )}>
              {task.title}
            </CardTitle>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl opacity-0 transition-opacity group-hover:opacity-100 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove this objective. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl border-zinc-200">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteTask}
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        {task.description && (
          <p className={cn(
            "text-sm leading-relaxed mb-4 line-clamp-2",
            task.status === "Completed" ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"
          )}>
            {task.description}
          </p>
        )}
        <div className={cn(
          "flex items-center text-[13px] font-medium",
          task.status === "Completed" ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"
        )}>
          <Calendar className="mr-2 h-3.5 w-3.5 opacity-70" />
          {format(new Date(task.due_date), "MMM d, yyyy")}
        </div>
      </CardContent>

      <div className="px-6 pb-6 mt-auto">
        <Button
          variant="ghost"
          className={cn(
            "w-full h-11 rounded-xl text-sm font-medium transition-all active:scale-[0.98]",
            task.status === "Completed" 
              ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700" 
              : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm"
          )}
          onClick={toggleStatus}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : task.status === "Completed" ? (
            <>
              <Circle className="mr-2 h-4 w-4" />
              Undo Complete
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Complete Task
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
