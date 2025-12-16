import InputField from "./InputField";

type Props = {
  value: number | "";
  onChange: (value: number) => void;
};

const PriceInput = ({ value, onChange }: Props) => {
  return (
    <InputField
      label="Price (USD)"
      type="number"
      min={0}
      step="50"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder="1200"
      required
    />
  );
};

export default PriceInput;
