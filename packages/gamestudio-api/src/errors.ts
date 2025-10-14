export class GameStudioError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status?: number
  ) {
    super(message);
    this.name = "GameStudioError";
  }
}

export class PlayerUnauthorizedError extends GameStudioError {
  constructor(message = "Player session missing or invalid") {
    super(message, "PLAYER_UNAUTHORIZED", 401);
    this.name = "PlayerUnauthorizedError";
  }
}

export class InsufficientBalanceError extends GameStudioError {
  constructor(message = "Insufficient balance") {
    super(message, "INSUFFICIENT_BALANCE", 403);
    this.name = "InsufficientBalanceError";
  }
}

export class UnsupportedGameError extends GameStudioError {
  constructor(message = "Game not available for this studio") {
    super(message, "UNSUPPORTED_GAME", 404);
    this.name = "UnsupportedGameError";
  }
}
