const PersonForm = ({
  onFormSubmit,
  onNameChange,
  onNumberChange,
  name,
  number,
}) => {
  return (
    <form onSubmit={onFormSubmit}>
      <div>
        name: <input onChange={onNameChange} value={name} />
      </div>
      <div>
        number: <input onChange={onNumberChange} value={number} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
