import { ReactNode } from "react";
import Button from "./Button";

const SubmitButton = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Button type="submit" className={className}>
      {children}
    </Button>
  );
};

export default SubmitButton;
