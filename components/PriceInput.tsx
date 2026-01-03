import InputField from './InputField';

type Props = {
  value: number | '';
  onChange: (value: number) => void;
  min?: number;
};

const PriceInput = ({ value, onChange, min = 0 }: Props) => {
  return (
    <InputField
      label='Price (USD)'
      type='number'
      min={min}
      // step={step}
      value={value}
      onChange={e => onChange(Number(e))}
      placeholder='1200'
      required
    />
  );
};

export default PriceInput;
