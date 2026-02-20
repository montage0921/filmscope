import { useEffect, useState } from "react";
import Label from "./Label";
import type { Genre } from "../types";
import axios from "axios";

type SelectBoxProps = {
  genres: Genre[] | undefined;
  setGenres: React.Dispatch<React.SetStateAction<Genre[] | undefined>>
};

export default function GenreLabels({ genres, setGenres }: SelectBoxProps) {
  
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);

  useEffect(function () {
    async function getAllGenres() {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/genres`,
      );
      console.log(res.data);
      setAvailableGenres(res.data);
    }
    getAllGenres();
  }, []);

  function handleDelete(id: number) {
    const copy = genres?.filter((g) => g.genre_id !== id);
    setGenres(copy);
  }

  function handleAdd(g_id: number) {
    const genreToAdd = availableGenres.find((g) => g.genre_id === g_id);
    if (!genreToAdd) return;

    setGenres((prev) => {
      // Check if it already exists to avoid duplicates
      if (prev?.some((g) => g.genre_id === g_id)) return prev;

      // Use the nullish coalescing operator (??) to fallback to []
      return [...(prev ?? []), genreToAdd];
    });
  }

  return (
    <div className="min-w-[70%]">
      <div className="font-bold">Genres</div>

      <select
        id="genre-select"
        value="" 
        onChange={(e) => {
          const selectedId = Number(e.target.value);
          if (selectedId) handleAdd(selectedId);
        }}
      >
        <option value="" className="text-green-800">
          Add more genre
        </option>
        {availableGenres.map((g) => (
          <option
            key={g.genre_id}
            value={g.genre_id}
            className="text-green-600"
          >
            {g.genre}
          </option>
        ))}
      </select>

      <div className="flex flex-wrap gap-2 mt-2">
        {genres?.map((g) => (
          <Label
            key={g.genre_id}
            content={g.genre}
            id={g.genre_id}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
