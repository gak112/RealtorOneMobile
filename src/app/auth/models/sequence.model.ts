export interface ISequence {
  currentSequence: number;
  updatedAt: any; // Firestore timestamp
}

export interface IUserSequence extends ISequence {
  // Extends base sequence for user-specific sequence
}
