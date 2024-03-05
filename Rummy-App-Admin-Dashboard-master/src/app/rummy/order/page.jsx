"use client";
import React, { useEffect, useState } from "react";
import { GetAllGames, updateGame } from "../../firebase/function";
import { Button } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/app/firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function Orders() {
  const [gamesData, setGamesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);

  /////////////////////////////////////////////////////////////////
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    Name: "",
    Image: "",
    Description: "",
    Downloads: 0,
    Bonus: 0,
    isTop: false,
  });

  const [imageFile, setImageFile] = useState(null);

  const getGameData = async (gameId) => {
    try {
      if (typeof gameId !== "string" || gameId.trim() === "") {
        console.error("Error fetching game data: Invalid gameId");
        throw new Error("Invalid gameId");
      }

      console.log("Fetching game data for gameId:", gameId);

      const gameDocRef = doc(db, "All-Apps-collection", gameId);
      console.log("gameDocRef:", gameDocRef);

      const gameDocSnapshot = await getDoc(gameDocRef);

      if (gameDocSnapshot.exists()) {
        const gameData = gameDocSnapshot.data();
        console.log("gameData:", gameData);
        return gameData;
      } else {
        console.error("Error fetching game data: Document does not exist");
        throw new Error("Document does not exist");
      }
    } catch (error) {
      console.error("Error fetching game data:", error);
      throw error;
    }
  };

  const toggleEditForm = async (gameId) => {
    try {
      console.log("Before setting gameId in state:", editFormData.gameId);
      console.log("Received gameId:", gameId);

      const id = typeof gameId === "string" ? gameId : String(gameId);

      setEditFormData({
        ...editFormData,
        gameId: id,
      });

      console.log("After setting gameId in state:", editFormData.gameId);

      const gameData = await getGameData(id);
      console.log("Fetched data:", gameData);

      setEditFormData((prevData) => ({
        ...prevData,
        Name: gameData.Name,
        Image: gameData.Image,
        Description: gameData.Description,
        Downloads: gameData.Downloads,
        Bonus: gameData.Bonus,
        isTop: gameData.isTop,
        gameId: id,
      }));

      setEditFormOpen(true);
    } catch (error) {
      console.error("Error toggling edit form:", error);
    }
  };

  const handleEditFormChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      setImageFile(file);
    } else {
      setEditFormData({
        ...editFormData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const uploadImage = async (file, gameId) => {
    try {
      if (!gameId || typeof gameId !== "string") {
        console.error("Invalid gameId:", gameId);
        return;
      }

      const storageRef = ref(storage, `Images/All-Apps/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
        },
        (error) => {
          console.error("Error uploading image:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updateGameImage(gameId, { Image: downloadURL });
          });
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const updateGame = async (gameId, updatedGameData) => {
    try {
      const gameDocRef = doc(db, "All-Apps-collection", gameId);
      const gameDoc = await getDoc(gameDocRef);

      if (gameDoc.exists()) {
        await updateDoc(gameDocRef, updatedGameData);
      } else {
        await setDoc(gameDocRef, updatedGameData);
      }

      console.log("Game successfully updated.");
    } catch (error) {
      console.error("Error updating game:", error);
    }
  };

  const updateGameImage = async (gameId, updatedGameData) => {
    try {
      const gameDocRef = doc(db, "All-Apps-collection", gameId);
      const gameDoc = await getDoc(gameDocRef);

      if (gameDoc.exists()) {
        await updateDoc(gameDocRef, updatedGameData);
      } else {
        await setDoc(gameDocRef, updatedGameData);
      }

      console.log("Game image successfully updated.");
    } catch (error) {
      console.error("Error updating game image:", error);
    }
  };

  const handleUpdateApp = async () => {
    try {
      if (!editFormData.gameId) {
        console.error("Game ID is undefined or null");
        return;
      }

      if (imageFile) {
        await uploadImage(imageFile, editFormData.gameId);
      } else {
        await updateGame(editFormData.gameId, {
          Name: editFormData.Name,
          Description: editFormData.Description,
          Downloads: editFormData.Downloads,
          Bonus: editFormData.Bonus,
          isTop: editFormData.isTop,
        });
      }

      console.log("App successfully updated.");
      toast.success("App successfully updated.");

      setEditFormOpen(false);
      setEditFormData({
        Name: "",
        Image: "",
        Downloads: 0,
        Description: "",
        Bonus: 0,
        isTop: false,
        gameId: "",
      });

      setImageFile(null);
      setForceUpdate((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating app:", error);
      toast.error(`Error updating app: ${error.message}`);
    }
  };

  /////////////////////////////////////////////////////////////////

  useEffect(() => {
    GetAllGames().then((data) => {
      setGamesData(data);
      console.log(data);
      setLoading(false);
    });
  }, [forceUpdate]);

  const handleMakeBestApp = async (gameId) => {
    try {
      setGamesData((prevGames) => {
        const updatedGames = prevGames.map((game) =>
          game.id === gameId ? { ...game, isTop: true } : game
        );
        return updatedGames;
      });

      await updateGame(String(gameId), { isTop: true });

      console.log("Game updated successfully");
      toast.success("App marked as Top App");
    } catch (error) {
      console.error("Error making best app:", error);
      toast.error("Error making best app:", error);
    }
  };

  const RemoveBest = async (gameId) => {
    try {
      setGamesData((prevGames) => {
        const updatedGames = prevGames.map((game) =>
          game.id === gameId ? { ...game, isTop: false } : game
        );
        return updatedGames;
      });

      await updateGame(String(gameId), { isTop: false });

      console.log("Game updated successfully");
      toast.success("Removed from Top Apps");
    } catch (error) {
      console.error("Error undoing best app:", error);
      toast.error("Error undoing best app:", error);
    }
  };

  const DeleteApp = async (gameId) => {
    try {
      const gameIdString = String(gameId);

      setGamesData((prevGames) =>
        prevGames.filter((game) => game.id !== gameIdString)
      );

      await deleteDoc(doc(db, "All-Apps-collection", gameIdString));

      toast.success("App deleted successfully");

      setForceUpdate((prev) => prev + 1);
    } catch (error) {
      toast.error(`Error deleting app: ${error.message}`);
      console.error("Error deleting app:", error);
    }
  };

  return (
    <main className="w-full px-4 pb-8 pt-16 md:mt-0 mt-10 bg-white md:px-8 rounded-lg shadow-md">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Modify-Your-App
        </h1>
        <div className="overflow-x-auto">
          <div className="max-w-full overflow-auto">
            <Toaster />
            <table className="min-w-full table-auto border-collapse border border-gray-300 rounded-md">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="border border-gray-300 p-2 text-black">#</th>
                  <th className="border border-gray-300 p-2 text-black">
                    Game Name
                  </th>
                  <th className="border border-gray-300 p-2 text-black">
                    Image
                  </th>
                  <th className="border border-gray-300 p-2 text-black">
                    Ranked
                  </th>
                  <th className="border border-gray-300 p-2 text-black">
                    Best Game
                  </th>
                  <th className="border border-gray-300 p-2 text-black">
                    Downloads
                  </th>
                  <th className="border border-gray-300 p-2 text-black">Top</th>
                  <th className="border border-gray-300 p-2 text-black">
                    Undo
                  </th>
                  <th className="border border-gray-300 p-2 text-black">
                    Delete
                  </th>
                  <th className="border border-gray-300 p-2 text-black">
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody>
                {gamesData.map((value, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-blue-100" : "bg-white"}
                  >
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{value.Name}</td>
                    <td className="border border-gray-300 p-2">
                      {value.Image && (
                        <img
                          src={value.Image}
                          alt={value.Name}
                          className="w-8 h-8 object-cover rounded-full"
                        />
                      )}
                    </td>

                    <td className="border border-gray-300 p-2">
                      {value.isRanked}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {value.isTop !== undefined ? value.isTop.toString() : ""}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {value.Downloads}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Button
                        color="success"
                        variant="bordered"
                        onClick={() => handleMakeBestApp(value.id)}
                      >
                        Make Top App
                      </Button>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Button
                        color="danger"
                        variant="bordered"
                        onClick={() => RemoveBest(value.id)}
                      >
                        Undo Top App
                      </Button>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Button
                        color="danger"
                        variant="bordered"
                        onClick={() => DeleteApp(value.id)}
                      >
                        Delete App
                      </Button>
                    </td>

                    <td className="border border-gray-300 p-2">
                      <Button
                        color="success"
                        variant="bordered"
                        onClick={() => toggleEditForm(value.id)}
                      >
                        Edit App
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {editFormOpen && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-2">Edit App Form</h2>

            <label htmlFor="Name" className="text-sm font-semibold mr-2">
              Name
            </label>

            <input
              type="text"
              name="Name"
              value={editFormData.Name}
              onChange={handleEditFormChange}
              placeholder="Enter Name"
              className="border border-gray-300 p-2 mb-4 w-full"
            />

            <label htmlFor="Downloads" className="text-sm font-semibold mr-2">
              Downloads
            </label>

            <input
              type="text"
              name="Downloads"
              value={editFormData.Downloads}
              onChange={handleEditFormChange}
              placeholder="Enter Downloads"
              className="border border-gray-300 p-2 mb-4 w-full"
            />

            <label htmlFor="Description" className="text-sm font-semibold mr-2">
              Description
            </label>

            <input
              type="text"
              name="Description"
              value={editFormData.Description}
              onChange={handleEditFormChange}
              placeholder="Enter Description"
              className="border border-gray-300 p-2 mb-4 w-full"
            />

            <label htmlFor="Bonus" className="text-sm font-semibold mr-2">
              Bonus
            </label>

            <input
              type="text"
              name="Bonus"
              value={editFormData.Bonus}
              onChange={handleEditFormChange}
              placeholder="Enter Bonus"
              className="border border-gray-300 p-2 mb-4 w-full"
            />

            <label htmlFor="Image" className="text-sm font-semibold mr-2">
              Image
            </label>
            <input
              type="file"
              name="Image"
              accept="image/*"
              onChange={handleEditFormChange}
              className="border border-gray-300 p-2 mb-4 w-full"
            />

            <Button
              color="success"
              onClick={() => handleUpdateApp(editFormData.id)}
            >
              Update App
            </Button>
            <Button
              className="ml-2"
              color="danger"
              onClick={() => setEditFormOpen(false)}
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
