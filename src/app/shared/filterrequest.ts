import {CriteriaRequest} from './criteriarequest';

export interface FilterRequest {
  name: string;
  criteriaRequests: CriteriaRequest[];
}
