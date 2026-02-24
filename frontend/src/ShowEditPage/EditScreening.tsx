import type { Dispatch, SetStateAction } from "react";
import Input from "../Auth/Input";
import type { Screening } from "../types";
import { useScreenEditForm } from "./hooks/useScreenEditForm";
import Button from "../Utility/Button";

type EditScreeningProps = {
  screening: Screening | undefined;
  onChange: Dispatch<SetStateAction<Screening[] | undefined>>;
  isAdding?: boolean;
  setIsAdding?: Dispatch<SetStateAction<boolean>>;
};

export default function EditScreening({
  screening,
  onChange,
  isAdding = false,
  setIsAdding,
}: EditScreeningProps) {
  const {
    screeningForChange,
    handleChange,
    checkAllConstraintsGood,
    getConstraints,
  } = useScreenEditForm(
    screening || {
      screening_id: 0,
      start_date: "",
      start_time: "",
      ticket_url: "",
    },
    onChange,
    isAdding
  );

  return (
    <div className="flex flex-col lg:flex-row lg:items-end gap-2 w-full mb-4 border-b border-gray-800 pb-4 lg:pb-2">
      <div>
        <Input
          id="start_date"
          labelText="Date"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("start_date", e.target.value)
          }
          inputValue={screeningForChange.start_date}
          constraints={getConstraints(
            "start_date",
            screeningForChange.start_date,
          )}
          allConstraintsGood={checkAllConstraintsGood("start_date")}
          inputType="date"
        />
      </div>
      <div>
        <Input
          id="start_time"
          labelText="Time"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("start_time", e.target.value)
          }
          inputValue={screeningForChange.start_time}
          constraints={getConstraints(
            "start_time",
            screeningForChange.start_time,
          )}
          allConstraintsGood={checkAllConstraintsGood("start_time")}
          inputType="time"
        />
      </div>

      <Input
        id="ticket_url"
        labelText="Ticket URL"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("ticket_url", e.target.value)
        }
        inputValue={screeningForChange.ticket_url}
        constraints={getConstraints(
          "ticket_url",
          screeningForChange.ticket_url,
        )}
        allConstraintsGood={checkAllConstraintsGood("ticket_url")}
      />
      {isAdding ? (
        <div className="flex gap-3">
          <Button
            text="Save"
            style={{
              backgroundColor: "green",
              fontSize: "14px",
            }}
            onClick={() => console.log("Deleting...")}
          />
          <Button
            text="Cancel"
            style={{
              backgroundColor: "gray",
              fontSize: "14px",
            }}
            onClick={() => setIsAdding?.(false)}
          />
        </div>
      ) : (
        <Button
          text="Delete"
          style={{
            backgroundColor: "red",
            fontSize: "14px",
          }}
          onClick={() => console.log("Deleting...")}
        />
      )}
    </div>
  );
}
