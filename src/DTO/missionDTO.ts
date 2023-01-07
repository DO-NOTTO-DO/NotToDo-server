import { ActionNameDTO } from './actionDTO';

export interface DailyMissionDTO {
  id: number;
  title: string | null;
  situation: string | undefined;
  completionStatus: string;
  goal: string | null;
  actions: ActionNameDTO[];
}
export interface SituationStatDTO {
  id?: number;
  count: string | null | number;
  name: string;
  missions?: NotTodoStatDTO[];
}

export interface NotTodoStatDTO {
  id?: number;
  count: string | null | number;
  title: string;
}

export interface MissionCreateDTO {
  title: string;
  situation: string;
  actions: string[];
  goal: string;
  actionDate: string;
}
