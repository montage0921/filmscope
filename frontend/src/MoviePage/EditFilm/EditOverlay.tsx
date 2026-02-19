import Input from "../../Auth/Input";
import type { BasicFilmInfo, DetailedFilmInfo } from "../../types";
import TextArea from "../../Utility/TextArea";
import { useEditForm } from "./hooks/useFilmEditForm";


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

  return (
    <div className="fixed inset-0 z-9999 flex justify-center items-center bg-black/80">
      <div className="bg-[#292929] p-3 flex flex-col gap-3 items-center min-w-[70%] 2xl:min-w-[30%] max-h-[70%] overflow-y-auto">
        <h2 className="font-bold text-xl">Edit Film Info</h2>
        <div className="flex gap-3">
          <button className="bg-[#ab76f5]  text-sm  font-semibold p-1 rounded-md cursor-pointer">
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
            handleChange("title", e.target.value)
          }
          inputValue={filmForm.title}
          constraints={getConstraints("title", filmForm.title)}
          allConstraintsGood={checkIfAllGood("title")}
        />
        <Input
          id="original_title"
          labelText="Original Title"
          onChange={(e) => handleChange("original_title", e.target.value)}
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
          onChange={(e) => handleChange("director", e.target.value)}
          inputValue={filmForm.director}
          constraints={getConstraints("director", filmForm.director)}
          allConstraintsGood={checkIfAllGood("director")}
        />

        <Input
          id="casts"
          labelText="Casts"
          onChange={(e) => handleChange("casts", e.target.value)}
          inputValue={filmForm.casts}
          constraints={getConstraints("casts", filmForm.casts)}
          allConstraintsGood={checkIfAllGood("casts")}
        />

        <Input
          id="runtime"
          labelText="Runtime (mins)"
          onChange={(e) => handleChange("runtime", e.target.value)}
          inputValue={String(filmForm.runtime)}
          constraints={getConstraints("runtime", filmForm.runtime)}
          allConstraintsGood={checkIfAllGood("runtime")}
        />

        <Input
          id="year"
          labelText="Year"
          onChange={(e) => handleChange("year", e.target.value)}
          inputValue={String(filmForm.year)}
          constraints={getConstraints("year", filmForm.year)}
          allConstraintsGood={checkIfAllGood("year")}
        />

        <Input
          id="countries"
          labelText="Countries"
          onChange={(e) => handleChange("countries", e.target.value)}
          inputValue={filmForm.countries}
          constraints={getConstraints("countries", filmForm.countries)}
          allConstraintsGood={checkIfAllGood("countries")}
        />

        <Input
          id="languages"
          labelText="Languages"
          onChange={(e) => handleChange("languages", e.target.value)}
          inputValue={filmForm.languages}
          constraints={getConstraints("languages", filmForm.languages)}
          allConstraintsGood={checkIfAllGood("languages")}
        />

        <Input
          id="poster"
          labelText="Poster URL"
          onChange={(e) => handleChange("poster", e.target.value)}
          inputValue={filmForm.poster}
          constraints={getConstraints("poster", filmForm.poster)}
          allConstraintsGood={checkIfAllGood("poster")}
        />

        <Input
          id="backdrop"
          labelText="Backdrop URL"
          onChange={(e) => handleChange("backdrop", e.target.value)}
          inputValue={filmForm.backdrop}
          constraints={getConstraints("backdrop", filmForm.backdrop)}
          allConstraintsGood={checkIfAllGood("backdrop")}
        />

        <TextArea
          id="plot"
          labelText="Plot Summary"
          onChange={(e) => handleChange("plot", e.target.value)}
          inputValue={filmForm.plot}
          constraints={getConstraints("plot", filmForm.plot)}
          allConstraintsGood={checkIfAllGood("plot")}
        />
      </div>
    </div>
  );
}
