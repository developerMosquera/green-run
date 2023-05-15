export interface IPostBets {
  userBets: IBets[];
}

export class IBets {
  amount: number;
  user_id: number;
  bet_id: number;
}
