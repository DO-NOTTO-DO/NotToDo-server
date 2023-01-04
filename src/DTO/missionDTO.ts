import { ActionNameDTO } from "./actionDTO";

export interface DailyMissionDTO {
  id: number;
  title: string | null;
  situation: string | undefined;
  completionStatus: string;
  goal: string | null;
  actions: ActionNameDTO[];
}