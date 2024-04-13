import axios from "axios";

const baseUrl = "/api/persons";

const getAll = async () => {
  const response = await axios.get(baseUrl);

  if (response.status === 200) {
    return response.data;
  } else {
    throw Error(response.statusText);
  }
};

const createPerson = async (name, number) => {
  const person = { name, number };
  const response = await axios.post(baseUrl, person);

  if (response.status === 201) {
    return response.data;
  } else {
    throw Error(response.statusText);
  }
};

const deletePerson = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`);

  if (response.status === 204) {
    return response.data;
  } else {
    throw Error(response.statusText);
  }
};

const updatePerson = async (person) => {
  const response = await axios.put(`${baseUrl}/${person.id}`, person);

  if (response.status === 200) {
    return response.data;
  } else {
    throw Error(response.statusText);
  }
};

export default {
  getAll,
  createPerson,
  deletePerson,
  updatePerson,
};
