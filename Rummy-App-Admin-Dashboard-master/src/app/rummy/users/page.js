"use client";
import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase";
import { SendToFirebase } from "../../firebase/function";
import { Button, Switch } from "@nextui-org/react";
import toast, { Toaster } from 'react-hot-toast';

const UsersPage = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Title: "",
    Image: null,
    Description: "",
    Keywords: "",
    Bonus: "",
    Withdrawal: "",
    Downloads: "",
    BannerImage: null,
    isRanked: 0,
  });


  const [otherApps, setOtherApps] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
  
    try {
      // Check if required fields are not empty
      const requiredFields = ["Name", "Title", "Description", "Keywords"];
      for (const field of requiredFields) {
        if (!formData[field]) {
          throw new Error(`Please provide a value for ${field}.`);
        }
      }
  
      // Check if Image is selected
      if (!formData.Image) {
        throw new Error("Please select an image.");
      }
  
      // Upload images and other data to Firebase
      const storageRef = ref(
        storage,
        `Images/All-Apps/${formData.Image.name}`
      );
      const uploadedImageSnapshot = await uploadBytes(
        storageRef,
        formData.Image
      );
      const imageUrl = await getDownloadURL(uploadedImageSnapshot.ref);
  
      let bannerImageUrl = "";
      if (formData.BannerImage) {
        const bannerStorageRef = ref(
          storage,
          `Images/All-Apps/Banners/${formData.BannerImage.name}`
        );
        const uploadedBannerSnapshot = await uploadBytes(
          bannerStorageRef,
          formData.BannerImage
        );
        bannerImageUrl = await getDownloadURL(uploadedBannerSnapshot.ref);
      }
  
      const id = Date.now();
  
      const istTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
  
      const newData = {
        id: id,
        Date: istTime,
        Name: formData.Name,
        Title: formData.Title,
        Description: formData.Description,
        Keywords: formData.Keywords,
        Image: imageUrl,
        BannerImage: bannerImageUrl,
        Bonus: formData.Bonus,
        Link: formData.Link,
        Withdrawal: formData.Withdrawal,
        Downloads: formData.Downloads,
        isRanked: 0,
      };
  
      if (otherApps) {
        newData.OtherApps = true;
      }
  
      await SendToFirebase("All-Apps", newData, id);
      // Show success toast
      toast.success("Data sent to Firebase successfully!");
      console.log("Data sent to Firebase successfully!");
    } catch (error) {
      console.error("Error processing form data:", error);
      // Show error toast
      toast.error(`Error: ${error.message}`);
    }
  };
  

  return (
    <div className="container mx-auto max-w-2xl p-4 md:mt-0 mt-10">
      <Toaster
      position="top-center"
      />
      <form
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col">
          <label className="text-gray-800 font-semibold text-xl">Game Name</label>
          <div className="border rounded-lg border-gray-400 mt-2">
            <input
              onChange={(e) =>
                setFormData({ ...formData, Name: e.target.value })
              }
              className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
              placeholder="Game-Name"
              type="text"
              id="name"
              required
            />
          </div>

          <div className="border rounded-lg border-gray-400 mt-2">
            <input
              onChange={(e) =>
                setFormData({ ...formData, Title: e.target.value })
              }
              className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
              placeholder="Game-Tittle"
              type="text"
              id="name"
              required
            />
          </div>

          <div className="border rounded-lg border-gray-400 mt-2">
            <input
              onChange={(e) =>
                setFormData({ ...formData, Description: e.target.value })
              }
              className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
              placeholder="Game-Description"
              type="text"
              id="name"
              required
            />
          </div>
          <div className="border rounded-lg border-gray-400 mt-2">
            <input
              onChange={(e) =>
                setFormData({ ...formData, Link: e.target.value })
              }
              className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
              placeholder="Link-URL"
              type="text"
              id="name"
            />
          </div>

          <div className="border rounded-lg border-gray-400 mt-2">
            <input
              onChange={(e) =>
                setFormData({ ...formData, Keywords: e.target.value })
              }
              className="w-full rounded-lg border-gray-300 p-2 text-sm focus:outline-none focus:border-black"
              placeholder="Game-Keywords"
              type="text"
              id="name"
              required
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-800 font-semibold text-xl">
            Extra Data
          </label>

          <div className="border rounded-lg border-gray-400 mt-2">
            <input
              onChange={(e) =>
                setFormData({ ...formData, Bonus: e.target.value })
              }
              className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
              placeholder="Bonus-Amount"
              type="text"
              id="name"
              required
            />
          </div>

          <div className="border rounded-lg border-gray-400 mt-2">
            <input
              onChange={(e) =>
                setFormData({ ...formData, Withdrawal: e.target.value })
              }
              className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
              placeholder="Withdrawal-Amount"
              type="text"
              id="name"
              required
            />
          </div>

          <div className="border rounded-lg border-gray-400 mt-2">
            <input
              onChange={(e) =>
                setFormData({ ...formData, Downloads: e.target.value })
              }
              className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
              placeholder="Total-Downloads"
              type="text"
              id="name"
              required
            />
          </div>
        </div>

        <label className="text-gray-800 font-semibold text-xl">
          Game Image
        </label>

        <div className="border rounded-lg border-gray-400 mt-1">
          <input
            onChange={(e) =>
              setFormData({ ...formData, Image: e.target.files[0] })
            }
            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
            type="file"
            accept="image/*"
            required
          />
        </div>

        <label className="text-gray-800 font-semibold text-xl">
          Game Banner Image
        </label>
        <div className="border rounded-lg border-gray-400 mt-1">
          <input
            onChange={(e) =>
              setFormData({ ...formData, BannerImage: e.target.files[0] })
            }
            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
            type="file"
            accept="image/*"
            required  
          />
        </div>

        <div className="flex items-center">
          <Switch
            checked={otherApps}
            onChange={(e) => setOtherApps(e.target.checked)}
          />
          <label className="ml-2 text-gray-800 font-thin text-sm">
            Other Apps
          </label>
        </div>

        <div className="flex flex-col">
          <Button
            type="submit"
            color="success"
            variant="bordered"
            className="w-full"
          >
            Add App
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UsersPage;
