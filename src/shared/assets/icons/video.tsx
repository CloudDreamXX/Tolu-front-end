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
        d="M14.8 13.2009L18.4561 15.6383C18.5088 15.6733 18.57 15.6935 18.6333 15.6965C18.6965 15.6995 18.7594 15.6853 18.8152 15.6554C18.871 15.6256 18.9177 15.5811 18.9502 15.5268C18.9828 15.4725 19 15.4104 19 15.3471V9.60987C19 9.54829 18.9838 9.48779 18.9529 9.43448C18.9221 9.38118 18.8777 9.33695 18.8243 9.30628C18.7709 9.2756 18.7104 9.25956 18.6488 9.25977C18.5872 9.25998 18.5268 9.27643 18.4736 9.30747L14.8 11.4509"
        stroke="#1C63DB"
        strokeWidth="1.05"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.4 8.30078H6.4C5.6268 8.30078 5 8.92758 5 9.70078V15.3008C5 16.074 5.6268 16.7008 6.4 16.7008H13.4C14.1732 16.7008 14.8 16.074 14.8 15.3008V9.70078C14.8 8.92758 14.1732 8.30078 13.4 8.30078Z"
        stroke="#1C63DB"
        strokeWidth="1.05"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
