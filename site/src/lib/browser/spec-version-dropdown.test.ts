import assert from "node:assert/strict";
import test from "node:test";

import { initSpecVersionDropdown } from "./spec-version-dropdown.ts";

class FakeHTMLElement extends EventTarget {
  dataset: Record<string, string> = {};
  hidden = false;
  private selectorMap = new Map<string, FakeHTMLElement | null>();
  private selectorAllMap = new Map<string, FakeHTMLElement[]>();

  setQuerySelector(selector: string, value: FakeHTMLElement | null) {
    this.selectorMap.set(selector, value);
  }

  setQuerySelectorAll(selector: string, value: FakeHTMLElement[]) {
    this.selectorAllMap.set(selector, value);
  }

  querySelector(selector: string) {
    return this.selectorMap.get(selector) ?? null;
  }

  querySelectorAll(selector: string) {
    return this.selectorAllMap.get(selector) ?? [];
  }

  contains(target: EventTarget | null) {
    if (!target) {
      return false;
    }

    if (target === this) {
      return true;
    }

    for (const value of this.selectorMap.values()) {
      if (value && value.contains(target)) {
        return true;
      }
    }

    for (const values of this.selectorAllMap.values()) {
      for (const value of values) {
        if (value.contains(target)) {
          return true;
        }
      }
    }

    return false;
  }

  focus() {}
}

class FakeHTMLButtonElement extends FakeHTMLElement {
  private attributes = new Map<string, string>();

  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
  }

  getAttribute(name: string) {
    return this.attributes.get(name) ?? null;
  }
}

class FakeHTMLAnchorElement extends FakeHTMLElement {}

class FakeDocument extends EventTarget {
  dropdownRoots: FakeHTMLElement[] = [];

  querySelectorAll(selector: string) {
    if (selector === "[data-spec-version-dropdown]") {
      return this.dropdownRoots;
    }

    if (selector === "[data-spec-version-dropdown][data-open='true']") {
      return this.dropdownRoots.filter((root) => root.dataset.open === "true");
    }

    return [];
  }
}

test("initSpecVersionDropdown rebinds when a swapped root keeps the old bound marker", () => {
  const previousDocument = globalThis.document;
  const previousHTMLElement = globalThis.HTMLElement;
  const previousHTMLButtonElement = globalThis.HTMLButtonElement;
  const previousHTMLAnchorElement = globalThis.HTMLAnchorElement;

  const document = new FakeDocument();
  const root = new FakeHTMLElement();
  const toggle = new FakeHTMLButtonElement();
  const menu = new FakeHTMLElement();
  const link = new FakeHTMLAnchorElement();

  root.dataset.open = "false";
  root.dataset.specVersionBound = "true";
  root.setQuerySelector("[data-spec-version-toggle]", toggle);
  root.setQuerySelector("[data-spec-version-menu]", menu);
  menu.setQuerySelectorAll("[data-spec-version-link]", [link]);
  document.dropdownRoots = [root];

  Object.assign(globalThis, {
    document,
    HTMLElement: FakeHTMLElement,
    HTMLButtonElement: FakeHTMLButtonElement,
    HTMLAnchorElement: FakeHTMLAnchorElement
  });

  try {
    initSpecVersionDropdown();

    toggle.dispatchEvent(new Event("click"));

    assert.equal(
      root.dataset.open,
      "true",
      "expected the dropdown toggle to keep working after ClientRouter swaps in new toggle/menu elements"
    );
    assert.equal(menu.hidden, false, "expected opening the dropdown to reveal the menu");
    assert.equal(toggle.getAttribute("aria-expanded"), "true", "expected the toggle aria state to match the open menu");
  } finally {
    Object.assign(globalThis, {
      document: previousDocument,
      HTMLElement: previousHTMLElement,
      HTMLButtonElement: previousHTMLButtonElement,
      HTMLAnchorElement: previousHTMLAnchorElement
    });
  }
});
