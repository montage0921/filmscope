import type { CSSProperties } from "react";

type ButtonProps = {
  text: string;
  style?: CSSProperties;
  onClick?: () => void;
};

export default function Button({ text, style, onClick }: ButtonProps) {
  const defaultStyle: CSSProperties = {
    padding: "5px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
    fontWeight: "bold",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ab76f5",
    color: "white",
    ...style, // passing customized style to overwrite default value
  };

  return (
    <button style={defaultStyle} onClick={onClick} className="w-[50%] lg:w-[40%]">
      {text}
    </button>
  );
}