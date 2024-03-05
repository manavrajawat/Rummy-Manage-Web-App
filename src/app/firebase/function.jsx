import { app } from "./firebase";
import { getFirestore, collection, addDoc, getDocs, setDoc,doc, updateDoc, getDoc, FieldValue} from "firebase/firestore";


const db = getFirestore(app);


export async function SendToFirebase(gameType, body,id) {
  try {
      const response =  await setDoc(doc(db, `${gameType}-collection`, `${id}`), body);

      return response;
  } catch (error) {
    console.error("Error sending data to Firebase:", error);
    throw error;
  }
}

export const GetAllGames = async () => {
  const collectionNames = ["All-Apps-collection"];

  const dataArrays = await Promise.all(collectionNames.map(async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => doc.data());
  }));

  const dataArray = dataArrays.flat();

  return dataArray;
};



export const updateGame = async (gameId, data) => {
  try {
    await updateDoc(doc(db, "All-Apps-collection", gameId), data);
    console.log("Game updated successfully");
  } catch (error) {
    console.error("Error updating game in Firestore:", error);
    throw error;
  }
};






