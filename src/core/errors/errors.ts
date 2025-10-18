export class NotFoundShortenUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundShortenUrlError';
  }
}

export class InvalidUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUrlError';
  }
}

export class LackOfUniqueShortenUrlKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LackOfUniqueShortenUrlKeyError';
  }
}