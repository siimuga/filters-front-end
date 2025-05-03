import {Condition} from './condition';
import {Type} from './type';

export interface CriteriaRequest {
  type: string;
  condition: string;
  value: string;
  types: Type[];
  conditions: Condition[];
}
