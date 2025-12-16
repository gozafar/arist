import { InputHTMLAttributes } from "react";
import clsx from "clsx";

const InputField = ({ label, className, ...rest }: { label: string } & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <label className="block text-sm">
      <span className="mb-2 block text-white">{label}</span>
      <input
        {...rest}
        className={clsx(
          "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60",
          className
        )}
      />
    </label>
  );
};

export default InputField;
