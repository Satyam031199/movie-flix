import axios from "axios";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  increment,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";

const API_BASE_URL = "https://api.themoviedb.org/3/";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export const fetchMovies = async (query) => {
  try {
    const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
    const response = await axios.get(endpoint, API_OPTIONS);
    return response.data.results;
  } catch (error) {
    throw new Error("Error fetching movies");
  }
};

export const updateSearchCount = async (searchTerm, movie) => {
  if(!movie) return;
  try {
    const collectionRef = collection(db, "metrics");
    const searchQuery = query(
      collectionRef,
      where("searchTerm", "==", searchTerm)
    );
    const searchResults = await getDocs(searchQuery);
    if (searchResults.empty) {
      await addDoc(collectionRef, {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    } else {
      const docRef = searchResults.docs[0].ref;
      await updateDoc(docRef, {
        count: increment(1), // Increment the count by 1
      });
    }
  } catch (error) {
    throw new Error("Error updating search count", error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const collectionRef = collection(db, "metrics");
    const searchQuery = query(
      collectionRef,
      orderBy("count", "desc"),
      limit(5)
    );
    const searchResults = await getDocs(searchQuery);
    const movies = searchResults.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return movies;
  } catch (error) {
    throw new Error("Error fetching trending movies", error);
  }
};
