function Badge({ value }) {
    return (
        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
            {value}
        </span>
    );
}

export default Badge;