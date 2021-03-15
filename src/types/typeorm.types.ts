import { registerEnumType } from 'type-graphql';

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

registerEnumType(OrderDirection, {
  name: 'OrderDirection',
  valuesConfig: {
    ASC: {
      description: 'Ascending direction'
    },
    DESC: {
      description: 'Descending direction'
    }
  }
});
