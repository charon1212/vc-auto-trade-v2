import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StrategyBoxUpdate {

  @PrimaryGeneratedColumn('increment')
  id: number = 0;
  @Column()
  strategyId: string = '';
  @Column()
  paramJson: string = '';
  @Column()
  contextJson: string = '';
  @Column()
  delete: boolean = false;

  constructor() { }

}
