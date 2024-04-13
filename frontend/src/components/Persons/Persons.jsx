import Person from "./Person/Person";

const Persons = ({ filteredPersons, onDeleteEntry }) => {
  return (
    <div>
      {filteredPersons.map((person) => (
        <Person
          key={person.name}
          person={person}
          onDeleteEntry={onDeleteEntry}
        />
      ))}
    </div>
  );
};

export default Persons;
