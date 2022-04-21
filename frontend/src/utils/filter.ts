import { IPerson } from "../types/schema";

export const filterPeopleByFullName = (
  people: IPerson[],
  filterTerm: string
): IPerson[] =>
  people.filter((person) =>
    person.fullName.toLocaleLowerCase().includes(filterTerm.toLocaleLowerCase())
  );
