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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.7084 7.2924C14.3179 6.90188 13.6848 6.90188 13.2942 7.2924L10.0013 10.5853L6.70845 7.2924C6.31793 6.90188 5.68476 6.90188 5.29424 7.2924C4.90371 7.68293 4.90371 8.31609 5.29424 8.70662L9.29424 12.7066C9.68476 13.0971 10.3179 13.0971 10.7084 12.7066L14.7084 8.70662C15.099 8.31609 15.099 7.68293 14.7084 7.2924Z"
        fill="currentColor"
      />
    </svg>
  );
};
