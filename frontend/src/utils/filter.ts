import { IPerson, IDate } from "../types/schema";

export const filterPeopleByFullName = (
  people: IPerson[],
  filterTerm: string
): IPerson[] =>
  people.filter((person) =>
    person.fullName.toLocaleLowerCase().includes(filterTerm.toLocaleLowerCase())
  );

// currently supports filtering by same month or day or year or a combination of each
export const filterPeopleByDeathDate = (
  people: IPerson[],
  filterDate: IDate
): IPerson[] =>
  people.filter((person) =>
    // eslint-disable-next-line
    (filterDate.year === undefined || filterDate.year === person.dateOfDeath!.year) && (filterDate.month === undefined || filterDate.month === person.dateOfDeath!.month) && (filterDate.day === undefined || filterDate.day === person.dateOfDeath!.day)
  );
