'use client'

import React, { useState, ChangeEvent, FormEvent } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/firebase";
import { Switch } from "@nextui-org/react";
import toast, { Toaster } from 'react-hot-toast';


interface FormData {
  Name: string;
  Title: string;
  Image: File | null;
  Link: string;
}

export default function SettingsPage() {
  const [formData, setFormData] = useState<FormData>({
    Name: "",
    Title: "",
    Image: null,
    Link: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const adsCollection = collection(db, "advertisements");

      const id = Date.now();

      const imageUrl = await uploadImageToStorage();

      await addDoc(adsCollection, {
        id: id,
        Date: Date.now(),
        Name: formData.Name,
        Title: formData.Title,
        Image: imageUrl,
        Link: formData.Link,
      });

      console.log("Data sent to Firebase successfully!");
      toast.success('Advertisement added successfully');
      setFormData({ Name: "", Title: "", Image: null, Link: ""});
    } catch (error) {
      console.error("Error sending data to Firebase:", error);
      toast.error('Error adding advertisement');
    }
  };

  const uploadImageToStorage = async () => {
    try {
      if (!formData.Image) {
        throw new Error("No image selected");
      }

      const storageRef = ref(storage, `Images/${formData.Image.name}`);
      await uploadBytes(storageRef, formData.Image);

      // Get the download URL
      const imageUrl = await getDownloadURL(storageRef);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <div className="container mx-auto max-w-xl p-4 md:mt-0 mt-10">
      <Toaster />
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold mb-2">Add Advertisement</h2>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="Title"
            value={formData.Title}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Title"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="link" className="block text-sm font-medium text-gray-700">
            Link
          </label>
          <input
            type="text"
            id="link"
            name="Link"
            value={formData.Link}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Link"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="Image"
            onChange={handleInputChange}
            accept="image/*"
            className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="active" className="block text-sm font-medium text-gray-700">
            Active
          </label>
          <Switch defaultSelected aria-label="Active" />
        </div>

        <div>
          <button
            type="submit"
            className="inline-block w-full rounded-lg bg-blue-500 px-5 py-3 font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Add Advertisement
          </button>
        </div>
      </form>
    </div>
  );
}
