"use client";

import { useState } from "react";
import { IssueStatus, IssueType } from "@/modules/issue/schema";

// TODO: Remove this for schema
type IssueForm = {
  title: string;
  type: string;
  status: string;
  description: string;
  images: File[];
  lat: number;
  lng: number;
};

type Props = {
  isOpen: boolean;
  coords: { lat: number; lng: number };
  onClose: () => void;
  onSubmit: (data: IssueForm) => void;
};

export function IssueCreator({ isOpen, coords, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<IssueType>(Object.values(IssueType)[0] as IssueType);
  const [status, setStatus] = useState<IssueStatus>(Object.values(IssueStatus)[0] as IssueStatus);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);

  if (!isOpen || !coords) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      title,
      type,
      status,
      description,
      images,
      lat: coords.lat,
      lng: coords.lng,
    });

    setTitle("");
    setType(Object.values(IssueType)[0] as IssueType);
    setStatus(Object.values(IssueStatus)[0] as IssueStatus);
    setDescription("");
    setImages([]);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-end z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md h-full p-6 shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Create Issue</h2>
        <p className="text-sm text-gray-600 mb-4">
          Location: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as IssueType)}
              className="w-full border rounded px-3 py-2"
            >
              {Object.values(IssueType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as IssueStatus)}
              className="w-full border rounded px-3 py-2"
            >
              {Object.values(IssueStatus).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setImages(Array.from(e.target.files ?? []))
              }
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 mt-2"
          >
            Create Issue
          </button>
        </form>
      </div>
    </div>
  );
}