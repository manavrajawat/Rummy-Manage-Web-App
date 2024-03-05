'use client'
import React, { useEffect, useState } from "react";
import { GetAllGames } from "../../firebase/function";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import RankingCard from "@/components/Card/Card";

export default function Ranking() {
  const [gamesData, setGamesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonDisabledState, setButtonDisabledState] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetAllGames("All-Apps-collection");
        setGamesData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateRank = async (gameId, rank) => {
    try {
      const gameIdString = String(gameId);
      const updatedButtonDisabledState = { ...buttonDisabledState };

      const docRef = doc(db, "All-Apps-collection", gameIdString);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, { isRanked: rank });
        gamesData.forEach((game) => {
          updatedButtonDisabledState[game.id] = {
            rank1: rank === 1,
            rank2: rank === 2,
            rank3: rank === 3,
          };
        });
        console.log(`Game with ID ${gameIdString} ranked successfully!`);
      } else {
        console.log(`Game with ID ${gameIdString} not found in the collection`);
      }

      setButtonDisabledState(updatedButtonDisabledState);
      console.log("Button Disabled State:", updatedButtonDisabledState);
    } catch (error) {
      console.error(`Error updating game with ID ${gameId}:`, error);
    }
  };

  const resetRank = async (gameId) => {
    await updateRank(gameId, 0);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-wrap mt-10 items-center justify-center gap-4 md:mt-4">
      {gamesData.map((value, index) => (
        <RankingCard key={index} data={value} />
      ))}
    </div>
  );
}
