export function tagMarkup(tags, limit) {
  return tags
    .slice(0, limit)
    .map((tag) => `<span class="tag-chip">${tag}</span>`)
    .join("");
}

export function techButtonMarkup(tags) {
  return tags.map((tag) => `<button type="button" class="tag-chip" data-tech="${tag}">${tag}</button>`).join("");
}
