export const addChild = (data: any, parentId: string, child: any) => {
  const newPerson = { ...child };

  const persons = [...data.persons, newPerson];

  const parent = persons.find(p => p.id === parentId);
  parent.children.push(newPerson.id);

  newPerson.parents.push(parentId);

  return { persons };
};