const Person = ({ person, onDeleteEntry }) => {
  return (
    <div>
      {`${person.name} ${person.number} `}
      <button type="button" onClick={() => onDeleteEntry(person.id)}>
        delete
      </button>
    </div>
  );
};

export default Person;
