// 상황 객체 DTO
export interface SituationDTO {
    name?: string;
}

// 상황조회 응답 DTO
export interface SituationResponseDTO {
    recommends: SituationDTO[];
    recents: SituationDTO[];
}
