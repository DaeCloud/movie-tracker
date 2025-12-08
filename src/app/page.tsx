'use client';

import { useEffect, useState } from "react";
import { Movie } from "./models/Movie";
import MovieList from "./components/MovieList";
import AddMovieDialog from "./components/AddMovieDialog";
import Image from "next/image";
import Icon from './public/Icon.png';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMovieDialog, setShowAddMovieDialog] = useState(false);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch("/api/movies");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: Movie[] = await response.json();
        setMovies(data);
        checkAvailability(data);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  async function checkAvailability(movies: Movie[]) {
    const updated = await Promise.all(
      movies.map(async (m) => {
        try {
          const response = await fetch("/api/plex/availability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: m.id }),
          });

          const data = await response.json();
          console.log(`Availability for movie ID ${m.id}:`, data.availability);
          return { ...m, available: data.availability, requested: data.requested };
        } catch (error) {
          console.error("Error checking availability:", error);
          return m; // fallback to original movie if request fails
        }
      })
    );

    setMovies(updated);
    console.log("Updated movies with availability:", updated);
  }


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-gray-300">
        Loading movies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-black">
      <main className="flex min-h-screen w-full flex-col items-center py-16 px-0 md:px-8 bg-black sm:items-start pt-0">
        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center space-x-4">
            <Image
              src={Icon}
              alt="Icon"
              width={256}   // adjust size as needed
              height={256}
            />
            {/* <h1 className="text-4xl font-bold text-gray-100">
              Movie Tracker
            </h1> */}
          </div>
          <button
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-full shadow hover:bg-blue-700 transition-colors hover:cursor-pointer"
            onClick={() => {
              setShowAddMovieDialog(true);
            }}
          >
            Add Movie
          </button>
        </div>

        <MovieList movies={movies} />
        {showAddMovieDialog && (
          <AddMovieDialog />
        )}

        <a
          href="/Add Movie To Tracker.shortcut"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0057FF] text-white font-medium shadow hover:bg-[#0049d6] transition"
        >
          <Image
            src="https://developer.apple.com/design/human-interface-guidelines/images/intro/shortcuts_2x.png"
            alt="Shortcuts Icon"
            className="w-5 h-5"
          />
          Add to Shortcuts
        </a>

      </main>
    </div>
  );
}
