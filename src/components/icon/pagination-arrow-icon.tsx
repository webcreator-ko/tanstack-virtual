type Props = {
 direction?: "left" | "right";
};

const PaginationArrowIcon = ({ direction = "right" }: Props) => {
 return (
  <>
   <svg
    xmlns="http://www.w3.org/2000/svg"
    width="35"
    height="35"
    viewBox="0 0 35 35"
    fill="none"
    style={{
     transform: direction === "left" ? "rotate(180deg)" : "none",
     transition: "transform 0.2s",
    }}
   >
    <circle cx="17.5" cy="17.5" r="17" stroke="currentColor" />
    <path
     d="M11.5 16.75C11.0858 16.75 10.75 17.0858 10.75 17.5C10.75 17.9142 11.0858 18.25 11.5 18.25L11.5 16.75ZM24.0303 18.0303C24.3232 17.7374 24.3232 17.2626 24.0303 16.9697L19.2574 12.1967C18.9645 11.9038 18.4896 11.9038 18.1967 12.1967C17.9038 12.4896 17.9038 12.9645 18.1967 13.2574L22.4393 17.5L18.1967 21.7426C17.9038 22.0355 17.9038 22.5104 18.1967 22.8033C18.4896 23.0962 18.9645 23.0962 19.2574 22.8033L24.0303 18.0303ZM11.5 18.25L23.5 18.25L23.5 16.75L11.5 16.75L11.5 18.25Z"
     fill="currentColor"
    />
   </svg>
  </>
 );
};

export default PaginationArrowIcon;
