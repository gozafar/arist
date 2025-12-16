import { TextareaHTMLAttributes } from "react";
import clsx from "clsx";

const TextArea = ({ label, className, ...rest }: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <label className="block text-sm">
      <span className="mb-2 block text-white">{label}</span>
      <textarea
        {...rest}
        className={clsx(
          "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60",
          className
        )}
      />
    </label>
  );
};

export default TextArea;
