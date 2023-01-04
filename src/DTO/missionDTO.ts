import { ActionNameDTO } from "./actionDTO";

export interface DailyMissionDTO {
  id: number;
  title: string;
  completionStatus: string;
  goal: string;
  actions: ActionNameDTO[];
}