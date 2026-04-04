export const createPerson = (data: any) => ({
  id: crypto.randomUUID(),

  name: "",
  gender: "M",
  photo: "/images/default.jpeg",

  isMarried: false,
  spouse: [],

  parents: [],
  children: [],

  ...data,
});