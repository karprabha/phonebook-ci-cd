import mongoose from "mongoose";

const mongoURI = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

console.log("establshing mongoDB connection");

mongoose
  .connect(mongoURI)
  // eslint-disable-next-line no-unused-vars
  .then((_) => {
    console.log("successfully connected to mongoDB");
  })
  .catch((err) => {
    console.error("failed to make connection with mongoDB", err);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator(v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

export default Person;
