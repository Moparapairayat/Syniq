export interface InputValidatorOptions {
  readonly strictMode?: boolean
}

/**
 * Performs validation checks on the player's memory sequence inputs.
 */
export class InputValidator {
  readonly #strictMode: boolean

  public constructor(options: InputValidatorOptions = {}) {
    this.#strictMode = options.strictMode ?? false
  }

  public get strictMode(): boolean {
    return this.#strictMode
  }

  /**
   * Validates if the player's full input sequence matches the target sequence.
   */
  public validateSequence<T>(
    playerInput: ReadonlyArray<T>,
    targetSequence: ReadonlyArray<T>,
  ): boolean {
    if (playerInput.length > targetSequence.length) {
      return false
    }

    for (let i = 0; i < playerInput.length; i++) {
      if (playerInput[i] !== targetSequence[i]) {
        return false
      }
    }
    return true
  }

  /**
   * Validates a single input step at a specific index.
   */
  public validateStep<T>(
    input: T,
    targetSequence: ReadonlyArray<T>,
    index: number,
  ): boolean {
    if (index < 0 || index >= targetSequence.length) {
      return false
    }
    return input === targetSequence[index]
  }
}
