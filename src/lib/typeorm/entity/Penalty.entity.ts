import { Column, Entity, PrimaryColumn } from "typeorm";
import { DR } from "../../../common/typescript/deepreadonly";
import { Penalty as DomainPenalty, PenaltyColor } from "../../../domain/PenaltyCounter/Penalty";

@Entity()
export class Penalty {

  @PrimaryColumn()
  strategyBoxId: string = '';
  @PrimaryColumn({ type: "bigint" })
  timestamp: string = '0';
  @PrimaryColumn()
  color: string = '';
  @Column()
  reason: string = '';
  @Column()
  point: number = 0;

  constructor(penalty?: DR<DomainPenalty>) {
    if (penalty) {
      this.strategyBoxId = penalty.strategyBoxId;
      this.timestamp = `${penalty.timestamp}`;
      this.color = penalty.color;
      this.reason = penalty.reason;
      this.point = penalty.point;
    }
  }

  decode(): DomainPenalty {
    return {
      strategyBoxId: this.strategyBoxId,
      timestamp: +this.timestamp,
      color: this.color as PenaltyColor,
      reason: this.reason,
      point: this.point,
    };
  }

}
