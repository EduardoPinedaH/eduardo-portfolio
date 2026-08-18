import { forwardRef } from "react";

const Bracket = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function Bracket({ className = "", children, ...rest }, ref) {
    return (
      <div ref={ref} className={`bracketed ${className}`} {...rest}>
        {children}
        <span className="bl" />
        <span className="br" />
      </div>
    );
  },
);

export default Bracket;
