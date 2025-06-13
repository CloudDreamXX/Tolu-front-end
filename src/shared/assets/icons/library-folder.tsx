export default (props?: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      {...props}
    >
      <rect
        y="0.5"
        width="24"
        height="24"
        rx="8"
        fill="#AAC6EC"
        fillOpacity="0.4"
      />
      <path
        d="M16.6667 9.00065H12L10.8333 7.83398H7.33333C6.69166 7.83398 6.1725 8.35898 6.1725 9.00065L6.16666 16.0007C6.16666 16.6423 6.69166 17.1673 7.33333 17.1673H16.6667C17.3083 17.1673 17.8333 16.6423 17.8333 16.0007V10.1673C17.8333 9.52565 17.3083 9.00065 16.6667 9.00065ZM16.6667 16.0007H7.33333V10.1673H16.6667V16.0007Z"
        fill="#1C63DB"
      />
    </svg>
  );
};
