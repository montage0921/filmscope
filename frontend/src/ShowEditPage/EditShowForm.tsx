import type { EditShowDto, Screening, Theatre } from "../types";
import { useShowEditForm } from "./hooks/useShowEditForm";
import Input from "../Auth/Input";
import { useEffect, useState } from "react";
import EditScreening from "./EditScreening";
import { CirclePlus, Theater } from "lucide-react";
import axios from "axios";

type EditShowFormProps = {
  curShow: EditShowDto | null;
};

export type EditShowBasicInfo = {
  show_id: number;
  show_name: string;
  qa_with: string;
  special: string;
};

export default function EditShowForm({ curShow }: EditShowFormProps) {
  const [screenings, setAllScreenings] = useState<Screening[] | undefined>(
    curShow?.screenings,
  );
  const [isAddingScreening, setIsAddingScreening] = useState(false);
  const [allTheatres, setAllTheatres] = useState<Theatre[]>([]);
  const [selectedTheatre, setSelectedTheatre] = useState<number | undefined>(
    curShow?.theatreDto.theatre_id,
  );

  useEffect(() => {
    setAllScreenings(curShow?.screenings || []);
    setSelectedTheatre(curShow?.theatreDto.theatre_id);
  }, [curShow?.show_id]);

  useEffect(function () {
    async function getTheatres() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/theatres`,
        );
        setAllTheatres(res.data);
      } catch (error) {
        alert(error);
      }
    }

    getTheatres();
  }, []);

  const initialShowDto: EditShowBasicInfo = {
    show_id: curShow?.show_id || -1,
    show_name: curShow?.show_name || "",
    qa_with: curShow?.qa_with || "",
    special: curShow?.special || "",
  };

  const {
    curShowBasicInfo,
    handleChange,
    checkAllConstraintsGood,
    getConstraints,
  } = useShowEditForm(initialShowDto);

  return (
    <div>
      <Input
        id="show_name"
        labelText="Show Name"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("show_name", e.target.value)
        }
        inputValue={curShowBasicInfo.show_name}
        constraints={getConstraints("show_name", curShowBasicInfo.show_name)}
        allConstraintsGood={checkAllConstraintsGood("show_name")}
      />
      <Input
        id="qa_with"
        labelText="Q & A"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("qa_with", e.target.value)
        }
        inputValue={curShowBasicInfo.qa_with}
        constraints={getConstraints("qa_with", curShowBasicInfo.qa_with)}
        allConstraintsGood={checkAllConstraintsGood("qa_with")}
      />
      <Input
        id="special"
        labelText="Special"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("special", e.target.value)
        }
        inputValue={curShowBasicInfo.special}
        constraints={getConstraints("special", curShowBasicInfo.special)}
        allConstraintsGood={checkAllConstraintsGood("special")}
      />
      <div>
        <select
          value={selectedTheatre}
          onChange={(e) => setSelectedTheatre(Number(e.target.value))}
        >
          {allTheatres.map((t) => (
            <option value={t.theatre_id}>{t.name}</option>
          ))}
        </select>
        <div>{allTheatres.find(t=>t.theatre_id === selectedTheatre)?.name}</div>
      </div>

      <div>
        {screenings?.map((sc) => (
          <EditScreening
            key={sc.screening_id}
            screening={sc}
            onChange={setAllScreenings}
          />
        ))}
        {!isAddingScreening && (
          <button onClick={() => setIsAddingScreening(true)}>
            <CirclePlus />
          </button>
        )}
        {isAddingScreening && (
          <EditScreening
            screening={undefined}
            onChange={setAllScreenings}
            isAdding={true}
            setIsAdding={setIsAddingScreening}
          />
        )}
      </div>
    </div>
  );
}
