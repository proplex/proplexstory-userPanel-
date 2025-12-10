interface ICrewMember {
    name: string;
    previous_track_record: string;
    amount_spent: string;
  }
  
  const CrewDetailsCard = ({ data }: { data: ICrewMember[] }) => {
    return (
      <div className=" space-y-4">
        {data.map((member, index) => (
          <div key={index} className=" p-1 rounded">
            <h3 className="font-semibold text-lg">{member.name}</h3>
        
            <p className="text-xs text-gray-700">
              Previous Track Record:
                 {member.previous_track_record}
            </p>
          </div>
        ))}
      </div>
    );
  };
  
  export default CrewDetailsCard;
  