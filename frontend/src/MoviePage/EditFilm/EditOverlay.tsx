import { useState } from "react";
import Input from "../../Auth/Input";
import type { BasicFilmInfo, DetailedFilmInfo } from "../../types";
import GenreLabels from "../../Utility/GenreLabels";
import TextArea from "../../Utility/TextArea";
import { useEditForm } from "./hooks/useFilmEditForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type EditOverLayProps = {
  filmInfo: DetailedFilmInfo | null;
  toggleEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditOverlay({
  filmInfo,
  toggleEdit,
}: EditOverLayProps) {
  const initialEditableFilmInfo: BasicFilmInfo = {
    title: filmInfo?.title || "",
    original_title: filmInfo?.original_title || "",
    director: filmInfo?.director || "",
    casts: filmInfo?.casts || "",
    runtime: filmInfo?.runtime || -1,
    year: filmInfo?.year || -1,
    countries: filmInfo?.countries || "",
    languages: filmInfo?.languages || "",
    poster: filmInfo?.poster || "",
    backdrop: filmInfo?.backdrop || "",
    plot: filmInfo?.plot || "",
  };

  const { filmForm, handleChange, getConstraints, checkIfAllGood } =
    useEditForm(initialEditableFilmInfo);
  const [allGenres, setAllGenres] = useState(filmInfo?.genres);
  const [updatedMap, setUpdatedMap] = useState(new Map());
  const navgiate = useNavigate();

  function handleUpdate(key: keyof BasicFilmInfo, val: string) {
    let oldValue = undefined;
    if (filmInfo) {
      oldValue = filmInfo[key];
    }

    let newVal = undefined;
    if (key === "runtime") newVal = Number(val);
    else if (key === "year") newVal = Number(val);
    else newVal = val;

    handleChange(key, newVal); // update visual input

    // update updatedMap
    const copy = new Map(updatedMap);
    if (newVal === oldValue) {
      if (copy.has(key)) copy.delete(key);
    } else {
      copy.set(key, newVal);
    }
    setUpdatedMap(copy);
  }

  async function handleChangeSubmit() {
    const film_id = filmInfo?.film_id;
    if (film_id == null) {
      alert("no film_id is found")
      return
    };

    const JWT = localStorage.getItem("token");
    if(!JWT){
      alert("no JWT token")
      return
    }
    const config = {
      headers: { Authorization: `Bearer ${JWT}` },
      validateStatus: () => true,
    };
    const requests = [];
    // for change of basic film info
    if (updatedMap.size > 0) {
      const pojo = Object.fromEntries(updatedMap); // convert Map to POJO
      const req = axios.patch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/films/${film_id}`,
        pojo,
        config,
      );
      requests.push(req);
    }

    // for change of genre
    const genresChanged = JSON.stringify(filmInfo?.genres ?? []) !== JSON.stringify(allGenres ?? []);

    if (genresChanged) {
      console.log("genre updating....")
      console.log(allGenres)
      const req = axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/films/${film_id}/genres`,
        allGenres,
        config, // <- IMPORTANT: never throw)
      );
      requests.push(req);
    }

    if(requests.length === 0){
      alert("No change is made")
      return
    }

    try {
      const results = await Promise.all(requests);
      const allSuccessful = results.every(
        (res) => res.status >= 200 && res.status < 300,
      );
      if (allSuccessful) {
        alert("Update successful!");
        toggleEdit(false);
        window.location.href = `/movie/${film_id}`;
      } else {
        alert("Update failed. Check console for details.");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  }

  return (
    <div className="fixed inset-0 z-9999 flex justify-center items-center bg-black/80">
      <div className="bg-[#292929] p-3 flex flex-col gap-3 items-center w-[70%] 2xl:w-[30%]  max-h-[70%] overflow-y-auto">
        <h2 className="font-bold text-xl">Edit Film Info</h2>
        <div className="flex gap-3">
          <button
            className="bg-[#ab76f5]  text-sm  font-semibold p-1 rounded-md cursor-pointer"
            onClick={handleChangeSubmit}
          >
            Submit
          </button>
          <button
            className="bg-red-400  text-sm  font-semibold p-1 rounded-md cursor-pointer"
            onClick={() => toggleEdit(false)}
          >
            Cancel
          </button>
        </div>

        <Input
          id="title"
          labelText="Title"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleUpdate("title", e.target.value)
          }
          inputValue={filmForm.title}
          constraints={getConstraints("title", filmForm.title)}
          allConstraintsGood={checkIfAllGood("title")}
        />
        <Input
          id="original_title"
          labelText="Original Title"
          onChange={(e) => handleUpdate("original_title", e.target.value)}
          inputValue={filmForm.original_title}
          constraints={getConstraints(
            "original_title",
            filmForm.original_title,
          )}
          allConstraintsGood={checkIfAllGood("original_title")}
        />

        <Input
          id="director"
          labelText="Director"
          onChange={(e) => handleUpdate("director", e.target.value)}
          inputValue={filmForm.director}
          constraints={getConstraints("director", filmForm.director)}
          allConstraintsGood={checkIfAllGood("director")}
        />

        <Input
          id="casts"
          labelText="Casts"
          onChange={(e) => handleUpdate("casts", e.target.value)}
          inputValue={filmForm.casts}
          constraints={getConstraints("casts", filmForm.casts)}
          allConstraintsGood={checkIfAllGood("casts")}
        />

        <Input
          id="runtime"
          labelText="Runtime (mins)"
          onChange={(e) => handleUpdate("runtime", e.target.value)}
          inputValue={String(filmForm.runtime)}
          constraints={getConstraints("runtime", filmForm.runtime)}
          allConstraintsGood={checkIfAllGood("runtime")}
        />

        <Input
          id="year"
          labelText="Year"
          onChange={(e) => handleUpdate("year", e.target.value)}
          inputValue={String(filmForm.year)}
          constraints={getConstraints("year", filmForm.year)}
          allConstraintsGood={checkIfAllGood("year")}
        />

        <Input
          id="countries"
          labelText="Countries"
          onChange={(e) => handleUpdate("countries", e.target.value)}
          inputValue={filmForm.countries}
          constraints={getConstraints("countries", filmForm.countries)}
          allConstraintsGood={checkIfAllGood("countries")}
        />

        <Input
          id="languages"
          labelText="Languages"
          onChange={(e) => handleUpdate("languages", e.target.value)}
          inputValue={filmForm.languages}
          constraints={getConstraints("languages", filmForm.languages)}
          allConstraintsGood={checkIfAllGood("languages")}
        />

        <Input
          id="poster"
          labelText="Poster URL"
          onChange={(e) => handleUpdate("poster", e.target.value)}
          inputValue={filmForm.poster}
          constraints={getConstraints("poster", filmForm.poster)}
          allConstraintsGood={checkIfAllGood("poster")}
        />

        <Input
          id="backdrop"
          labelText="Backdrop URL"
          onChange={(e) => handleUpdate("backdrop", e.target.value)}
          inputValue={filmForm.backdrop}
          constraints={getConstraints("backdrop", filmForm.backdrop)}
          allConstraintsGood={checkIfAllGood("backdrop")}
        />

        <TextArea
          id="plot"
          labelText="Plot Summary"
          onChange={(e) => handleUpdate("plot", e.target.value)}
          inputValue={filmForm.plot}
          constraints={getConstraints("plot", filmForm.plot)}
          allConstraintsGood={checkIfAllGood("plot")}
        />
        <GenreLabels genres={allGenres} setGenres={setAllGenres} />
      </div>
    </div>
  );
}
