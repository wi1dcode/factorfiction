class AppError extends Error {
  constructor(message, code = 'APP_ERROR') {
    super(message)
    this.code = code
  }
}

const Errors = {
  ROOM_NOT_FOUND:       new AppError('Комната не найдена',                      'ROOM_NOT_FOUND'),
  ROOM_FULL:            new AppError('Комната заполнена',                        'ROOM_FULL'),
  ROOM_FINISHED:        new AppError('Игра уже закончена',                       'ROOM_FINISHED'),
  GAME_ALREADY_STARTED: new AppError('Игра уже началась',                        'GAME_ALREADY_STARTED'),
  GAME_NOT_STARTED:     new AppError('Игра не начата',                           'GAME_NOT_STARTED'),
  NOT_CREATOR:          new AppError('Только создатель может это сделать',       'NOT_CREATOR'),
  NOT_ENOUGH_PLAYERS:   new AppError('Нужно минимум 2 игрока',                   'NOT_ENOUGH_PLAYERS'),
  ALREADY_SUBMITTED:    new AppError('Ты уже отправил истории',                  'ALREADY_SUBMITTED'),
  INVALID_STORIES:      new AppError('Нужна ровно 1 правда и 1 ложь',           'INVALID_STORIES'),
  STORY_NOT_FOUND:      new AppError('История не найдена',                       'STORY_NOT_FOUND'),
  ALREADY_VOTED:        new AppError('Ты уже проголосовал',                      'ALREADY_VOTED'),
  CANNOT_VOTE_OWN:      new AppError('Нельзя голосовать за свои истории',        'CANNOT_VOTE_OWN'),
  INVALID_NICKNAME:     new AppError('Никнейм обязателен',                       'INVALID_NICKNAME'),
  VOTING_NOT_ACTIVE:    new AppError('Голосование сейчас не идёт',               'VOTING_NOT_ACTIVE'),
  WRITING_NOT_ACTIVE:   new AppError('Фаза написания не активна',                'WRITING_NOT_ACTIVE'),
}

module.exports = { AppError, Errors }
