import React from "react";
import styles from "./checkbox.module.scss";

type Props = {
 id: string;
 children?: React.ReactNode;
 className?: string;
 isChecked?: boolean;
 isDefaultChecked?: boolean;
 onChange?: (event: unknown) => void;
};

const Checkbox = React.forwardRef<HTMLInputElement, Props>(
 ({ id, children, className, isChecked, isDefaultChecked, onChange }, ref) => {
  return (
   <label htmlFor={id} className={`${styles.wrap} ${className}`}>
    <input
     ref={ref}
     checked={isChecked}
     defaultChecked={isDefaultChecked}
     type="checkbox"
     id={id}
     onChange={onChange}
    />
    {children}
   </label>
  );
 }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
