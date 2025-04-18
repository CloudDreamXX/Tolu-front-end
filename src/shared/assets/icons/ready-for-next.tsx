export default (props?: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M10 19.375C15.1777 19.375 19.375 15.1777 19.375 10C19.375 4.82233 15.1777 0.625 10 0.625C4.82233 0.625 0.625 4.82233 0.625 10C0.625 15.1777 4.82233 19.375 10 19.375Z"
        fill="#4BD37B"
      />
      <path
        d="M14.375 4.375L7.8125 11.125L5.625 8.875L3.4375 11.125L7.8125 15.625L16.5625 6.625L14.375 4.375Z"
        fill="white"
      />
    </svg>
  );
};
