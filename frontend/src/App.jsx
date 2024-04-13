import { useEffect, useState } from "react";

import personService from "./services/persons";

import Filter from "./components/Filter/Filter";
import PersonForm from "./components/PersonForm/PersonForm";
import Persons from "./components/Persons/Persons";
import Notification from "./components/Notification/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newSearch, setNewSearch] = useState("");

  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const getPersons = async () => {
      try {
        const allPersons = await personService.getAll();
        setPersons(allPersons);
      } catch (err) {
        console.log(err);
        setErrorMsg(err.message);

        setTimeout(() => {
          setErrorMsg(null);
        }, 5000);
      }
    };
    getPersons();
  }, [errorMsg]);

  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);
  const handleSearchChange = (e) => setNewSearch(e.target.value);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (persons.some((person) => person.name === newName)) {
        const confirm = window.confirm(
          `${newName} is already added to the phonebook, replace the old number with new one?`
        );

        if (confirm) {
          const person = persons.find((person) => person.name === newName);
          const updatedPerson = await personService.updatePerson({
            ...person,
            number: newNumber,
          });

          setPersons((prev) =>
            prev.map((pervPerson) =>
              pervPerson.id === updatedPerson.id ? updatedPerson : pervPerson
            )
          );

          setSuccessMsg(`Updated ${person.name}'s number to ${newNumber}`);
          setTimeout(() => {
            setSuccessMsg(null);
          }, 5000);
        }
      } else {
        const newPerson = await personService.createPerson(newName, newNumber);
        setPersons((prev) => [...prev, newPerson]);

        setSuccessMsg(`Added ${newName}`);
        setTimeout(() => {
          setSuccessMsg(null);
        }, 5000);
      }
    } catch (err) {
      console.log(err);
      setErrorMsg(err.message);

      setTimeout(() => {
        setErrorMsg(null);
      }, 5000);
    }

    setNewName("");
    setNewNumber("");
    setNewSearch("");
  };

  const handleDeleteEntry = async (id) => {
    const person = persons.find((person) => person.id === id);
    if (!person) return;

    const confirm = window.confirm(`Delete ${person.name}`);
    if (!confirm) return;

    try {
      await personService.deletePerson(id);
      setPersons((prev) => prev.filter((pervPerson) => pervPerson.id !== id));

      setSuccessMsg(`Deleted ${person.name}`);
      setTimeout(() => {
        setSuccessMsg(null);
      }, 5000);
    } catch (err) {
      console.log(err);
      setErrorMsg(err.message);

      setTimeout(() => {
        setErrorMsg(null);
      }, 5000);
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(newSearch.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={errorMsg} type="error" />
      <Notification message={successMsg} type="success" />

      <Filter onChange={handleSearchChange} search={newSearch} />

      <h3>Add a new</h3>

      <PersonForm
        onFormSubmit={handleFormSubmit}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        name={newName}
        number={newNumber}
      />

      <h3>Numbers</h3>

      <Persons
        filteredPersons={filteredPersons}
        onDeleteEntry={handleDeleteEntry}
      />
    </div>
  );
};

export default App;
