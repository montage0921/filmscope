import type { EditShowDto, Screening, Theatre } from "../types";
import { useShowEditForm } from "./hooks/useShowEditForm";
import Input from "../Auth/Input";
import { useEffect, useState } from "react";
import EditScreening from "./EditScreening";
import { CirclePlus } from "lucide-react";
import axios from "axios";
import Button from "../Utility/Button";
import { useNavigate } from "react-router-dom";

type EditShowFormProps = {
  curShow: EditShowDto | null;
  curTab: string;
  film_id:string | undefined
};

export type EditShowBasicInfo = {
  show_id: number;
  show_name: string;
  qa_with: string;
  special: string;
};

export default function EditShowForm({ curShow, curTab, film_id }: EditShowFormProps) {
  const [screenings, setAllScreenings] = useState<Screening[] | undefined>(
    curShow?.screenings,
  );
  const [isAddingScreening, setIsAddingScreening] = useState(false);
  const [allTheatres, setAllTheatres] = useState<Theatre[]>([]);
  const [selectedTheatre, setSelectedTheatre] = useState<number | undefined>(
    curShow?.theatreDto.theatre_id,
  );

  const nav = useNavigate();

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

  async function handleDeleteShow() {
    const show_id = curShowBasicInfo.show_id;
    if (show_id === -1) {
      alert("This is not an existing show, please add as a new one");
      return;
    }

    const JWT = localStorage.getItem("token");
    if (!JWT) {
      alert("no JWT token");
      return;
    }
    const config = {
      headers: { Authorization: `Bearer ${JWT}` },
    };

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/shows/${show_id}`,
        config,
      );
      alert("The show is deleted");
      nav(-1);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete current show. Check console for details.");
    }
  }

  async function handleApplyChangeOrAddNew() {
    const show_id = curShowBasicInfo.show_id;

    const JWT = localStorage.getItem("token");
    if (!JWT) {
      alert("no JWT token");
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${JWT}` },
    };

    // 1. upload show's basic info
    if (curTab !== 'add' && show_id === -1) {
      alert("This is not an existing show, please add as a new one");
      return;
    }

    const uploadScreenings = screenings?.map((sc) => {
      const { screening_id, tempId, ...rest } = sc;
      return { ...rest, likedBy: [] };
    });

    const updatedShow = {
      showBasicUpdateDto: {
        show_name: curShowBasicInfo.show_name,
        special: curShowBasicInfo.special,
        qa_with: curShowBasicInfo.qa_with,
      },
      theatre_id: Number(selectedTheatre),
      screenings: uploadScreenings,
      film_id:Number(film_id)
    };

    try {
      if (curTab === "add") {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/shows/new-show`,
          updatedShow,
          config,
        );
        alert("New show is added!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/shows/${show_id}`,
          updatedShow,
          config,
        );
        alert("All changes saved successfully!");
      }

      nav(-1);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save changes. Check console for details.");
    }
  }


  return (
    <div className="w-[90%] lg:w-[40%] flex flex-col gap-3">
      <div className="flex gap-3">
        {curTab !== "add" && (
          <Button
            text="Delete Show"
            style={{
              backgroundColor: "#ef4444", // 红色
              fontSize: "14px",
            }}
            onClick={handleDeleteShow}
          />
        )}
        <Button
          text={curTab === "add" ? "Add Show" : "Apply Change"}
          style={{
            backgroundColor: "green",
            fontSize: "14px",
          }}
          onClick={handleApplyChangeOrAddNew}
        />
      </div>

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
          className="bg-transparent border border-gray-500 rounded-md px-2 py-1 
               text-[#ab76f5] outline-none focus:border-[#ab76f5] 
               cursor-pointer appearance-none"
        >
          {allTheatres.map((t) => (
            <option
              key={t.theatre_id}
              value={t.theatre_id}
              className="text-black"
            >
              {t.name}
            </option>
          ))}
        </select>
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
