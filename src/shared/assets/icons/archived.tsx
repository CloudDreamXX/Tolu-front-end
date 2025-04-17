export default (props?: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="23"
      viewBox="0 0 22 23"
      fill="none"
      {...props}
    >
      <path
        d="M1 11.5C1 6.786 1 4.429 2.464 2.964C3.93 1.5 6.286 1.5 11 1.5C15.714 1.5 18.071 1.5 19.535 2.964C21 4.43 21 6.786 21 11.5"
        stroke="black"
        strokeWidth="2"
      />
      <path
        d="M1 13.5C1 10.7 1 9.3 1.545 8.23C2.02436 7.28923 2.78923 6.52436 3.73 6.045C4.8 5.5 6.2 5.5 9 5.5H13C15.8 5.5 17.2 5.5 18.27 6.045C19.2108 6.52436 19.9756 7.28923 20.455 8.23C21 9.3 21 10.7 21 13.5C21 16.3 21 17.7 20.455 18.77C19.9756 19.7108 19.2108 20.4756 18.27 20.955C17.2 21.5 15.8 21.5 13 21.5H9C6.2 21.5 4.8 21.5 3.73 20.955C2.78923 20.4756 2.02436 19.7108 1.545 18.77C1 17.7 1 16.3 1 13.5Z"
        stroke="black"
        strokeWidth="2"
      />
      <path
        d="M11 10.5V16.5M11 16.5L13.5 14M11 16.5L8.5 14"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
