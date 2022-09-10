import { EntityTarget } from 'typeorm/common/EntityTarget';
import { ObjectLiteral } from "typeorm";
import { getTypeormRepository } from '../../src/lib/typeorm/typeorm';

export const clearDbData = async <Entity extends ObjectLiteral>(...entities: EntityTarget<Entity>[]) => {
  return Promise.all(entities.map((Entity) => getTypeormRepository(Entity).delete({})));
};
