import type { DataStruct } from 'types';

export const getDateInfo = (data: DataStruct, date: string) => {
  return data.contributions.find(contrib => contrib.date === date);
}
