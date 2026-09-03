"use client";

import { useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  File as FileIcon,
  Trash2,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import { useWizardStore } from "@/store/useWizardStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { DOCUMENT_CATEGORIES } from "@/lib/types";
import type { DocumentCategory } from "@/lib/types";
import { formatBytes, cn } from "@/lib/utils";

export function DocumentUploader() {
  const {
    documents,
    addFiles,
    updateDocumentCategory,
    updateDocumentProgress,
    removeDocument,
  } = useWizardStore();

  const timersRef = useRef<Map<string, ReturnType<typeof setInterval>>>(
    new Map(),
  );

  const simulateUpload = useCallback(
    (id: string) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress = Math.min(100, progress + Math.random() * 25 + 10);
        updateDocumentProgress(
          id,
          progress,
          progress >= 100 ? "uploaded" : "uploading",
        );
        if (progress >= 100) {
          clearInterval(interval);
          timersRef.current.delete(id);
        }
      }, 220);
      timersRef.current.set(id, interval);
    },
    [updateDocumentProgress],
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      const ids = addFiles(accepted);
      ids.forEach((id) => simulateUpload(id));
    },
    [addFiles, simulateUpload],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearInterval(t));
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/msword": [".doc", ".docx"],
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-5"
    >
      <Card>
        <CardHeader>
          <CardTitle>Supporting Documents</CardTitle>
          <CardDescription>
            Upload ID proofs, income statements, bank statements and any other
            supporting files.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors",
              isDragActive
                ? "border-google-blue bg-google-blue-tint"
                : "border-border hover:border-google-blue/50 hover:bg-surface-hover",
            )}
          >
            <input {...getInputProps()} />
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-google-blue-tint text-google-blue-hover">
              <UploadCloud className="h-5 w-5" />
            </span>
            <p className="text-sm font-medium text-foreground">
              {isDragActive
                ? "Drop the files here"
                : "Drag & drop files, or click to browse"}
            </p>
            <p className="text-xs text-foreground-muted">
              PDF, JPG, PNG or DOC up to 10MB each
            </p>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence initial={false}>
        {documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-2.5 overflow-hidden"
          >
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="flex items-center gap-3 p-3.5 sm:p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-hover text-foreground-muted">
                    <FileIcon className="h-4.5 w-4.5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-foreground">
                        {doc.name}
                      </p>
                      {doc.status === "uploaded" && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-google-green" />
                      )}
                    </div>
                    <p className="text-xs text-foreground-muted">
                      {formatBytes(doc.size)}
                    </p>
                    {doc.status !== "uploaded" && (
                      <div className="mt-1.5">
                        <Progress value={doc.progress} />
                      </div>
                    )}
                  </div>

                  <Select
                    value={doc.category}
                    onChange={(e) =>
                      updateDocumentCategory(
                        doc.id,
                        e.target.value as DocumentCategory,
                      )
                    }
                    className="hidden h-9 w-44 shrink-0 text-xs sm:block"
                  >
                    {DOCUMENT_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </Select>

                  <button
                    type="button"
                    onClick={() => removeDocument(doc.id)}
                    aria-label={`Remove ${doc.name}`}
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-google-red-tint hover:text-google-red"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
