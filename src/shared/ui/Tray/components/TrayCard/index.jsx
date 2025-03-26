function TrayCard({ title, topic, resource }) {
	return (
		<div className="bg-white p-4 rounded-lg w-full flex flex-col gap-4">
			<h2 className="text-base font-bold">{title}</h2>
			<div className="flex flex-col gap-2.5">
				<span className="text-sm font-medium">{topic}</span>
				<span className="text-base font-semibold">{resource}</span>
			</div>
		</div>
	);
}

export default TrayCard;