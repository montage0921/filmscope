import Input from "../../Auth/Input";
import type { DetailedFilmInfo } from "../../types";
import { useBackdropField } from "./hooks/useBackdropField";
import { useCastsField } from "./hooks/useCastsField";
import { useCountriesField } from "./hooks/useCountriesField";
import { useDirectorField } from "./hooks/useDirectorField";
import { useLanguagesField } from "./hooks/useLanguagesField";
import { useOriginalTitleField } from "./hooks/useOriginalTitle";
import { usePlotField } from "./hooks/usePlotField";
import { usePosterField } from "./hooks/usePosterField";
import { useRuntimeField } from "./hooks/useRuntimeField";
import { useTitleField } from "./hooks/useTitleField";
import { useYearField } from "./hooks/useYearField";

type EditOverLayProps = {
  filmInfo: DetailedFilmInfo | null;
};

export default function EditOverlay({ filmInfo }: EditOverLayProps) {
  const { title, titleConstraints, allTitleConstraintsGood, handleTitle } =
    useTitleField(filmInfo?.title || "");
  const {
    originalTitle,
    originalTitleConstraints,
    allOriginalTitleConstraintsGood,
    handleOriginalTitle,
  } = useOriginalTitleField(filmInfo?.original_title || "");
  const {
    director,
    directorConstraints,
    allDirectorConstraintsGood,
    handleDirector,
  } = useDirectorField(filmInfo?.director || "");
  const { casts, castsConstraints, allCastsConstraintsGood, handleCasts } =
    useCastsField(filmInfo?.casts || "");
  const {
    runtime,
    runtimeConstraints,
    allRuntimeConstraintsGood,
    handleRuntime,
  } = useRuntimeField(filmInfo?.runtime?.toString() || "");
  const { year, yearConstraints, allYearConstraintsGood, handleYear } =
    useYearField(filmInfo?.year?.toString() || "");
  const {
    countries,
    countriesConstraints,
    allCountriesConstraintsGood,
    handleCountries,
  } = useCountriesField(filmInfo?.countries || "");
  const {
    languages,
    languagesConstraints,
    allLanguagesConstraintsGood,
    handleLanguages,
  } = useLanguagesField(filmInfo?.languages || "");
  const { poster, posterConstraints, allPosterConstraintsGood, handlePoster } =
    usePosterField(filmInfo?.poster || "");
  const {
    backdrop,
    backdropConstraints,
    allBackdropConstraintsGood,
    handleBackdrop,
  } = useBackdropField(filmInfo?.backdrop || "");
  const { plot, plotConstraints, allPlotConstraintsGood, handlePlot } =
    usePlotField(filmInfo?.plot || "");

  return (
    <div className="fixed inset-0 z-30 flex justify-center items-center bg-black/80">
      <div className="bg-[#292929] p-3 flex flex-col items-center min-w-[80%] 2xl:min-w-[30%]">
        <h2 className="font-bold text-xl">Edit Film Info</h2>
        <div className="flex flex-col lg:flex-row gap-3 mb-1">
          <Input
            id={"title"}
            labelText="Title"
            onChange={handleTitle}
            inputValue={title}
            constraints={titleConstraints}
            allConstraintsGood={allTitleConstraintsGood}
          />
          <Input
            id={"originalTitle"}
            labelText="Original Title"
            onChange={handleOriginalTitle}
            inputValue={originalTitle}
            constraints={originalTitleConstraints}
            allConstraintsGood={allOriginalTitleConstraintsGood}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-3 mb-1">
          <Input
            id={"director"}
            labelText="Director"
            onChange={handleDirector}
            inputValue={director}
            constraints={directorConstraints}
            allConstraintsGood={allDirectorConstraintsGood}
          />
          <Input
            id={"casts"}
            labelText="Casts"
            onChange={handleCasts}
            inputValue={casts}
            constraints={castsConstraints}
            allConstraintsGood={allCastsConstraintsGood}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-3 mb-1">
          <Input
            id={"runtime"}
            labelText="Runtime (mins)"
            onChange={handleRuntime}
            inputValue={runtime}
            constraints={runtimeConstraints}
            allConstraintsGood={allRuntimeConstraintsGood}
          />
          <Input
            id={"year"}
            labelText="Year"
            onChange={handleYear}
            inputValue={year}
            constraints={yearConstraints}
            allConstraintsGood={allYearConstraintsGood}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-3 mb-1">
          <Input
            id={"countries"}
            labelText="Countries"
            onChange={handleCountries}
            inputValue={countries}
            constraints={countriesConstraints}
            allConstraintsGood={allCountriesConstraintsGood}
          />
          <Input
            id={"languages"}
            labelText="Languages"
            onChange={handleLanguages}
            inputValue={languages}
            constraints={languagesConstraints}
            allConstraintsGood={allLanguagesConstraintsGood}
          />
        </div>
        <Input
          id={"poster"}
          labelText="Poster URL"
          onChange={handlePoster}
          inputValue={poster}
          constraints={posterConstraints}
          allConstraintsGood={allPosterConstraintsGood}
        />
        <Input
          id={"backdrop"}
          labelText="Backdrop URL"
          onChange={handleBackdrop}
          inputValue={backdrop}
          constraints={backdropConstraints}
          allConstraintsGood={allBackdropConstraintsGood}
        />
        <Input
          id={"plot"}
          labelText="Plot Summary"
          onChange={handlePlot}
          inputValue={plot}
          constraints={plotConstraints}
          allConstraintsGood={allPlotConstraintsGood}
          inputType="textarea"
        />
      </div>
    </div>
  );
}
