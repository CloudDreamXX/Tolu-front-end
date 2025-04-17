export default (props?: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <rect
        x="0.4"
        y="0.4"
        width="15.2"
        height="15.2"
        rx="7.6"
        stroke="black"
        strokeWidth="0.8"
      />
      <path
        d="M8 8.5C9.38071 8.5 10.5 7.38071 10.5 6C10.5 4.61929 9.38071 3.5 8 3.5C6.61929 3.5 5.5 4.61929 5.5 6C5.5 7.38071 6.61929 8.5 8 8.5Z"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.5C12 11.4391 11.5786 10.4217 10.8284 9.67157C10.0783 8.92143 9.06087 8.5 8 8.5C6.93913 8.5 5.92172 8.92143 5.17157 9.67157C4.42143 10.4217 4 11.4391 4 12.5"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
