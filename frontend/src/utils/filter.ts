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
    (filterDate.year === undefined || (person.dateOfDeath && filterDate.year === person.dateOfDeath.year)) && (filterDate.month === undefined || person.dateOfDeath && (filterDate.month === person.dateOfDeath.month)) && (filterDate.day === undefined || person.dateOfDeath && (filterDate.day === person.dateOfDeath.day))
  );

// ignores year for comparison
export const filterPeopleBetweenTwoDeathDates = (
  people: IPerson[],
  filterStartDate: Date | undefined,
  filterEndDate: Date | undefined
): IPerson[] =>
  people.filter((person) => {
    if (!filterStartDate || !filterEndDate) {
      return true; // if no filter provided, display person
    }
    // set arbitrary year for comparison
    filterStartDate.setFullYear(1900);
    filterEndDate.setFullYear(1900);
    // set hours, minutes, second and miliseconds to 0
    filterStartDate.setHours(0, 0, 0, 0);
    filterEndDate.setHours(0, 0, 0, 0);

    if (!person.dateOfDeath) {
      return false; // do not display person if no death date
    }

    if (person.dateOfDeath.month) {
      // if person's month and day are available, filter accordingly
      if (person.dateOfDeath.day) {
        const personDeathDate = new Date(1900, person.dateOfDeath.month - 1, person.dateOfDeath.day, 0, 0, 0, 0);
        return (personDeathDate >= filterStartDate && personDeathDate <= filterEndDate);
      }
      // otherwise, only person's month is available
      return (person.dateOfDeath.month >= filterStartDate.getMonth() && person.dateOfDeath.month <= filterEndDate.getMonth());
    }
  }
  );