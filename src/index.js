import StringManipulator from '@eugeniouglov/string-manipulator';

/**
 * Normalizes and expands user-provided tags.
 *
 * Single source file. Rollup builds it into two formats:
 *   - dist/tags-normalizer.cjs  — for require() / CommonJS
 *   - dist/tags-normalizer.mjs  — for import / ES Module
 */
class TagsNormalizer {
  #sm;

  constructor() {
    this.#sm = new StringManipulator();
  }

  getHandledTags(initialTags) {
    let handledTags = this.#getNormalizedTags(initialTags);

    const additionalTags = this.#getAdditionalTags(handledTags);

    // Merge original + additional tags, deduplicate.
    // Do NOT re-run #getNormalizedTags here, because it splits by whitespace
    // and would break multi-word additional tags like "hello world".
    const allTags = [...handledTags, ...additionalTags];

    return [...new Set(allTags)];
  }

  #getNormalizedTags(tags) {
    if (Array.isArray(tags)) {
      tags = tags.toString();
    }

    const sm = this.#sm;
    // Change all new lines to symbol ','.
    const tagsWithoutNewLine = String(tags).replaceAll('\n', ',');
    // Split by comma, then split each part by whitespace.
    const parts = sm.getArrayByText(tagsWithoutNewLine, ',');

    const tagsArray = [];
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed) {
        // Keep the original tag as it was provided on input.
        tagsArray.push(trimmed);
        // Also split at transitions between letters and digits,
        // e.g. "php7" → ["php", "7"], "item123abc" → ["item", "123", "abc"].
        for (const word of this.#splitTextIntoWords(trimmed)) {
          if (word !== trimmed) {
            tagsArray.push(word);
          }
        }
      }
    }

    // Delete same tags.
    const tagsSet = new Set(tagsArray);

    // Convertation from Set to Array.
    return Array.from(tagsSet);
  }

  /**
   * Splits text into words by whitespace and also at transitions between
   * letters and digits, so "php7" becomes ["php", "7"] and "123abc" becomes
   * ["123", "abc"]. Standalone numbers stay intact.
   */
  #splitTextIntoWords(text) {
    const words = [];
    for (const chunk of String(text).split(/\s+/)) {
      if (!chunk) {
        continue;
      }
      const parts = chunk.split(/(?<=[\p{L}])(?=[\p{N}])|(?<=[\p{N}])(?=[\p{L}])/gu);
      for (const part of parts) {
        if (part) {
          words.push(part);
        }
      }
    }
    return words;
  }

  #getAdditionalTags(tags) {
    if (Array.isArray(tags) === false) {
      tags = this.#sm.getArrayByText(String(tags), ',');
    }

    const sm = this.#sm;
    const additionalTags = [];

    for (const tag of tags) {
      let additionalTag = '';

      const tagWithoutSpecialCharacters = sm.getTextWithoutSpecialCharactes(tag, ' ').trim();

      // Split also at transitions between letters and digits,
      // e.g. "php7" → "php 7", "v2 0" → "v 2 0".
      const tagSplitByNumbers = this.#splitTextIntoWords(tagWithoutSpecialCharacters).join(' ');

      if (tag !== tagSplitByNumbers) {
        additionalTag = tagSplitByNumbers;
      }

      if (
        tagWithoutSpecialCharacters !== tagWithoutSpecialCharacters.toUpperCase() &&
        tagWithoutSpecialCharacters !== tagWithoutSpecialCharacters.toLowerCase()
      ) {
        const tagWithSeparatedWords = sm.getSeparatedWordsByCamelCaseString(tagWithoutSpecialCharacters);
        additionalTag = this.#splitTextIntoWords(tagWithSeparatedWords).join(' ');
      }

      if (additionalTag) {
        additionalTags.push(additionalTag);
      }
    }

    return additionalTags;
  }
}

export default TagsNormalizer;