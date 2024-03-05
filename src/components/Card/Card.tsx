import { db } from "@/app/firebase/firebase";
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";

interface CardProps {
  data: {
    Name: string;
    Bonus: string;
    Image: string;
    id: number;
    isRanked: number | null;
  };
}

function Card({ data }: CardProps) {
  const [selectedRank, setSelectedRank] = useState<number | null>(null);
  const [currentRanks, setCurrentRanks] = useState<{
    [key: number]: number | null;
  }>({});

  useEffect(() => {
    const fetchCurrentRanks = async () => {
      try {
        const ranks: { [key: number]: number | null } = {};

        for (let i = 1; i <= 3; i++) {
          const docRef = doc(db, "All-Apps-collection", `Rank${i}`);
          const docSnap = await getDoc(docRef);

          ranks[i] = docSnap.exists() ? docSnap.data().gameId : null;
        }

        setCurrentRanks(ranks);
      } catch (error) {
        console.error("Error fetching current ranks:", error);
      }
    };

    fetchCurrentRanks();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    toast[type](message);
  };

  const handleRankClick = async (rank: number) => {
    try {
      if (
        data.isRanked !== null &&
        data.isRanked !== undefined &&
        data.isRanked !== 0
      ) {
        showToast(`Game with ID ${data.id} already has a rank.`, "error");
        console.log(`Game with ID ${data.id} already has a rank.`);
        return;
      }

      const allDocsRef = collection(db, "All-Apps-collection");
      const allDocsSnapshot = await getDocs(allDocsRef);

      const hasRank = allDocsSnapshot.docs.some((doc) => {
        const docData = doc.data();
        return docData.isRanked !== null && docData.isRanked === rank;
      });

      if (hasRank) {
        showToast(`Rank ${rank} is already assigned to another game.`, "error");
        console.log(`Rank ${rank} is already assigned to another game.`);
        return;
      }

      const docRef = doc(db, "All-Apps-collection", data.id.toString());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, { isRanked: rank });
        showToast(
          `Game with ID ${data.id} ranked successfully at Rank ${rank}!`,
          "success"
        );
        console.log(
          `Game with ID ${data.id} ranked successfully at Rank ${rank}!`
        );

        setSelectedRank(rank);
      } else {
        showToast(
          `Game with ID ${data.id} not found in the collection`,
          "error"
        );
        console.log(`Game with ID ${data.id} not found in the collection`);
      }
    } catch (error) {
      console.error(`Error updating game with ID ${data.id}:`, error);
    }
  };

  const resetRanks = async () => {
    try {
      const docRef = doc(db, "All-Apps-collection", data.id.toString());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, { isRanked: 0 });
        showToast(
          `Ranks reset successfully for game with ID ${data.id}!`,
          "success"
        );
        console.log(`Ranks reset successfully for game with ID ${data.id}!`);

        setSelectedRank(null);

        setCurrentRanks({ 1: null, 2: null, 3: null });
      } else {
        showToast(`Document with ID ${data.id} not found`, "error");
        console.log(`Document with ID ${data.id} not found`);
      }
    } catch (error) {
      console.error(
        `Error resetting ranks for game with ID ${data.id}:`,
        error
      );
    }
  };

  return (
    <div className="bg-white rounded-lg mt-2 overflow-hidden shadow-md p-4">
      <div className="image-container mb-4 flex w-full items-center justify-center">
        <img
          src={data.Image}
          alt={data.Name}
          width={100}
          height={100}
          className="aspect-square object-cover rounded-lg"
        />
      </div>
      <div className="content-container text-center">
        <div className="text-container mb-4">
          <h1 className="text-xl font-semibold">{data.Name}</h1>
          <p className="text-gray-600">Bonus: {data.Bonus}</p>
        </div>
        <div className=" space-x-2">
          {[1, 2, 3].map((rank) => (
            <button
              key={rank}
              className={`rank-button text-xs ${
                selectedRank === rank
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => handleRankClick(rank)}
              disabled={selectedRank !== null && selectedRank !== rank}
            >
              Rank {rank}
            </button>
          ))}
          <button
            className="reset-button text-xs bg-red-500 mt-3 text-white"
            onClick={resetRanks}
          >
            Reset Ranks
          </button>
        </div>
        <Toaster />
      </div>

      <style jsx>{`
        .card-container {
          border: 1px solid #e2e8f0;
        }

        .image-container {
          margin-bottom: 1.5rem;
        }

        .text-container {
          margin-bottom: 1rem;
        }

        .rank-button,
        .reset-button {
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s;
        }

        .rank-button:disabled {
          cursor: not-allowed;
        }

        .rank-button:hover,
        .reset-button:hover {
          filter: brightness(90%);
        }
      `}</style>
    </div>
  );
}

export default Card;
