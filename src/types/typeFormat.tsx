export type problem_type ={
  ex_diff: boolean;
  diff: number;
  solver: number;
  contest_id: string;
  problem_name: string;
};
export type contest_type ={
  start_epoch: number;
  title: string;
};
export type submission_type={
  readonly execution_time: number | null;
  readonly point: number;
  readonly result: string;
  readonly problem_id: string;
  readonly user_id: string;
  readonly epoch_second: number;
  readonly contest_id: string;
  readonly id: number;
  readonly language: string;
  readonly length: number;
};
export type rate_type ={
  color: string;
  rating: number;
  status: string;
}
export type problem_disp_type ={
  rarity: string;
  solvers: number;
  date: string;
  problem: string;
  contest: string;
  lastAcDate: string;
  diff: number;
  contest_id: string;
  problem_id: string;
};