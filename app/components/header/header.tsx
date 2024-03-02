interface Props {
  room?: string;
}

export function Header({ room }: Props) {
  return (
    <div className="h-12 bg-teal-600 flex items-center justify-center sticky top-0 z-50">
      <h2 className="text-center italic font-extrabold pb-0">
        {room || "Murdr.Club"}
      </h2>
    </div>
  );
}
