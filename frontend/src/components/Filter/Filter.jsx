const Filter = ({ onChange, search }) => {
  return (
    <div>
      filter shown with
      <input onChange={onChange} value={search} />
    </div>
  );
};

export default Filter;
